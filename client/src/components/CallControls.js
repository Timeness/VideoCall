import React from 'react';

const CallControls = ({ toggleVideo, toggleAudio }) => {
  return (
    <div className="call-controls">
      <button onClick={toggleVideo}>Toggle Video</button>
      <button onClick={toggleAudio}>Toggle Audio</button>
    </div>
  );
};

export default CallControls;
