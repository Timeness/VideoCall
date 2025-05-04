import { useEffect, useRef } from 'react';

export default function VideoPlayer({ stream, isLocal = false }) {
  const videoRef = useRef();

  useEffect(() => {
    if (stream && typeof stream === 'object' && stream.stream) {
      videoRef.current.srcObject = stream.stream;
    } else if (stream instanceof MediaStream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted={isLocal}
      className="w-full h-80 object-cover"
    />
  );
}
