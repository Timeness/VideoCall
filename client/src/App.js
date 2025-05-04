import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoCall from './components/VideoCall';
import './App.css';

function App() {
  const [roomId, setRoomId] = useState('');

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Secure Video Call</h1>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <div className="join-room">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <a href={`/room/${roomId}`} className="join-button">
                  Join Room
                </a>
              </div>
            }
          />
          <Route path="/room/:roomId" element={<VideoCall />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
