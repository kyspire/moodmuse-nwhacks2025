import React from 'react';

const Login = () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:5173/callback";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = encodeURIComponent("user-read-private user-read-email");

  const handleLogin = () => {
    // Always clear any existing token
    sessionStorage.clear();
    
    // Force redirect to Spotify login
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&show_dialog=true`;
    
    console.log('Redirecting to:', authUrl);
    window.location.replace(authUrl); // Using replace instead of href
  };

  return (
    <div className="login-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>Emotion Detection with Spotify</h1>
      <p>Please login with your Spotify account to continue</p>
      <button 
        onClick={handleLogin}
        style={{
          backgroundColor: '#1DB954',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '25px',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default Login; 