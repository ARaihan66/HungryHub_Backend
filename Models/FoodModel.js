const { Schema, model } = require("mongoose");

const foodSchema = Schema({
  id: Number,
  name: String,
  price: Number,
  totalPrice: Number,
  quantity: Number,
  rating: Number,
  image: String,
  userId: String,
});

const foodModel = model("food", foodSchema);

module.exports = foodModel;
