const router = require("express").Router();
const {
  userRegistration,
  UserLogin,
  UserLogOut,
  GetUser,
} = require("../Controllers/UserAuthController");
const { authorization } = require("../Authorization/Authorization");

//Public router
router.route("/sign-up").post(userRegistration);
router.route("/sign-in").post(UserLogin);

//Protected router
router.route("/sign-out").get(authorization, UserLogOut);
router.route("/get").get(authorization, GetUser);

module.exports = router;
