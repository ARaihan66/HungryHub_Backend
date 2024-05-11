const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//User registration
const userRegistration = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check for missing fields
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // Check if user with the same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await userModel.create({
      userName,
      email,
      password: hashedPassword,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: "User registration successful",
      data: newUser,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User login
const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields",
      });
    }

    // Find user by email
    const existingUser = await userModel.findOne({ email });

    // Check if user exists and password is correct
    if (
      existingUser &&
      (await bcrypt.compare(password, existingUser.password))
    ) {
      // Generate JWT token
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );

      // Set the token in a cookie
      res.cookie("Token", token, { httpOnly: true, secure: true });

      // Respond with success message
      return res.status(200).json({
        success: true,
        message: "User login successful",
      });
    }

    // Invalid credentials
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//User Log out
const UserLogOut = async (req, res) => {
  try {
    // Clear the 'Token' cookie
    res.clearCookie("Token");

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get user
const GetUser = async (req, res) => {
  try {
    const { id } = req.id;

    // Find the existed user
    const existingUser = await findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user is found, return success response with user data
    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: existingUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { userRegistration, UserLogin, UserLogOut, GetUser };
