// models/Room.js
const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  roomName: { type: String, required: true },
  documentData: { type: Object, default: "" },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", RoomSchema);
