from flask import Flask, Response, request, jsonify
from flask_cors import CORS  # Import CORS for handling cross-origin requests
import cv2
from deepface import DeepFace

# Initialize Flask app
app = Flask(__name__)

# Enable CORS globally for all routes
CORS(app)  # This enables CORS for all routes automatically

# Open webcam
camera = cv2.VideoCapture(0)

@app.route("/video_feed")
def video_feed():
    def generate_frames():
        while True:
            # Capture frame-by-frame from the webcam
            success, frame = camera.read()
            if not success:
                break
            else:
                # Simple frame encoding without any processing
                _, buffer = cv2.imencode('.jpg', frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

@app.route("/capture_emotion", methods=["GET"])
def capture_emotion():
    # Capture frame from webcam
    success, frame = camera.read()
    if not success:
        return jsonify({"error": "Failed to capture frame"}), 500

    try:
        # Preprocess and analyze the frame for emotion detection
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        equalized_frame = cv2.equalizeHist(gray_frame)
        processed_frame = cv2.cvtColor(equalized_frame, cv2.COLOR_GRAY2BGR)

        result = DeepFace.analyze(processed_frame, actions=['emotion'],
                                detector_backend='mtcnn',
                                enforce_detection=False)

        faces = result if isinstance(result, list) else [result]
        dominant_emotion = faces[0]['dominant_emotion'] if faces else "No face detected"

        # Draw on a copy of the frame to avoid modifying the video feed
        display_frame = frame.copy()
        for face_data in faces:
            # Draw rectangle and emotion label
            x, y, w, h = face_data['region']['x'], face_data['region']['y'], face_data['region']['w'], face_data['region']['h']
            cv2.rectangle(display_frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            label = f'Emotion: {dominant_emotion}'
            cv2.putText(display_frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        # Save the annotated frame
        _, buffer = cv2.imencode('.jpg', display_frame)

        return jsonify({
            "emotion": dominant_emotion,
            "frame": buffer.tobytes().hex()  # Send the annotated frame to frontend
        })

    except Exception as e:
        print(f"Error in emotion capture: {e}")
        return jsonify({"error": "Emotion capture failed"}), 500

@app.route("/save_emotion", methods=["POST"])
def save_emotion():
    data = request.json  # Receive the JSON data from the frontend
    emotion = data.get("emotion", "")

    emotion_messages = {
        "angry": "I am feeling angry today.",
        "surprised": "I am feeling surprised today.",
        "happy": "I am happy today.",
        "sad": "I am feeling sad today.",
        "neutral": "I am feeling neutral today."
    }

    # Use the dictionary to determine the message
    message = emotion_messages.get(emotion)

    if message:
        # Save the corresponding message to a file
        with open("detected_emotions.txt", "a") as file:
            file.write(f"{message}\n")
        return jsonify({"message": "Emotion saved successfully!"}), 200
    else:
        return jsonify({"error": "Invalid or no emotion provided!"}), 400

if __name__ == "__main__":
    app.run(debug=True)
