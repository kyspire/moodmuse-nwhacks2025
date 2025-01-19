import os
from dotenv import load_dotenv
import base64
import json
from requests import post, get
import random

load_dotenv()

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
redirect_uri = "http://localhost:3000"  # Your redirect URI


# Fetch user-specific access token using authorization code
def get_user_token(auth_code):
    auth_string = client_id + ':' + client_secret
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": redirect_uri
    }
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    if result.status_code == 200:
        return json_result["access_token"]
    else:
        print(f"Error fetching token: {json_result}")
        return None


# Generate authorization headers for API requests
def get_auth_header(token):
    return {"Authorization": "Bearer " + token}


# Fetch all songs from a playlist
def get_playlist_tracks(token, playlist_id):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = get_auth_header(token)
    result = get(url, headers=headers)

    if result.status_code == 200:
        json_result = json.loads(result.content)
        return json_result["items"]
    else:
        print(f"Error fetching playlist tracks: {result.status_code}")
        return None


# Randomly choose a song from a playlist and return its URI
def choose_random_song_uri_from_playlist(token, playlist_id):
    tracks = get_playlist_tracks(token, playlist_id)
    if not tracks:
        print("No tracks found in the playlist.")
        return None

    random_track = random.choice(tracks)
    track_uri = random_track["track"]["uri"]
    return track_uri


# Add a song to the playback queue
def add_song_to_queue(token, track_uri):
    url = f"https://api.spotify.com/v1/me/player/queue?uri={track_uri}"
    headers = get_auth_header(token)
    result = post(url, headers=headers)

    if result.status_code == 204:
        print(f"Successfully added to queue: {track_uri}")
    else:
        print(f"Failed to add to queue. Status Code: {result.status_code} - {result.json()}")


# Main Section
print("Visit the following URL to authorize your account:")
print(
    f"https://accounts.spotify.com/authorize?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope=user-modify-playback-state%20playlist-read-private"
)
auth_code = input("Enter the authorization code from the URL: ")

# Get user-specific access token
user_token = get_user_token(auth_code)

if user_token:
    # Use your created playlist's link or ID
    playlist_link = "https://open.spotify.com/playlist/0dMexqq0XIWS3QJ74z3ZhD?si=cd53535e2b1c4aa9"
    playlist_id = playlist_link.split("/")[-1].split("?")[0]

    # Randomly choose and add a song to the playback queue
    random_song_uri = choose_random_song_uri_from_playlist(user_token, playlist_id)
    if random_song_uri:
        print(f"Random Song URI: {random_song_uri}")
        add_song_to_queue(user_token, random_song_uri)
    else:
        print("Could not fetch a random song.")
else:
    print("Could not authenticate user.")



