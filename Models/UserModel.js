const { Schema, model, default: mongoose } = require("mongoose");

const userSchema = Schema({
  userName: {
    type: String,
    required: [true, "Please provide your name."],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
  },
  cartItems: {
    type: Array,
    default: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
    },
  },
  otp: {
    type: Number,
    default: 0,
  },
});

const userModel = model("user", userSchema);

module.exports = userModel;
