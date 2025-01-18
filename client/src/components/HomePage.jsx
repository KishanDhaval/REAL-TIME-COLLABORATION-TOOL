import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const navigate = useNavigate();

  // Fetch user-specific rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axiosInstance.get("/api/rooms/user");
        setRooms(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchRooms();
  }, []);

  // Create a new room
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert("Room name cannot be empty!");
      return;
    }

    try {
      const { data } = await axiosInstance.post(
        "/api/rooms/create",
        { roomName, roomId: Math.random().toString(36).substr(2, 8) }
      );
      setRooms((prevRooms) => [...prevRooms, data]);
      setRoomName("");
    } catch (err) {
      console.error(err.message);
      alert("Error creating room!");
    }
  };

  // Join a room by its ID
  const handleJoinRoom = async () => {
    if (!roomIdInput.trim()) {
      alert("Please enter a valid room ID!");
      return;
    }

    try {
      // Save the room to the user's list
      const { data } = await axiosInstance.post("/api/rooms/join", {
        roomId: roomIdInput,
      });

      // Add the room to the state
      setRooms((prevRooms) => [...prevRooms, data]);

      // Navigate to the room
      navigate(`/document/${roomIdInput}`);
    } catch (err) {
      console.error(err.message);
      alert("Error joining the room!");
    }
  };

  // Copy room ID to clipboard
  const handleCopyRoomId = (roomId) => {
    navigator.clipboard.writeText(roomId).then(
      () => {
        alert(`Room ID "${roomId}" copied to clipboard!`);
      },
      (err) => {
        console.error("Failed to copy Room ID: ", err);
        alert("Failed to copy Room ID!");
      }
    );
  };

  return (
    <div className="homepage">
      <h1>Welcome to the Room Manager</h1>

      {/* Room Creation */}
      <div>
        <h2>Create a New Room</h2>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>

      {/* Join Room */}
      <div>
        <h2>Join a Room</h2>
        <input
          type="text"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
          placeholder="Enter room ID"
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>

      {/* List User's Rooms */}
      <div>
        <h2>Your Rooms</h2>
        {rooms.length > 0 ? (
          <ul>
            {rooms.map((room) => (
              <li
                key={room._id}
                style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
              >
                <span style={{ flex: 1 }}>
                  {room.roomName} (ID: {room.roomId})
                </span>
                <button onClick={() => navigate(`/document/${room.roomId}`)} style={{ marginRight: "10px" }}>
                  Join
                </button>
                <button onClick={() => handleCopyRoomId(room.roomId)}>Copy Room ID</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rooms found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
