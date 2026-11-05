const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function api() {
  const file = path.resolve(__dirname, '../packages/api/src/review.ts');
  const calls = [];
  const envelope = { statusCode: 200, data: { meta: { page: 1, pageSize: 20, pages: 3, total: 51 }, result: [] } };
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = new Module(file);
  const localRequire = Module.createRequire(file);
  mod.filename = file;
  mod.require = id => id === './http' ? { http: { get(url) { calls.push(url); return Promise.resolve(envelope); } } } : localRequire(id);
  mod._compile(compiled, file);
  return { client: mod.exports.reviewApi, calls, envelope };
}

test('customer paging uses one-based defaults and preserves the backend envelope', async () => {
  const { client, calls, envelope } = api();
  assert.equal(await client.getReviewsByCustomerPage(42), envelope);
  assert.equal(calls[0], '/api/v1/reviews/customer/42/paginated?page=1&size=20');
});
test('order paging keeps the requested page and caps size at the server maximum', async () => {
  const { client, calls } = api();
  await client.getReviewsByOrderPage(7, { page: 2, size: 999 });
  assert.equal(calls[0], '/api/v1/reviews/order/7/paginated?page=2&size=100');
});
test('legacy names are encoded without losing Vietnamese or query delimiters', async () => {
  const { client, calls } = api();
  const name = 'Quán A & B/Phở';
  await client.getReviewsByTargetPage('restaurant', name, { page: 3, size: 10 });
  const url = new URL(calls[0], 'http://fixture.test');
  assert.equal(url.pathname, '/api/v1/reviews/target/paginated');
  assert.equal(url.searchParams.get('targetName'), name);
  assert.equal(url.searchParams.get('page'), '3');
});
test('stable target IDs use the existing canonical endpoint', async () => {
  const { client, calls } = api();
  await client.getReviewsByTargetId('driver', 17);
  const url = new URL(calls[0], 'http://fixture.test');
  assert.equal(url.pathname, '/api/v1/reviews/target-id');
  assert.equal(url.searchParams.get('targetId'), '17');
  assert.equal(url.searchParams.get('reviewTarget'), 'driver');
  assert.equal(url.searchParams.has('targetName'), false);
});
test('invalid page values fail before making a request', () => {
  const { client, calls } = api();
  for (const params of [{ page: 0 }, { page: NaN }, { size: 2.5 }, { size: -1 }]) {
    assert.throws(() => client.getReviewsByCustomerPage(42, params), RangeError);
  }
  assert.equal(calls.length, 0);
});
test('existing order review array call is retained for the checkout/order hook', async () => {
  const { client, calls } = api();
  await client.getReviewsByOrderId(7);
  assert.equal(calls[0], '/api/v1/reviews/order/7');
});
