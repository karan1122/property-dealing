// Backend/scripts/createAdmin.js
// Run from inside the Backend folder:
//   node scripts/createAdmin.js

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User     = require("../models/User");

const ADMIN = {
  name:     "Super Admin",
  email:    "admin@crestovia.com",
  password: "Admin@1234",
  contact:  "9429291486",
  role:     "admin",
};

(async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is not set. Check your .env file.");
    console.error("   Looking for .env at:", path.join(__dirname, "../.env"));
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log("ℹ️  Admin already exists:", ADMIN.email);
      process.exit(0);
    }

    await User.create(ADMIN);
    console.log("🎉 Admin created successfully!");
    console.log("   Email   :", ADMIN.email);
    console.log("   Password:", ADMIN.password);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();