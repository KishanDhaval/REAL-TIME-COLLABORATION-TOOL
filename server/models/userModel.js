const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: [],
    },
  ],
});

// Register method to create a new user
userSchema.statics.register = async function (name, userName, email, password) {
  if (!name) throw Error("Name is required.");
  if (!userName) throw Error("UserName is required.");
  if (!email) throw Error("Email is required.");
  if (!password) throw Error("Password is required.");
  if (!validator.isEmail(email)) throw Error("Invalid email format.");
  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must be stronger (8+ chars, mix of letters, numbers, symbols)."
    );
  }

  const existingUser = await this.findOne({ email });
  if (existingUser) throw Error("An account with this email already exists.");

  const existingUserName = await this.findOne({ userName });
  if (existingUserName) throw Error("This userName is already taken.");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    userName,
    email,
    password: hash,
  });

  return user;
};

// Login method for user authentication
userSchema.statics.login = async function (email, password) {
  if (!email) throw Error("Email is required.");
  if (!password) throw Error("Password is required.");
  if (!validator.isEmail(email)) throw Error("Invalid email format.");

  const user = await this.findOne({ email });
  if (!user) throw Error("Invalid login credentials");

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Invalid login credentials");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
