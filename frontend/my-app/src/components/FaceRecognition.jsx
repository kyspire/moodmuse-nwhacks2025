import React, { useState, useEffect } from "react";

const FaceRecognition = () => {
  const [emotion, setEmotion] = useState(null); // Store detected emotion
  const [playlistUrl, setPlaylistUrl] = useState(null); // Store playlist URL

  const handleCaptureEmotion = async () => {
    try {
      // Request to capture emotion
      const emotionResponse = await fetch("http://127.0.0.1:5000/capture_emotion");
      const emotionData = await emotionResponse.json();
      const detectedEmotion = emotionData.emotion || "other"; // Default to "other" if no emotion detected

      setEmotion(detectedEmotion); // Update the detected emotion

      // Request to save emotion and get playlist URL
      const saveEmotionResponse = await fetch("http://127.0.0.1:5000/save_emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotion: detectedEmotion }),
      });

      const saveEmotionData = await saveEmotionResponse.json();
      if (saveEmotionResponse.ok) {
        setPlaylistUrl(saveEmotionData.playlist); // Update playlist URL
      } else {
        console.error("Error saving emotion:", saveEmotionData.error);
      }
    } catch (error) {
      console.error("Error capturing emotion:", error);
    }
  };

  const handlePlayOnSpotify = () => {
    if (playlistUrl) {
      window.open(playlistUrl, "_blank"); // Open Spotify playlist in a new tab
    }
  };

  useEffect(() => {
    // Ensure the video feed is loaded on mount
    const videoFeed = document.getElementById("video-feed");
    if (videoFeed) {
      videoFeed.src = "http://127.0.0.1:5000/video_feed"; // Set the video feed source
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Face Emotion Detection</h1>
      <p>Below is the live video feed. Click the button to capture emotion and find a matching playlist!</p>

      {/* Live Video Feed */}
      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <img
          id="video-feed"
          alt="Live Video Feed"
          style={{
            border: "1px solid #ddd",
            maxWidth: "640px",
            width: "100%",
            height: "auto",
            aspectRatio: "4 / 3",
          }}
        />
      </div>

      {/* Capture Emotion Button */}
      <button onClick={handleCaptureEmotion}>Capture Emotion</button>

      {/* Detected Emotion and Playlist Preview */}
      {emotion && (
        <div style={{ marginTop: "20px" }}>
          <p>Detected Emotion: <strong>{emotion}</strong></p>
          {playlistUrl && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              {/* Spotify Embed */}
              <iframe
                src={`https://open.spotify.com/embed/playlist/${playlistUrl.split("playlist/")[1]?.split("?")[0]}`}
                width="300"
                height="380"
                frameBorder="0"
                allow="encrypted-media"
                style={{
                  display: "block",
                  margin: "0 auto",
                }}
                title="Spotify Playlist"
              ></iframe>

              {/* Play on Spotify Button */}
              <button
                onClick={handlePlayOnSpotify}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#1DB954", // Spotify green
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Play on Spotify
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;