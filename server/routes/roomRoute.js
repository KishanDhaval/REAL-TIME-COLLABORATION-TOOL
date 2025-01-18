const express = require("express");
const router = express.Router();
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const { requireSignin } = require("../middlewares/authMiddleware");

// Create a new room and associate with user
router.post("/create", requireSignin, async (req, res) => {
  try {
    const { roomId, roomName } = req.body;
    const userId = req.user._id;

    // Check if the room ID already exists
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ error: "Room ID already exists" });
    }

    // Create the room
    const room = await Room.create({ roomId, roomName, users: [userId] });

    // Add the room to the user's room list
    await User.findByIdAndUpdate(userId, { $addToSet: { rooms: room._id } });

    res.status(201).json(room);
  } catch (err) {
    console.error(err);
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
    // Find the room by roomId
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found!" });
    }

    const userId = req.user._id;

    // Add the room to the user's rooms list if not already present
    await User.findByIdAndUpdate(userId, { $addToSet: { rooms: room._id } });

    // Add the user to the room's users list if not already present
    await Room.findByIdAndUpdate(room._id, { $addToSet: { users: userId } });

    res.status(200).json({ message: "Joined room successfully", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error joining the room!" });
  }
});


router.post("/leave", requireSignin, async (req, res) => {
  const { roomId } = req.body;
  const userId = req.user._id;

  try {
    // Find the room by ID
    const room = await Room.findOne({roomId});
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Remove the room from the user's rooms list
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { rooms: room._id } }, // Pull the specific room by its ObjectId
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the user from the room's users list
    await Room.findByIdAndUpdate(
      room._id,
      { $pull: { users: userId } }, // Pull the specific user by their ID
      { new: true }
    );

    // Check if the room has any users left and delete if empty
    const updatedRoom = await Room.findById(room._id);
    if (updatedRoom && updatedRoom.users.length === 0) {
      await Room.findByIdAndDelete(updatedRoom._id);
    }

    res.json({
      message: "Successfully left the room",
      user,
      room: updatedRoom,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to leave the room" });
  }
});

module.exports = router;
