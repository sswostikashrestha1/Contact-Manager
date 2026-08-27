const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Enable CORS with credentials support
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// JSON and URL-encoded body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded contact images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session management with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "contact_manager_secret_123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/contact-manager",
    }),
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production if HTTPS is used
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Contact Manager API is running" });
});

// MongoDB connection & server listen
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/contact-manager";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });