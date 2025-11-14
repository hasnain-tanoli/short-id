const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected 🟢");
  } catch (err) {
    console.error("MongoDB connection error 🔴:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
