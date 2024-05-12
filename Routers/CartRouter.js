const router = require("express").Router();
const authorization = require("../Authorization/Authorization");
const {
  AddToCart,
  RemoveFromCart,
  IncrementQuantity,
  DecrementQuantity,
  CheckOut,
  GetCartItem,
} = require("../Controllers/CartController");


//Public route
router.route("/add-to-cart/:id").post(AddToCart);
router.route("/get-cart/:id").get(GetCartItem);
router.route("/remove-from-cart/:id").delete(RemoveFromCart);
router.route("/increment-quantity/:id").put(IncrementQuantity);
router.route("/decrement-quantity/:id").put(DecrementQuantity);

//Protected route
router.route("/check-out").get(authorization, CheckOut);

module.exports = router;
