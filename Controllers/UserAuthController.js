const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");


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
    return res.status(500).json({
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
    return res.status(500).json({
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Reset password
const ResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const existedUser = userModel.findOne({ email });

    if (!existedUser) {
      return res.status(400).json({
        success: false,
        message: "Please sign up first",
      });
    }

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "f5757980f565d4",
        pass: "c734798d54eb51",
      },
    });
    const info = await transporter.sendMail({
      from: process.env.SENDER, // sender address
      to: email, // list of receivers
      subject: "New OTP has been generated", // Subject line
      //text: "Hello world?", // plain text body
      html: `<h3>Your Generated OTP : ${otp}</h3>`, // html body
    });

    if (info.messageId) {
      await userModel.findOneAndUpdate(
        { email },
        {
          $set: {
            otp: otp,
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "OTP has been sent to your mail",
      });
    }

    res.status(400).json({
      success: false,
      message: "Failed to send OTP",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify OTP
const VerifyOtp = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const hashPassword = await bcrypt.hash(newPassword, 10);

    const existedUser = await userModel.findOneAndUpdate(
      { otp },
      {
        $set: {
          password: hashPassword,
          otp: 0,
        },
      },
      {
        new: true,
      }
    );

    if (!existedUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP has been successfully reseted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get user details
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  userRegistration,
  UserLogin,
  UserLogOut,
  ResetPassword,
  VerifyOtp,
  GetUser,
};
