import React from "react";

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>OpenCV Face Recognition</h1>
      <p>Below is the live video feed from the backend:</p>
      <img
        src="/video_feed"
        alt="Webcam Feed"
        style={{ border: "1px solid #ddd", width: "640px", height: "480px" }}
      />
    </div>
  );
}

export default App;
