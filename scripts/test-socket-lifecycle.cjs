const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function fixture(callbacks = {}) {
  let transport;
  class Client {
    active = false; connected = false; wires = []; sent = [];
    constructor(config) { this.config = config; transport = this; }
    activate() { this.active = true; }
    deactivate() { this.active = false; this.connected = false; return Promise.resolve(); }
    connect() { this.connected = true; this.config.onConnect({}); }
    close() { this.connected = false; this.config.onWebSocketClose({}); }
    subscribe(destination, callback) {
      if (!this.connected) throw new TypeError('There is no underlying STOMP connection');
      const wire = { id: String(this.wires.length), destination, callback, removed: false,
        unsubscribe: () => {
          if (!this.connected) throw new Error('Cannot unsubscribe a closed transport');
          wire.removed = true;
        } };
      this.wires.push(wire);
      return wire;
    }
    publish(message) { assert.equal(this.connected, true); this.sent.push(message); }
  }
  const full = path.resolve(__dirname, '../packages/socket/src/socket-client.ts');
  const mod = new Module(full);
  mod.require = id => {
    if (id === '@stomp/stompjs') return { Client };
    if (id === 'sockjs-client') return class SockJS {};
    throw new Error(id);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(full, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText, full);
  const socket = new mod.exports.SocketClient({ url: '/ws', token: 'test-only', ...callbacks });
  return { socket, transport };
}

test('subscription before activation waits for CONNECT; cancellation stays cancelled', () => {
  const { socket, transport } = fixture();
  let calls = 0;
  socket.subscribe('/kept', () => calls++);
  socket.subscribe('/cancelled', () => {}).unsubscribe();
  assert.equal(transport.wires.length, 0);
  socket.activate(); transport.connect();
  assert.deepEqual(transport.wires.map(w => w.destination), ['/kept']);
  transport.wires[0].callback({ body: '{}' });
  assert.equal(calls, 1);
});

test('abrupt close updates state once, reconnect restores each destination once and ignores old frames', () => {
  let disconnects = 0; let calls = 0;
  const { socket, transport } = fixture({ onDisconnect: () => disconnects++ });
  socket.activate(); transport.connect();
  socket.subscribe('/a', () => calls++);
  const old = transport.wires[0];
  transport.close(); transport.config.onDisconnect();
  assert.equal(socket.connected, false);
  assert.equal(disconnects, 1);
  socket.subscribe('/b', () => calls++);
  assert.equal(transport.wires.length, 1);
  transport.connect();
  assert.deepEqual(transport.wires.map(w => w.destination), ['/a', '/a', '/b']);
  old.callback({ body: '{}' });
  assert.equal(calls, 0);
  transport.wires[1].callback({ body: '{}' });
  assert.equal(calls, 1);
});

test('two consumers share one wire and cleanup only removes the owning listener', () => {
  const { socket, transport } = fixture();
  socket.activate(); transport.connect();
  let first = 0; let second = 0;
  const a = socket.subscribe('/same', () => first++);
  const b = socket.subscribe('/same', () => second++);
  assert.equal(transport.wires.length, 1);
  a.unsubscribe();
  transport.wires[0].callback({ body: '{}' });
  assert.equal(first, 0); assert.equal(second, 1);
  assert.equal(transport.wires[0].removed, false);
  b.unsubscribe();
  assert.equal(transport.wires[0].removed, true);
});

test('cleanup after transport loss and deactivate are safe; late CONNECT cannot revive a retired client', async () => {
  const { socket, transport } = fixture();
  let calls = 0;
  socket.activate(); transport.connect();
  const handle = socket.subscribe('/a', () => calls++);
  const old = transport.wires[0];
  transport.close(); handle.unsubscribe();
  await socket.deactivate();
  transport.connect(); old.callback({ body: '{}' });
  assert.equal(socket.connected, false);
  assert.equal(transport.wires.length, 1);
  assert.equal(calls, 0);
});

test('offline publish is not queued or replayed after reconnect', () => {
  const { socket, transport } = fixture();
  assert.equal(socket.publish('/gps', { latitude: 1 }), false);
  socket.activate(); transport.connect();
  assert.equal(transport.sent.length, 0);
  assert.equal(socket.publish('/chat', { message: 'hello' }), true);
  assert.deepEqual(transport.sent, [{ destination: '/chat', body: '{"message":"hello"}' }]);
  transport.close();
  assert.equal(socket.publish('/chat', {}), false);
});

test('frames from an unsubscribed wire cannot reach a new listener at the same destination', () => {
  const { socket, transport } = fixture();
  let calls = 0;
  socket.activate(); transport.connect();
  socket.subscribe('/a', () => {}).unsubscribe();
  socket.subscribe('/a', () => calls++);
  transport.wires[0].callback({ body: '{}' });
  assert.equal(calls, 0);
});

test('deactivate/reactivate restores newly registered listeners without reviving old ones', async () => {
  const { socket, transport } = fixture();
  let oldCalls = 0;
  socket.activate(); transport.connect();
  socket.subscribe('/a', () => oldCalls++);
  await socket.deactivate();
  let calls = 0;
  socket.subscribe('/a', () => calls++);
  socket.activate(); transport.connect();
  transport.wires.at(-1).callback({ body: '{}' });
  assert.equal(calls, 1);
  assert.equal(oldCalls, 0);
});

test('STOMP ERROR invalidates readiness and retains subscriptions for the next connection', () => {
  let errors = 0; let calls = 0;
  const { socket, transport } = fixture({ onStompError: () => errors++ });
  socket.activate(); transport.connect();
  socket.subscribe('/a', () => calls++);
  transport.config.onStompError({ headers: { message: 'rejected' } });
  assert.equal(socket.connected, false);
  assert.equal(socket.publish('/a', {}), false);
  assert.equal(errors, 1);
  transport.close(); transport.connect();
  transport.wires.at(-1).callback({ body: '{}' });
  assert.equal(calls, 1);
});
