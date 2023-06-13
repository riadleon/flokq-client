import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatRoom() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [newRoom, setNewRoom] = useState('');

  useEffect(() => {
    fetchRooms();
    fetchMessages();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages');
      setChat(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const joinRoom = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/join', { username, room });
      console.log(response.data);
      fetchRooms();
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const leaveRoom = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/leave', { username, room });
      console.log(response.data);
      setSelectedRoom('');
      setRoom('');
      fetchRooms();
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/send', { username, room, message });
      console.log(response.data);
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoomSelection = async (selectedRoom) => {
    try {
      const existingUser = await axios.post('http://localhost:8000/api/join', { username, room: selectedRoom });
      if (existingUser.data.error) {
        console.error(existingUser.data.error);
      } else {
        setSelectedRoom(selectedRoom);
        setRoom(selectedRoom);
        joinRoom();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addRoom = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/rooms', { name: newRoom });
      console.log(response.data);
      setNewRoom('');
      setRoom(newRoom);
      joinRoom();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredChat = chat.filter((data) => data.room === selectedRoom);

  return (
    <div className="flex">
      <div className="w-1/4 h-screen bg-gray-200">
        <h1 className="text-2xl font-bold p-4">Chat Rooms</h1>
        <ul className="p-4">
          {rooms.map((room) => (
            <li
              key={room}
              className={`py-2 px-4 cursor-pointer hover:bg-gray-300 ${room === selectedRoom ? 'bg-gray-300' : ''}`}
              onClick={() => handleRoomSelection(room)}
            >
              {room}
            </li>
          ))}
        </ul>
        <div className="p-4">
          <input
            type="text"
            placeholder="Add Room"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 mr-2"
          />
          <button
            onClick={addRoom}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Add Room
          </button>
        </div>
      </div>
      <div className="w-3/4 h-screen bg-white">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Chat Room</h1>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 mr-2"
            />
            {room && (
              <button
                onClick={leaveRoom}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 ml-2"
              >
                Leave Room
              </button>
            )}
          </div>
          <div className="border border-gray-300 rounded p-4">
            {filteredChat.map((data) => (
              <div key={data.id} className="mb-2">
                <strong>{data.username}: </strong>
                <span>{data.message}</span>
              </div>
            ))}
          </div>
          {room && (
            <>
              <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 mr-2 my-10"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Send
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
