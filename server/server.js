require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require("./config/db");
const authRoute = require('./routes/authRoute');
const roomRoute = require('./routes/roomRoute');
const path = require("path")
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const _dirname = path.resolve();

// database connection
connectDB();


app.use('/api/auth', authRoute);
app.use('/api/rooms', roomRoute);


app.use(express.static(path.join(_dirname , "/client/dist")))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(_dirname, 'client', 'dist', 'index.html'));
});


// Start the server
const PORT = process.env.PORT || 3000; // Fallback to port 5000 if not set
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: ["GET", "POST"], // Allow GET and POST methods
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (roomId) => {
    try {
      const room = await createOrFindRoom(roomId, `Room-${roomId}`); // Default room name
      socket.join(roomId); // Join the socket to the room

      socket.emit('load-document', room.documentData); // Send document data

      socket.on("send-changes", (delta) => {
        socket.broadcast.to(roomId).emit("receive-changes", delta); // Emit changes to other clients in the room
      });

      socket.on("save-document", async (data) => {
        await Room.findOneAndUpdate(
          { roomId: roomId },
          { documentData: data }, // Save as object
          { new: true }
        );
      });
    } catch (err) {
      console.error(err.message);
      socket.emit("error", "Failed to load or create document.");
    }
  });
});


const Room = require('./models/roomModel');

// Create or find a room with its associated document
async function createOrFindRoom(roomId, roomName) {
  let room = await Room.findOne({ roomId });

  if (!room) {
    // Room doesn't exist, create a new one
    room = await Room.create({
      roomId,
      roomName,
      documentData: "", // Initialize document with empty content
    });
  }

  return room;
}
