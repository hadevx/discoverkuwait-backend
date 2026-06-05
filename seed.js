const dotenv = require("dotenv");

const users = require("./data/users.js");
const words = require("./data/words.js");
const quizzes = require("./data/quizzes.js");

const Quiz = require("./models/quizModel.js");
const User = require("./models/userModel.js");
const Word = require("./models/wordModel.js");

const dbConnect = require("./config/db.js");

dotenv.config();
dbConnect();

// Hard-coded colors
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

const seedData = async () => {
  try {
    console.log(`${GREEN} Starting seeding... ${RESET}`);

    // Seed Users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers.find((u) => u.isAdmin);
    console.log(`${GREEN} Users seeded (${users.length}) ${RESET}`);

    // Seed Quizzes
    await Quiz.insertMany(quizzes);
    console.log(`${GREEN} Quizzes seeded (${quizzes.length}) ${RESET}`);

    // Seed Words (linked to admin user)
    const wordsWithUser = words.map((w) => ({ ...w, user: adminUser._id }));
    await Word.insertMany(wordsWithUser);
    console.log(`${GREEN} Words seeded (${words.length}) ${RESET}`);

    console.log(`${GREEN} Seeding process finished ${RESET}`);
    process.exit();
  } catch (err) {
    console.log(`${RED} Seeding failed: ${err.message} ${RESET}`);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Quiz.deleteMany();
    await Word.deleteMany();

    console.log(`${GREEN} Data Destroyed${RESET}`);
    process.exit();
  } catch (err) {
    console.log(`${RED} Error destroying data: ${err.message}${RESET}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
