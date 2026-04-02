const ITEM_COUNT = process.env.ITEM_COUNT;
const MAX_INVENTORY_PER_ITEM = process.env.MAX_INVENTORY_PER_ITEM;
const ITEM_PRICE = process.env.ITEM_PRICE;

const state = {
  insertedCoins: 0,
  inventory: Array(Number(ITEM_COUNT)).fill(MAX_INVENTORY_PER_ITEM)
};
// testing
// console.log(ITEM_COUNT)
// console.log(state.inventory);

function resetState() {
  state.insertedCoins = 0;
  state.inventory = Array(ITEM_COUNT).fill(MAX_INVENTORY_PER_ITEM);
}

function isValidItemId(id) {
  // omg all the tests * eye roll
  // if(!Number.isInteger(id)){
  //   console.log("here1");
  // }
  // if(! id <=0){
  //   console.log('here 2');
  // }
  // if(!(id < 3)){
  //   console.log("here3");
  // }
  return Number.isInteger(id) && id >= 0 && id < 3;
}

module.exports = {
  state,
  resetState,
  isValidItemId,
  ITEM_COUNT,
  MAX_INVENTORY_PER_ITEM,
  ITEM_PRICE
};