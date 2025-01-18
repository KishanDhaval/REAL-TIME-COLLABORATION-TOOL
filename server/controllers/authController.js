const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const registerController = async (req, res) => {
  const { name, userName, email, password } = req.body;
  
  try {
    // Create a new user
    const user = await User.register(name, userName, email, password);

    // Generate a token for the new user
    const token = createToken(user._id);

    // Select the user excluding the password field and populate necessary fields
    const userWithoutPassword = await User.findById(user._id)
      .select("-password")

    // Send response with user info and token
    res.status(200).json({
      success: true,
      message: "Welcome",
      user: {
        ...userWithoutPassword.toObject(), // Convert Mongoose document to plain object
        token, // Append the token to the user object
      },
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    // Select the user excluding the password field and add the token
    const userWithoutPassword = await User.findById(user._id)
      .select("-password")

    res.status(200).json({
      success: true,
      message: "Welcome back!!!",
      user: {
        ...userWithoutPassword.toObject(),
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  registerController,
  loginController,
};
