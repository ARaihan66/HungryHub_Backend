const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database successfully connected.");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {connectionDB}
