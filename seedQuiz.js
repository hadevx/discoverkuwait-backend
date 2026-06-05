const dotenv = require("dotenv");
const quizzes = require("./data/quizzes.js");
const Quiz = require("./models/quizModel.js");
const dbConnect = require("./config/db.js");

dotenv.config();
dbConnect();

const GREEN = "\x1b[32m";
const RED   = "\x1b[31m";
const RESET = "\x1b[0m";

async function run() {
  try {
    await Quiz.deleteMany();
    await Quiz.insertMany(quizzes);
    console.log(`${GREEN} Quizzes seeded (${quizzes.length} exam(s))${RESET}`);
  } catch (err) {
    console.log(`${RED} Failed to seed quizzes: ${err.message}${RESET}`);
  }
  process.exit();
}

run();
