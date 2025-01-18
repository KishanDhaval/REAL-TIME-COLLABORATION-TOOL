require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Document = require('./models/Document');
const connectDB = require("./config/db");
const authRoute = require('./routes/authRoute');
const roomRoute = require('./routes/roomRoute');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// database connection
connectDB();

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: ["GET", "POST"], // Allow GET and POST methods
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit('load-document', document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on('save-document', async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

const defaultValue = "";
async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;

  return await Document.create({
    _id: id,
    data: defaultValue,
  });
}

app.use('/api/auth', authRoute);
app.use('/api/rooms', roomRoute);

// Rest API
app.get("/", (req, res) => {
  res.send({
      msg: "welcome"
  });
});

// Start the server
const PORT = process.env.PORT || 3000; // Fallback to port 5000 if not set
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
