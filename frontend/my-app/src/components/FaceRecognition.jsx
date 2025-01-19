// src/components/FaceRecognition.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FaceRecognition = () => {
  const navigate = useNavigate();
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [token, setToken] = useState(null);
  const [capturedFrame, setCapturedFrame] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    
    // If we have a hash, try to get the token
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const newToken = params.get("access_token");
      
      if (newToken) {
        sessionStorage.setItem('spotify_token', newToken);
        setToken(newToken);
        window.history.pushState({}, null, window.location.pathname);
      } else {
        // No valid token in hash
        sessionStorage.removeItem('spotify_token');
        navigate("/");
      }
    } else {
      // No hash, check sessionStorage
      const storedToken = sessionStorage.getItem('spotify_token');
      if (!storedToken) {
        // No stored token, go to login
        navigate("/");
      } else {
        setToken(storedToken);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear all session storage
    setToken(null);
    navigate('/');
  };

  // If no token, don't render anything
  if (!token) {
    return null;
  }

  const captureAndSendEmotion = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/capture_emotion");
      const data = await response.json();

      const emotion = data.emotion || "No face detected";

      // Convert the hex string back to binary data and create a blob URL
      if (data.frame) {
        const frameBytes = new Uint8Array(data.frame.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const blob = new Blob([frameBytes], { type: 'image/jpeg' });
        const frameUrl = URL.createObjectURL(blob);
        setCapturedFrame(frameUrl);
      }

      await fetch("http://127.0.0.1:5000/save_emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotion }),
      });

      setDominantEmotion(emotion);

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
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
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
        <button 
          onClick={captureAndSendEmotion}
          style={{
            marginTop: '20px',
            backgroundColor: '#1DB954',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Capture and Save Emotion
        </button>
        {dominantEmotion && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>Detected Emotion: {dominantEmotion}</p>
            {capturedFrame && (
              <div style={{ marginTop: '10px' }}>
                <p>Captured Frame:</p>
                <img 
                  src={capturedFrame} 
                  alt="Captured Frame" 
                  style={{
                    border: '1px solid #ddd',
                    maxWidth: '320px',
                    width: '100%',
                    height: 'auto'
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceRecognition;