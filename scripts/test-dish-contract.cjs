const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function load(relative, http) {
  const file = path.resolve(__dirname, '../packages/api/src/restaurant', relative);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = new Module(file);
  mod.filename = file;
  mod.require = id => {
    if (id === '../http') return { http };
    if (id === './mappers/dish.mapper') return load('mappers/dish.mapper.ts');
    throw new Error(`Unexpected runtime dependency: ${id}`);
  };
  mod._compile(compiled, file);
  return mod.exports;
}

// Names are verified by DishWireContractTest against the real controller/Jackson DTOs.
function wire() {
  return { id: 7, name: 'Dish', description: '', price: 10, imageUrl: '', availabilityQuantity: 7,
    menuOptionGroupCount: 1, menuOptionGroups: [{ id: 3, name: 'Size', minChoices: 0, maxChoices: 1,
      menuOptions: [{ id: 8, name: 'Regular', priceAdjustment: 0, available: false }] }] };
}
const mapper = () => load('mappers/dish.mapper.ts');

test('read maps actual Java group, limits, option price and availability fields', () => {
  const dish = mapper().mapBackendDishToFrontend(wire());
  assert.deepEqual(dish.optionGroups[0], { id: '3', title: 'Size', required: false, minSelect: 0, maxSelect: 1,
    options: [{ id: '8', name: 'Regular', price: 0, isAvailable: false }] });
});
test('read then write keeps persisted IDs and never re-enables an unavailable option', () => {
  const { mapBackendDishToFrontend: read, mapFrontendDishToBackend: write } = mapper();
  const body = write(read(wire()));
  assert.equal(body.menuOptionGroups[0].groupName, 'Size');
  assert.equal(body.menuOptionGroups[0].id, 3);
  assert.equal(body.menuOptionGroups[0].menuOptions[0].id, 8);
  assert.equal(body.menuOptionGroups[0].menuOptions[0].isAvailable, false);
  assert.equal('name' in body.menuOptionGroups[0], false);
});
test('temporary group/option IDs become null and omitted availability stays omitted', () => {
  const { mapBackendDishToFrontend: read, mapFrontendDishToBackend: write } = mapper();
  const dish = read(wire());
  dish.optionGroups[0].id = 'new-group';
  dish.optionGroups[0].options[0].id = 'new-choice';
  delete dish.optionGroups[0].options[0].isAvailable;
  const body = JSON.parse(JSON.stringify(write(dish)));
  assert.equal(body.menuOptionGroups[0].id, null);
  assert.equal(body.menuOptionGroups[0].menuOptions[0].id, null);
  assert.equal('isAvailable' in body.menuOptionGroups[0].menuOptions[0], false);
});
test('zero stock and zero choice limits survive while omitted groups remain omitted', () => {
  const { mapBackendDishToFrontend: read, mapFrontendDishToBackend: write } = mapper();
  const dish = read(wire()); dish.availableQuantity = 0;
  dish.optionGroups[0].minSelect = 0; dish.optionGroups[0].maxSelect = 0;
  let body = JSON.parse(JSON.stringify(write(dish)));
  assert.equal(body.availabilityQuantity, 0);
  assert.equal(body.menuOptionGroups[0].maxChoices, 0);
  delete dish.optionGroups;
  body = JSON.parse(JSON.stringify(write(dish)));
  assert.equal('menuOptionGroups' in body, false);
});
test('missing choice limits stay omitted instead of resetting stored limits to zero', () => {
  const { mapBackendDishToFrontend: read, mapFrontendDishToBackend: write } = mapper();
  const dish = read(wire()); delete dish.optionGroups[0].minSelect; delete dish.optionGroups[0].maxSelect;
  const body = JSON.parse(JSON.stringify(write(dish)));
  assert.equal('minChoices' in body.menuOptionGroups[0], false);
  assert.equal('maxChoices' in body.menuOptionGroups[0], false);
});
test('required is derived from the backend minimum choice count', () => {
  const dto = wire(); dto.menuOptionGroups[0].minChoices = 1;
  assert.equal(mapper().mapBackendDishToFrontend(dto).optionGroups[0].required, true);
});
test('dish API update sends the backend request shape and preserves the response envelope', async () => {
  const envelope = { statusCode: 200, message: 'Updated', data: wire() };
  let sent;
  const { dishApi } = load('dish.api.ts', { put: async (url, body) => { sent = { url, body }; return envelope; } });
  const result = await dishApi.updateDish(mapper().mapBackendDishToFrontend(wire()));
  assert.equal(sent.url, '/api/v1/dishes');
  assert.equal(sent.body.menuOptionGroups[0].groupName, 'Size');
  assert.equal(sent.body.menuOptionGroups[0].menuOptions[0].isAvailable, false);
  assert.equal(result.statusCode, 200); assert.equal(result.message, 'Updated');
  assert.equal(result.data.optionGroups[0].options[0].isAvailable, false);
});
test('restaurant-menu mapping also retains unavailable options for later edits', () => {
  const { mapBackendRestaurantMenu } = load('mappers/restaurant.mapper.ts');
  const menu = mapBackendRestaurantMenu({ id: 1, name: 'Restaurant', dishes: [{ id: 2, name: 'Category', dishes: [wire()] }] });
  assert.equal(menu.dishes[0].optionGroups[0].options[0].isAvailable, false);
});
