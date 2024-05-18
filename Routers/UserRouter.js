const router = require("express").Router();
const {
  UserRegistration,
  UserLogin,
  UserLogOut,
  GetUser,
} = require("../Controllers/UserAuthController");
const { authorization } = require("../Authorization/Authorization");

//Public router
router.route("/sign-up").post(UserRegistration);
router.route("/sign-in").post(UserLogin);

//Protected router
router.route("/sign-out").get(authorization, UserLogOut);
router.route("/get").get(authorization, GetUser);

module.exports = router;
