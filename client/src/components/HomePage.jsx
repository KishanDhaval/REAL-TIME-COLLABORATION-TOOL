import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useAuthContext } from "../hooks/useAuthContext";
import toast from "react-hot-toast";
import "./homePage.css"; // Import custom CSS
import { useLogout } from "../hooks/useLogout";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { logout } = useLogout(); // Get the logout function

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
      setRooms((prevRooms) =>
        prevRooms.filter((room) => room.roomId !== roomId)
      );
      toast.success("You have left the room successfully!");
    } catch (err) {
      toast.error("Error leaving the room!");
      console.error(err.message);
    }
  };

  return (
    <div className="homepage">
      <header>
        <div className="header-content">
          <h1>Welcome {user.name}</h1>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="room-container">
        <div className="create-room">
          <h2>Create a Room</h2>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter Room Name"
          />
          <button className="btn" onClick={handleCreateRoom}>
            Create Room
          </button>
        </div>

        <div className="join-room">
          <h2>Join a Room</h2>
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            placeholder="Enter Room ID"
          />
          <button className="btn" onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      </div>

      <div className="rooms-list">
        <h2>Your Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room._id} className="room-item">
              <div className="room-info">
                <span>
                  {room.roomName} (ID: {room.roomId})
                </span>
              </div>
              <div className="room-actions">
                <button
                  className="btn join"
                  onClick={() => navigate(`/document/${room.roomId}`)}
                >
                  Join
                </button>
                <button
                  className="btn copy"
                  onClick={() => handleCopyRoomId(room.roomId)}
                >
                  ID
                </button>
                <button
                  className="btn leave"
                  onClick={() => handleLeaveRoom(room.roomId)}
                >
                  Leave
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
