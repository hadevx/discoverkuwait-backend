// Import
const path = require("path");
const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/db.js");
const dotenv = require("dotenv");
const helmet = require("helmet");

const {
  productRoutes,
  userRoutes,
  orderRoutes,
  uploadRoutes,
  storeRoutes,
  courseRoutes,
  paymentRoutes,
  topicRoutes,
  wordRoutes,
  quizRoutes,
  forumPostRoutes,
} = require("./routes/index.js");

const { notFound, errorHandle } = require("./middleware/errorMiddleware.js");
const cookieParser = require("cookie-parser");

dotenv.config();

// Connect to DB BEFORE starting server
dbConnect();

// Intialize express app
const app = express();
// app.set("trust proxy", 1);

// app.use(helmet());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000", //admin
      "http://localhost:5173", //storefront
      "https://auknotes.webschema.online",
      "https://auknotes-admin.webschema.online",
      "https://auknotes.com",
      "https://admin.auknotes.com",
      "http://localhost:8081", //react native
      "https://discoverkuwait.org",
      "https://admin.discoverkuwait.org",
    ],
    credentials: true,
  }),
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/forum", forumPostRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/update-store-status", storeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/payment", paymentRoutes);

/* app.use(
  "/uploads",
  express.static("/app/uploads", {
    maxAge: "30d", // browser cache max-age
    etag: true, // enable ETag headers
    setHeaders: (res, path) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
); */
app.use(
  "/uploads/categories",
  express.static("/app/uploads/categories", {
    maxAge: "30d",
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  }),
);
app.use(
  "/uploads/forum",
  express.static("/app/uploads/forum", {
    maxAge: "30d",
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  }),
);

app.get("/", (req, res) => {
  res.send("API intialized");
});

// Error handlers
app.use(notFound);
app.use(errorHandle);

app.listen(process.env.PORT, (req, res) => {
  console.log("Connecting to DB & Listening on port " + process.env.PORT);
});
