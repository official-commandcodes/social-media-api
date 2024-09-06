const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGODB successfully connected :)");
  } catch (err) {
    console.log(`Error connecting to the DB`);
    console.log(err.message);
  }
}

module.exports = { connectDB };
