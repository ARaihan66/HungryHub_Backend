const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");

//User registration
const userRegistration = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existedUser = await findOne({ email });

    if (existedUser) {
      res.status(400).json({
        success: false,
        message: "Please Login",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const saveUser = await userModel.create({
      userName,
      email,
      password: hashPassword,
    });

    res.status(200).json({
      success: true,
      message: "User registration successful",
      data: saveUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
