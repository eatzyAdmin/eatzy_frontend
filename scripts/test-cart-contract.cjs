const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path'); const Module = require('node:module'); const ts = require('typescript');
function api(rows=[]) {
 const file=path.resolve(__dirname,'../packages/api/src/cart.ts');const calls=[];const envelope={statusCode:200,message:'ok',data:{result:rows}};
 const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const mod=new Module(file);mod.filename=file;mod.require=id=>{assert.equal(id,'./http');return {http:{get:(...args)=>{calls.push(args);return Promise.resolve(envelope);}}};};mod._compile(compiled,file);return {client:mod.exports.cartApi,calls,envelope};
}
test('restaurant cart uses a single owner-scoped page instead of loading every cart',async()=>{const cart={id:8,restaurant:{id:42}};const {client,calls}=api([cart]);const response=await client.getCartForRestaurant(42);assert.equal(response.data,cart);assert.equal(response.message,'ok');assert.deepEqual(calls,[['/api/v1/carts',{params:{page:1,size:1,filter:'restaurantId:42'}}]]);});
test('empty scoped page becomes a missing cart',async()=>{const {client}=api();assert.equal((await client.getCartForRestaurant(42)).data,null);});
test('invalid restaurant IDs never issue a request',async()=>{const {client,calls}=api();for(const id of [-1,0,NaN,Infinity,1.5])await assert.rejects(client.getCartForRestaurant(id),/Invalid restaurant ID/);assert.equal(calls.length,0);});

const helperPath = path.resolve(__dirname, '../apps/customer/src/features/cart/utils/cart-request.ts');
const helperModule = new Module(helperPath);
helperModule._compile(ts.transpileModule(fs.readFileSync(helperPath, 'utf8'), {
 compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, helperPath);
const { selectedMenuOptions, addCartItem } = helperModule.exports;

test('one pasta choice exposed as both addon and group sends only one menu option', () => {
 const options = selectedMenuOptions({ addons: [{ id: '42' }], groups: [{ options: [{ id: '42' }] }] });
 assert.deepEqual(options, [{ id: 42 }]);
 assert.deepEqual(addCartItem([], 7, 1, options), [
  { dish: { id: 7 }, quantity: 1, cartItemOptions: [{ menuOption: { id: 42 } }] },
 ]);
});

test('variant, addons and groups preserve every distinct choice, including free options', () => {
 assert.deepEqual(selectedMenuOptions({ variant: { id: '1' }, addons: [{ id: '2' }],
  groups: [{ options: [{ id: 1 }, { id: 2 }, { id: '3' }] }] }), [{ id: 1 }, { id: 2 }, { id: 3 }]);
 assert.deepEqual(selectedMenuOptions({ addons: [] }), []);
 assert.deepEqual(selectedMenuOptions({ addons: [], groups: [{ options: [{ id: '3' }] }] }), [{ id: 3 }]);
});

const line = (dishId, ids, quantity = 1) => ({ id: 90, dish: { id: dishId }, quantity,
 cartItemOptions: ids.map((id, index) => ({ id: index + 100, menuOption: { id } })),
});

test('same dish with the same option set increases quantity regardless of option order', () => {
 const original = [line(7, [1, 2], 2)];
 const result = addCartItem(original, 7, 3, [{ id: 2 }, { id: 1 }]);
 assert.equal(result.length, 1); assert.equal(result[0].quantity, 5);
 assert.equal(result[0].id, 90);
 assert.equal(result[0].cartItemOptions[0].id, 100);
 assert.equal(original[0].quantity, 2);
});

test('same dish with different selections stays on separate lines; different dishes never merge', () => {
 for (const options of [[{ id: 2 }], []]) {
  const result = addCartItem([line(7, [1])], 7, 1, options);
  assert.equal(result.length, 2); assert.equal(result[0].quantity, 1);
  assert.deepEqual(result[1].cartItemOptions, options.map(option => ({ menuOption: option })));
 }
 assert.equal(addCartItem([line(7, [1])], 8, 1, [{ id: 1 }]).length, 2);
 assert.equal(addCartItem([line(7, [])], 7, 2).at(0).quantity, 3);
});
