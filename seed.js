const dotenv = require("dotenv");
const users = require("./data/users.js");
const courses = require("./data/courses.js");
const topics = require("./data/topics.js");
const words = require("./data/words.js");

const User = require("./models/userModel.js");
const Topic = require("./models/topicModel.js");
const Delivery = require("./models/deliveryModel.js");
const Store = require("./models/storeModel.js");
const Course = require("./models/courseModel.js");
const Word = require("./models/wordModel.js");

const dbConnect = require("./config/db.js");

dotenv.config();
dbConnect();

// Hard-coded colors
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

const seedData = async () => {
  let createdUsers;
  try {
    createdUsers = await User.insertMany(users);
    console.log(`${GREEN} Users seeded${RESET}`);
  } catch (err) {
    console.log(`${RED} Failed to seed users: ${err.message}${RESET}`);
  }

  try {
    await Course.insertMany(courses);

    console.log(`${GREEN} Courses seeded${RESET}`);
  } catch (err) {
    console.log(`${RED} Failed to seed courses: ${err.message}${RESET}`);
  }

  try {
    await Delivery.create({ timeToDeliver: "today", shippingFee: 0, minDeliveryCost: 0 });
    await Store.create({ status: "active" });

    console.log(`${GREEN} Delivery and Store seeded${RESET}`);
  } catch (err) {
    console.log(`${RED} Failed to seed delivery/store: ${err.message}${RESET}`);
  }

  try {
    const adminUser = createdUsers.find((u) => u.isAdmin);

    const x = topics.map((topic, i) => {
      if (i < 2 && adminUser) {
        // First 2 topics by admin
        return { ...topic, author: adminUser._id };
      } else {
        // Remaining topics assigned round-robin to non-admin users
        const nonAdminUsers = createdUsers.filter((u) => !u.isAdmin);
        const user = nonAdminUsers[i % nonAdminUsers.length]; // round-robin safely
        return { ...topic, author: user._id };
      }
    });

    await Topic.insertMany(x);
    await Word.insertMany(words);
    console.log(`${GREEN} Topics seeded${RESET}`);
  } catch (err) {
    console.log(`${RED} Failed to seed topics: ${err.message}${RESET}`);
  }

  console.log(`${GREEN} Seeding process finished${RESET}`);
  process.exit();
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Topic.deleteMany();

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
