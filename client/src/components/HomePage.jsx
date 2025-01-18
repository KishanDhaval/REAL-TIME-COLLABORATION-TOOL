import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useAuthContext } from "../hooks/useAuthContext";
import toast from "react-hot-toast";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthContext();


  // Fetch rooms for the logged-in user
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axiosInstance.get("/api/rooms/user");
        setRooms(data);
      } catch (err) {
        toast.error("Failed to fetch rooms.");
        console.error(err.message);
      }
    };

    fetchRooms();
  }, []);

  // handleCreateRoom function
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      toast.error("Room name cannot be empty!");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/api/rooms/create", {
        roomName,
        roomId: Math.random().toString(36).substr(2, 8),
      });
      setRooms((prevRooms) => [...prevRooms, data]);
      setRoomName("");
      toast.success("Room created successfully!");
    } catch (err) {
      toast.error("Error creating room.");
      console.error(err.message);
    }
  };

  // handleJoinRoom function
  const handleJoinRoom = async () => {
    if (!roomIdInput.trim()) {
      toast.error("Please enter a valid room ID!");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/api/rooms/join", {
        roomId: roomIdInput,
      });
      setRooms((prevRooms) => [...prevRooms, data]);
      navigate(`/document/${roomIdInput}`);
      toast.success("Successfully joined the room!");
    } catch (err) {
      toast.error("Error joining the room!");
      console.error(err.message);
    }
  };

  // handleCopyRoomId function
  const handleCopyRoomId = (roomId) => {
    navigator.clipboard.writeText(roomId).then(
      () => {
        toast.success(`Room ID "${roomId}" copied to clipboard!`);
      },
      (err) => {
        toast.error("Failed to copy Room ID.");
        console.error("Failed to copy Room ID: ", err);
      }
    );
  };

  // handleLeaveRoom function
  const handleLeaveRoom = async (roomId) => {
    try {
      await axiosInstance.post("/api/rooms/leave", { roomId });
      setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));
      toast.success("You have left the room successfully!");
    } catch (err) {
      toast.error("Error leaving the room!");
      console.error(err.message);
    }
  };

  
  return (
    <div className="homepage">
      <h1>Welcome {`${user.name}`}</h1>

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

      <ul>
        {rooms.map((room) => (
          <li
            key={room._id}
            style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
          >
            <span style={{ flex: 1 }}>
              {room.roomName} (ID: {room.roomId})
            </span>
            <button
              onClick={() => navigate(`/document/${room.roomId}`)}
              style={{ marginRight: "10px" }}
            >
              Join
            </button>
            <button
              onClick={() => handleCopyRoomId(room.roomId)}
              style={{ marginRight: "10px" }}
            >
              Copy Room ID
            </button>
            <button onClick={() => handleLeaveRoom(room.roomId)} style={{ color: "red" }}>
              Leave Room
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
