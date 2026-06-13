const asyncHandler = require("../middleware/asyncHandler");
const Store = require("../models/storeModel");

const updateStoreStatus = asyncHandler(async (req, res) => {
  const {
    status, banner, bannerBg, bannerTextColor, price,
    quizEnabled, forumEnabled, dictionaryEnabled, leaderboardEnabled,
    pointsPerCorrectAnswer, forumAutoApprove,
  } = req.body;

  const store = await Store.findOne({});
  if (store) {
    store.status = status || store.status;
    store.price = price;
    store.banner = banner;
    if (bannerBg) store.bannerBg = bannerBg;
    if (bannerTextColor) store.bannerTextColor = bannerTextColor;
    if (typeof quizEnabled === "boolean") store.quizEnabled = quizEnabled;
    if (typeof forumEnabled === "boolean") store.forumEnabled = forumEnabled;
    if (typeof dictionaryEnabled === "boolean") store.dictionaryEnabled = dictionaryEnabled;
    if (typeof leaderboardEnabled === "boolean") store.leaderboardEnabled = leaderboardEnabled;
    if (typeof pointsPerCorrectAnswer === "number") store.pointsPerCorrectAnswer = pointsPerCorrectAnswer;
    if (typeof forumAutoApprove === "boolean") store.forumAutoApprove = forumAutoApprove;
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
