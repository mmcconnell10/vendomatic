const express = require("express");
const {
  state,
  isValidItemId,
  // ITEM_PRICE_IN_COINS my .env stopped working for some reason.. just hard coded to save time
} = require("./state");

const router = express.Router();

// get all inventory
router.get("/inventory", (req, res) => {
  return res.status(200).json(state.inventory);
});

// inventory of specific item
router.get("/inventory/:id", (req, res) => {
  const { id } = req.params;

  if (!isValidItemId(id)) {
    return res.status(404).json({ error: "Item not found." });
  }

  return res.status(200).json(state.inventory[Number(id)]);
});

// buy item
router.put("/inventory/:id", (req, res) => {
  const { id } = req.params;
  const index = Number(id);

  if (!isValidItemId(index)) {
    return res
      .status(404)
      .set("X-Coins", String(state.insertedCoins))
      .json({ error: "Item not found." });
  }

  if (state.inventory[index] === 0) {
    return res
      .status(404)
      .set("X-Coins", String(state.insertedCoins))
      .json({ error: "Item out of stock." });
  }

  if (state.insertedCoins < 2) {
    return res
      .status(403)
      .set("X-Coins", String(state.insertedCoins))
      .json({ error: "Insufficient coins." });
  }

  state.inventory[index] -= 1;

  const change = state.insertedCoins - 2;
  state.insertedCoins = 0;

  return res
    .status(200)
    .set("X-Coins", String(change))
    .set("X-Inventory-Remaining", String(state.inventory[index]))
    .json({ quantity: 1 });
});

// Insert Coin
router.put("/", (req, res) => {
  const { coin } = req.body || {};

  if (coin !== 1) {
    return res.status(400).json({
      error: "Only one US quarter may be inserted at a time."
    });
  }

  state.insertedCoins += 1;

  return res.status(204).set("X-Coins", String(state.insertedCoins)).send();
});

router.delete("/", (req, res) => {
  const coinsToReturn = state.insertedCoins;
  state.insertedCoins = 0;

  return res.status(204).set("X-Coins", String(coinsToReturn)).send();
});

module.exports = router;