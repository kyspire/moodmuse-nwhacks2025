import React, { useState, useEffect } from "react";

const FaceRecognition = () => {
  const [emotion, setEmotion] = useState(null);
  const [playlistUrl, setPlaylistUrl] = useState(null);

  const handleCaptureEmotion = async () => {
    try {
      const emotionResponse = await fetch("http://127.0.0.1:5000/capture_emotion");
      const emotionData = await emotionResponse.json();
      const detectedEmotion = emotionData.emotion || "other";

      setEmotion(detectedEmotion);

      const saveEmotionResponse = await fetch("http://127.0.0.1:5000/save_emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion: detectedEmotion }),
      });

      const saveEmotionData = await saveEmotionResponse.json();
      if (saveEmotionResponse.ok) {
        setPlaylistUrl(saveEmotionData.playlist);
      } else {
        console.error("Error saving emotion:", saveEmotionData.error);
      }
    } catch (error) {
      console.error("Error capturing emotion:", error);
    }
  };

  const handlePlayOnSpotify = () => {
    if (playlistUrl) {
      window.open(playlistUrl, "_blank");
    }
  };

  useEffect(() => {
    const videoFeed = document.getElementById("video-feed");
    if (videoFeed) {
      videoFeed.src = "http://127.0.0.1:5000/video_feed";
    }
  }, []);

  return (
    <div style={styles.container}>
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto+Mono:wght@400;700&display=swap");
      </style>
      <div style={styles.content}>
        <h1 style={styles.title}>Emotion-Based Music Recommender</h1>
        <p style={styles.description}>
          Detect your emotion and get a Spotify playlist tailored to your mood!
        </p>

        <div style={styles.videoContainer}>
          <img id="video-feed" alt="Live Video Feed" style={styles.videoFeed} />
        </div>

        <button style={styles.captureButton} onClick={handleCaptureEmotion}>
          Detect Emotion
        </button>

        {emotion && (
          <div style={styles.resultContainer}>
            <p style={styles.emotionText}>
              Detected Emotion: <strong>{emotion}</strong>
            </p>
            {playlistUrl && (
              <div style={styles.spotifyContainer}>
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${playlistUrl.split("playlist/")[1]?.split("?")[0]}`}
                  width="300"
                  height="380"
                  frameBorder="0"
                  allow="encrypted-media"
                  style={styles.spotifyEmbed}
                  title="Spotify Playlist"
                ></iframe>
                <button style={styles.spotifyButton} onClick={handlePlayOnSpotify}>
                  Open in Spotify
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e1e2f, #232344)",
    color: "#ffffff",
    padding: "20px",
  },
  content: {
    backgroundColor: "#2d2d3a",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.5)",
    maxWidth: "60000px",
    width: "100%",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#00d9a5",
  },
  description: {
    fontSize: "1rem",
    marginBottom: "30px",
    color: "#cccccc",
  },
  videoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  videoFeed: {
    borderRadius: "12px",
    border: "2px solid #00d9a5",
    maxWidth: "1000px",
    width: "100%",
    height: "auto",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  },
  captureButton: {
    padding: "12px 24px",
    backgroundColor: "#00d9a5",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    marginTop: "20px",
  },
  resultContainer: {
    marginTop: "30px",
  },
  emotionText: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    fontFamily: "'Roboto Mono', monospace",
    color: "#00d9a5",
  },
  spotifyContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  spotifyEmbed: {
    borderRadius: "12px",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",
    marginBottom: "20px",
  },
  spotifyButton: {
    padding: "12px 24px",
    backgroundColor: "#1DB954",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    textAlign: "center",
  },
};

export default FaceRecognition;
