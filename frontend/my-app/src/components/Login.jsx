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
      minHeight: '100vh',  // Ensure full viewport height
      width: '100vw',      // Ensure full viewport width
      textAlign: 'center',
      backgroundImage: `url('/login_background.jpg')`,  // Correct path for public folder
      backgroundSize: 'cover',  // Cover the whole screen
      backgroundPosition: 'center',  // Center the image
      backgroundRepeat: 'no-repeat',  // Prevent tiling
      margin: 0,
      padding: 0
    }}>
      <h1 style={{ color: 'white', fontSize: '2.5rem', textShadow: '2px 2px 5px rgba(0,0,0,0.7)' }}>
        Emotion Detection with Spotify
      </h1>
      <p style={{ color: 'white', fontSize: '1.2rem', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
        Please login with your Spotify account to continue
      </p>
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
          marginTop: '20px',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
          transition: 'transform 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1.0)'}
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
;