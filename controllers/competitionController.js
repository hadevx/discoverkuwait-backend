const asyncHandler = require("../middleware/asyncHandler");
const Competition = require("../models/competitionModel");

// GET /api/competition  — public
const getStatus = asyncHandler(async (req, res) => {
  let comp = await Competition.findOne();
  if (!comp) comp = await Competition.create({});
  res.json(comp);
});

// PATCH /api/competition  — admin only
const updateStatus = asyncHandler(async (req, res) => {
  const { isOpen, endDate } = req.body;
  let comp = await Competition.findOne();
  if (!comp) comp = await Competition.create({});
  if (typeof isOpen === "boolean") comp.isOpen = isOpen;
  if (endDate !== undefined) comp.endDate = endDate ? new Date(endDate) : null;
  await comp.save();
  res.json(comp);
});

module.exports = { getStatus, updateStatus };
