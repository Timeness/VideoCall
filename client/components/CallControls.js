export default function CallControls({ onMute, onVideo, onEnd }) {
  return (
    <div className="flex justify-center space-x-6 mt-8">
      <button onClick={onMute} className="btn btn-primary">
        Toggle Mute
      </button>
      <button onClick={onVideo} className="btn btn-primary">
        Toggle Video
      </button>
      <button onClick={onEnd} className="btn btn-danger">
        End Call
      </button>
    </div>
  );
}
