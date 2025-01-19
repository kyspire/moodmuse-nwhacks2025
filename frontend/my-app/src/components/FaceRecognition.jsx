// src/components/FaceRecognition.js
import React, { useState } from "react";

const FaceRecognition = () => {
  const [dominantEmotion, setDominantEmotion] = useState(null);

  const captureAndSendEmotion = async () => {
    try {
      // Request emotion from the backend (via the capture_emotion route)
      const response = await fetch("http://127.0.0.1:5000/capture_emotion");
      const data = await response.json();

      const emotion = data.emotion || "No face detected";  // Default to "No face detected" if no emotion is found

      // Optionally, you can also send the emotion to the backend to store it
      await fetch("http://127.0.0.1:5000/save_emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotion }),
      });

      setDominantEmotion(emotion);  // Update the state to display the current emotion

    } catch (error) {
      console.error("Error capturing emotion:", error);
    }
  };

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
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
        }}
      >
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
        <button onClick={captureAndSendEmotion}>Capture and Save Emotion</button>
        {dominantEmotion && <p>Detected Emotion: {dominantEmotion}</p>}
      </div>
    </div>
  );
};

export default FaceRecognition;
