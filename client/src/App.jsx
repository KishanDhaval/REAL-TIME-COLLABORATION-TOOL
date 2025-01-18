import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import TextEditor from "./components/TextEditor";
import { v4 as uuidV4 } from "uuid";
import "./index.css";

const HomePage = () => {
  const [roomId, setRoomId] = useState(""); // To hold generated or input room ID
  const [inputRoomId, setInputRoomId] = useState(""); // For user-entered room ID
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = uuidV4(); // Generate a unique room ID
    setRoomId(newRoomId);
  };

  const joinRoom = (id) => {
    if (id.trim()) {
      navigate(`/document/${id}`);
    } else {
      alert("Please enter a valid Room ID.");
    }
  };

  const copyToClipboard = () => {
    if (roomId.trim()) {
      navigator.clipboard.writeText(roomId);
      alert("Room ID copied to clipboard!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Collaborative Editor</h1>

      {/* Button to Create a New Room */}
      <button onClick={createRoom} style={{ margin: "10px", padding: "10px 20px" }}>
        Create Room
      </button>

      {/* Show Generated Room ID with Copy and Join Options */}
      {roomId && (
        <div>
          <p>Room ID: <strong>{roomId}</strong></p>
          <button onClick={copyToClipboard} style={{ margin: "10px", padding: "10px 20px" }}>
            Copy Room ID
          </button>
          <button onClick={() => joinRoom(roomId)} style={{ margin: "10px", padding: "10px 20px" }}>
            Join Room
          </button>
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      {/* Input to Enter an Existing Room ID */}
      <div>
        <h2>Enter Room ID to Join</h2>
        <input
          type="text"
          value={inputRoomId}
          onChange={(e) => setInputRoomId(e.target.value)}
          placeholder="Enter Room ID"
          style={{ padding: "10px", fontSize: "16px", width: "300px" }}
        />
        <button
          onClick={() => joinRoom(inputRoomId)}
          style={{ marginLeft: "10px", padding: "10px 20px" }}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/document/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
