const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
function api() {
  const file = path.resolve(__dirname, '../packages/api/src/order/order.api.ts');
  const calls = []; const envelope = { statusCode: 200, data: { result: [], meta: { page: 1, pages: 2, total: 21, pageSize: 20 } } };
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = new Module(file); mod.filename = file;
  mod.require = id => { assert.equal(id, '../http'); return { http: { get: (...args) => { calls.push(args); return Promise.resolve(envelope); }, patch: (...args) => { calls.push(args); return Promise.resolve(envelope); } } }; };
  mod._compile(compiled, file); return { client: mod.exports.orderApi, calls, envelope };
}
for (const actor of ['Customer', 'Driver', 'Restaurant']) test(`${actor} list keeps pagination and response envelope`, async () => {
  const { client, calls, envelope } = api();
  assert.equal(await client[`getOrdersBy${actor}Id`](7, { page: 2, size: 20 }), envelope);
  assert.deepEqual(calls[0], [`/api/v1/orders/${actor.toLowerCase()}/7`, { params: { page: 2, size: 20 } }]);
});
for (const [method, suffix] of [['cancelOrder', 'customer/cancel'], ['rejectOrderByRestaurant', 'restaurant/reject']]) test(`${method} sends reason in backend query parameter`, async () => {
  const { client, calls } = api(); const reason = 'Synthetic & reason / ?';
  await client[method](7, reason); assert.deepEqual(calls[0], [`/api/v1/orders/7/${suffix}`, {}, { params: { reason } }]);
});
test('customer status uses existing scoped page endpoint', async () => {
 const { client, calls } = api(); await client.getOrdersByCustomerIdAndStatus(7, 'READY', { page: 3, size: 10 });
 assert.deepEqual(calls[0], ['/api/v1/orders/customer/7', { params: { page: 3, size: 10, filter: "orderStatus:'READY'" } }]);
});
test('invalid status cannot inject filter expressions', async () => {
 const { client, calls } = api(); await assert.rejects(client.getOrdersByCustomerIdAndStatus(7, "READY' or id>0"), /Invalid order status/); assert.equal(calls.length, 0);
});
