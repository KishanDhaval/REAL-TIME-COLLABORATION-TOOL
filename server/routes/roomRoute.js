const express = require("express");
const router = express.Router();
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const { requireSignin } = require("../middlewares/authMiddleware");

// Create a new room and associate with user
router.post("/create", requireSignin, async (req, res) => {
  try {
    const { roomId, roomName } = req.body;
    const userId = req.user._id; // Extract user ID from token middleware

    // Create the room
    const room = await Room.create({ roomId, roomName, userId });

    // Add the room to the user's room list
    await User.findByIdAndUpdate(userId, { $push: { rooms: room._id } });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get rooms for the logged-in user
router.get("/user", requireSignin, async (req, res) => {
  try {
    const userId = req.user._id;

    // Populate user's rooms with details
    const user = await User.findById(userId).populate("rooms");

    res.status(200).json(user.rooms);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
});


// Join a room by ID
router.post("/join", requireSignin, async (req, res) => {
  const { roomId } = req.body;

  try {
    // Find the room by ID
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found!" });
    }

    // Check if the user is already in the room
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user.rooms.includes(room._id)) {
      user.rooms.push(room._id);
      await user.save();
    }

    res.status(200).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error joining the room!" });
  }
});

module.exports = router;
