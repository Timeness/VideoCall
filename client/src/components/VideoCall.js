import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import CallControls from './CallControls';
import '../App.css';

const VideoCall = () => {
  const { roomId } = useParams();
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    socketRef.current = io.connect(serverUrl);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        userVideo.current.srcObject = stream;

        socketRef.current.emit('join-room', roomId, socketRef.current.id);

        socketRef.current.on('user-connected', (userId) => {
          const peer = createPeer(userId, socketRef.current.id, stream);
          peersRef.current.push({ peerId: userId, peer });
          setPeers((prev) => [...prev, { peerId: userId, peer }]);
        });

        socketRef.current.on('signal', (data) => {
          const peerObj = peersRef.current.find((p) => p.peerId === data.userId);
          if (peerObj) {
            peerObj.peer.signal(data.signal);
          } else {
            const peer = addPeer(data.signal, data.userId, stream);
            peersRef.current.push({ peerId: data.userId, peer });
            setPeers((prev) => [...prev, { peerId: data.userId, peer }]);
          }
        });

        socketRef.current.on('user-disconnected', (userId) => {
          const peerObj = peersRef.current.find((p) => p.peerId === userId);
          if (peerObj) {
            peerObj.peer.destroy();
            peersRef.current = peersRef.current.filter((p) => p.peerId !== userId);
            setPeers((prev) => prev.filter((p) => p.peerId !== userId));
          }
        });
      });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      socketRef.current.disconnect();
    };
  }, [roomId, serverUrl]);

  const createPeer = (userId, callerId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('signal', { userId, signal });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerId, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('signal', { userId: callerId, signal });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    }
  };

  return (
    <div className="video-call-container">
      <div className="video-grid">
        <video muted ref={userVideo} autoPlay playsInline className="video" />
        {peers.map((peerObj) => (
          <Video key={peerObj.peerId} peer={peerObj.peer} />
        ))}
      </div>
      <CallControls toggleVideo={toggleVideo} toggleAudio={toggleAudio} />
    </div>
  );
};

const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video autoPlay playsInline ref={ref} className="video" />;
};

export default VideoCall;
