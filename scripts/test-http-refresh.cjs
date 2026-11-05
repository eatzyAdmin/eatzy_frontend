const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const sourcePath = path.resolve(__dirname, '../packages/api/src/http.ts');
const localRequire = Module.createRequire(sourcePath);
const axios = localRequire('axios');

function client(adapter) {
  const compiled = ts.transpileModule(fs.readFileSync(sourcePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const mod = new Module(sourcePath);
  mod.filename = sourcePath;
  mod.paths = Module._nodeModulePaths(path.dirname(sourcePath));
  mod._compile(compiled, sourcePath);
  mod.exports.http.defaults.adapter = adapter;
  mod.exports.setAccessToken('old');
  return mod.exports;
}
function unauthorized(config) {
  throw new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null,
    { status: 401, statusText: 'Unauthorized', data: { error: 'unauthorized' }, headers: {}, config });
}
const response = (config, data) => ({ status: 200, statusText: 'OK', headers: {}, config, data });
const tick = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };

test('ten concurrent failures share refresh, send only cookie credentials and retry', async () => {
  let refreshes = 0;
  const gate = deferred();
  const api = client(async config => {
    if (config.url.includes('/refresh')) {
      refreshes++;
      assert.equal(config.headers.get('Authorization'), undefined);
      assert.equal(config.withCredentials, true);
      assert.equal(config.timeout, 5000);
      await gate.promise;
      return response(config, { data: { access_token: 'new' } });
    }
    if (config.headers.get('Authorization') === 'Bearer old') return unauthorized(config);
    return response(config, { ok: true });
  });
  const pending = Promise.all(Array.from({ length: 10 }, () => api.http.get('/private')));
  await tick(); gate.resolve();
  assert.equal((await pending).length, 10);
  assert.equal(refreshes, 1);
  assert.equal(api.getAccessToken(), 'new');
});

for (const malformed of [false, true]) {
  test(`${malformed ? 'malformed successful' : 'failed'} refresh rejects every waiting request`, async () => {
    let refreshes = 0;
    const gate = deferred();
    const api = client(async config => {
      if (config.url.includes('/refresh')) {
        refreshes++; await gate.promise;
        if (malformed) return response(config, { data: {} });
      }
      return unauthorized(config);
    });
    const pending = Promise.allSettled(Array.from({ length: 10 }, () => api.http.get('/private')));
    await tick(); gate.resolve();
    const results = await Promise.race([pending, new Promise((_, reject) => {
      const timer = setTimeout(() => reject(new Error('waiters hung')), 1000); timer.unref();
    })]);
    assert.equal(refreshes, 1);
    assert.ok(results.every(result => result.status === 'rejected'));
    assert.equal(api.getAccessToken(), null);
  });
}

test('late old-token 401 reuses token instead of rotating twice', async () => {
  let refreshes = 0;
  const late = deferred();
  const api = client(async config => {
    if (config.url.includes('/refresh')) {
      refreshes++; return response(config, { access_token: 'new' });
    }
    if (config.headers.get('Authorization') === 'Bearer old') {
      if (config.url === '/late') await late.promise;
      return unauthorized(config);
    }
    return response(config, 'ok');
  });
  const pending = api.http.get('/late');
  await api.http.get('/first');
  late.resolve(); await pending;
  assert.equal(refreshes, 1);
});

test('incorrect login neither sends old bearer nor refreshes', async () => {
  let requests = 0;
  const api = client(async config => {
    requests++;
    assert.equal(config.headers.get('Authorization'), undefined);
    return unauthorized(config);
  });
  await assert.rejects(api.http.post('/api/v1/auth/login', {}));
  assert.equal(requests, 1);
  assert.equal(api.getAccessToken(), 'old');
});

test('pending refresh cannot overwrite a newer explicit login', async () => {
  const gate = deferred();
  const api = client(async config => {
    if (config.url.includes('/refresh')) {
      await gate.promise;
      return response(config, { access_token: 'stale-refresh' });
    }
    return unauthorized(config);
  });
  const pending = api.http.get('/private');
  const rejected = assert.rejects(pending);
  await tick(); api.setAccessToken('new-login'); gate.resolve();
  await rejected;
  assert.equal(api.getAccessToken(), 'new-login');
});

test('network error without config remains the original error', async () => {
  const original = new axios.AxiosError('offline');
  const api = client(async () => { throw original; });
  await assert.rejects(api.http.get('/private'), error => error === original);
});

test('late failure from previous account cannot replay an action as the newly logged-in account', async () => {
  const gate = deferred();
  let requests = 0;
  const api = client(async config => {
    requests++;
    await gate.promise;
    return unauthorized(config);
  });
  const rejected = assert.rejects(api.http.post('/private-action', { amount: 10 }));
  await tick();
  api.setAccessToken('different-account');
  gate.resolve();
  await rejected;
  assert.equal(requests, 1);
  assert.equal(api.getAccessToken(), 'different-account');
});
