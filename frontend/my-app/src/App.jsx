import React from "react";
import Header from "./components/Header";

function App() {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        margin: '0 auto',
        position: 'absolute',
        left: '0',
        right: '0',
        // Removed justify-content: 'center' to prevent vertical centering
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      }}>
        <Header />
        <h1>OpenCV Face Recognition</h1>
        <p>Below is the live video feed from the backend:</p>
        <img
          src="http://127.0.0.1:5000/video_feed"
          alt="Webcam Feed"
          style={{
            border: '1px solid #ddd',
            maxWidth: '640px',
            width: '100%',
            height: 'auto',
            aspectRatio: '4/3'
          }}
        />
      </div>
    </div>
  );
}

export default App;