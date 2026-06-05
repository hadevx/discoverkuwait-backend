const asyncHandler = require("../middleware/asyncHandler");
const Store = require("../models/storeModel");

const updateStoreStatus = asyncHandler(async (req, res) => {
  const { status, banner, bannerBg, bannerTextColor, price } = req.body;

  const store = await Store.findOne({});
  if (store) {
    store.status = status || store.status;
    store.price = price;
    store.banner = banner;
    if (bannerBg) store.bannerBg = bannerBg;
    if (bannerTextColor) store.bannerTextColor = bannerTextColor;
  }

  const updatedStatus = await store.save();
  res.json(updatedStatus);
});

const getStoreStatus = asyncHandler(async (req, res) => {
  const store = await Store.find({});

  if (store) {
    res.json(store);
  }
});

module.exports = { updateStoreStatus, getStoreStatus };
