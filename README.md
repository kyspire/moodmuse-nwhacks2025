# open-cv-playlist

make sure you're using the virtual environment!

cd open-cv-playlist 

python3.9 -m venv nwhacks ~ in the open-cv-playlist folder, this creates a virtual environment 

source nwhacks/bin/activate ~ to activate, make 2 terminals. One for the frontend and one for backend. 

pip install -r requirements.txt ~ to install the requirements 

pip install deepface

pip install tf-keras 

(we forgot to add these)

In frontend folder, cd into my-app and run: npm run dev

In backend folder, run: python3 app.py


To set up spotify environment: go into Spotify Dev and go into dashboard. Add the project details. Use 
http://localhost:5173/callback as the redirect_uri and take the personal spotify token. Make a .env file with VITE_SPOTIFY_CLIENT_ID= your id here

