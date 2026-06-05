const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(`Data Base Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = dbConnect;
