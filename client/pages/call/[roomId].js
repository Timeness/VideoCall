import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import VideoPlayer from '../../components/VideoPlayer';
import CallControls from '../../components/CallControls';
import Navbar from '../../components/Navbar';

const socket = io('http://localhost:5000');

export default function Call() {
  const router = useRouter();
  const { roomId } = router.query;
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [key, setKey] = useState(null);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = Math.random().toString(36).substring(2, 10);

    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      userVideo.current.srcObject = stream;
    }).catch(() => setError('Camera and microphone access required.'));

    // Handle room full error
    socket.on('room-full', () => {
      setError('Room is full (max 4 users).');
    });

    // Handle encryption key
    socket.on('key', async (jwk) => {
      const importedKey = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
      );
      setKey(importedKey);
    });

    // Join room
    socket.emit('join-room', { roomId, userId });

    // Handle existing users
    socket.on('existing-users', ({ users }) => {
      users.forEach((peerId) => {
        const peer = createPeer(peerId, socket.id, stream);
        peersRef.current.push({ peerId, peer });
        setPeers((prev) => [...prev, { peerId, peer }]);
      });
    });

    // Handle user joined
    socket.on('user-joined', ({ userId }) => {
      const peer = createPeer(userId, socket.id, stream);
      peersRef.current.push({ peerId: userId, peer });
      setPeers((prev) => [...prev, { peerId: userId, peer }]);
    });

    // Handle signaling
    socket.on('signal', async ({ from, signal }) => {
      const decryptedSignal = await decryptMessage(key, signal);
      const peerObj = peersRef.current.find((p) => p.peerId === from);
      if (peerObj) {
        peerObj.peer.signal(decryptedSignal);
      } else {
        const peer = addPeer(decryptedSignal, from, stream);
        peersRef.current.push({ peerId: from, peer });
        setPeers((prev) => [...prev, { peerId: from, peer }]);
      }
    });

    // Handle user left
    socket.on('user-left', ({ userId }) => {
      const peerObj = peersRef.current.find((p) => p.peerId === userId);
      if (peerObj) peerObj.peer.destroy();
      peersRef.current = peersRef.current.filter((p) => p.peerId !== userId);
      setPeers((prev) => prev.filter((p) => p.peerId !== userId));
    });

    return () => socket.disconnect();
  }, [roomId]);

  function createPeer(userId, callerId, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', async (signal) => {
      const encrypted = await encryptMessage(key, signal);
      socket.emit('signal', { to: userId, signal: encrypted });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on('signal', async (signal) => {
      const encrypted = await encryptMessage(key, signal);
      socket.emit('signal', { to: callerId, signal: encrypted });
    });
    peer.signal(incomingSignal);
    return peer;
  }

  async function encryptMessage(key, message) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(message));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );
    return { iv: Array.from(iv), ciphertext: Array.from(new Uint8Array(ciphertext)) };
  }

  async function decryptMessage(key, { iv, ciphertext }) {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      new Uint8Array(ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  const toggleMute = () => {
    if (stream) stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
  };

  const toggleVideo = () => {
    if (stream) stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
  };

  const endCall = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    socket.disconnect();
    router.push('/');
  };

  return (
    <div>
      <Navbar />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Room: {roomId}
        </h1>
        {error && (
          <p className="text-red-400 mb-4">{error}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="video-container">
            <VideoPlayer stream={userVideo} isLocal />
            <span className="absolute bottom-2 left-2 text-sm bg-black/50 px-2 py-1 rounded">You</span>
          </div>
          {peers.map(({ peerId, peer }) => (
            <div key={peerId} className="video-container">
              <VideoPlayer stream={peer} />
              <span className="absolute bottom-2 left-2 text-sm bg-black/50 px-2 py-1 rounded">{peerId}</span>
            </div>
          ))}
        </div>
        <CallControls onMute={toggleMute} onVideo={toggleVideo} onEnd={endCall} />
      </div>
    </div>
  );
}
