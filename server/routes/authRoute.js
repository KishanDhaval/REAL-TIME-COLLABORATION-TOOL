const express = require("express");
const {
  registerController,
  loginController,
  updateProfile,
  updatePhoto,
  getAllSavedSubmission,
  getAllUser,
} = require("../controllers/authController");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);


module.exports = router;
