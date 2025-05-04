import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    router.push(`/call/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId) router.push(`/call/${roomId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container py-12">
        <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ConnectSphere
        </h1>
        <p className="text-xl mb-10 opacity-80">Join or create a secure video call with up to 4 friends!</p>
        <div className="space-y-6 max-w-md">
          <button onClick={createRoom} className="btn btn-primary w-full">
            Create New Room
          </button>
          <div className="flex space-x-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="border-2 border-blue-500 bg-gray-800 rounded-full px-4 py-3 w-full focus:outline-none focus:border-purple-500"
            />
            <button onClick={joinRoom} className="btn btn-primary">
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
