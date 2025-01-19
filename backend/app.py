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
                try:
                    # Preprocess: Convert to grayscale and equalize histogram
                    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    equalized_frame = cv2.equalizeHist(gray_frame)
                    processed_frame = cv2.cvtColor(equalized_frame, cv2.COLOR_GRAY2BGR)

                    # Analyze the current frame with DeepFace to detect emotions
                    result = DeepFace.analyze(processed_frame, actions=['emotion'], detector_backend='mtcnn', enforce_detection=False)

                    # Ensure result is a list (handles multiple faces)
                    faces = result if isinstance(result, list) else [result]

                    for face_data in faces:
                        dominant_emotion = face_data['dominant_emotion']

                        # Draw rectangle and label around the detected face
                        x, y, w, h = face_data['region']['x'], face_data['region']['y'], face_data['region']['w'], face_data['region']['h']
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                        label = f'Emotion: {dominant_emotion}'
                        text_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                        text_x = x + w - text_size[0]
                        text_y = y - 10 if y - 10 > 20 else y + 20
                        cv2.rectangle(frame, (text_x - 5, text_y - 25), (text_x + text_size[0] + 5, text_y), (0, 255, 0), -1)
                        cv2.putText(frame, label, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2, cv2.LINE_AA)

                except Exception as e:
                    print(f"Error in DeepFace analysis: {e}")

                # Encode the frame as JPEG
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

        result = DeepFace.analyze(processed_frame, actions=['emotion'], detector_backend='mtcnn', enforce_detection=False)

        faces = result if isinstance(result, list) else [result]
        dominant_emotion = faces[0]['dominant_emotion'] if faces else "No face detected"
        
        return jsonify({"emotion": dominant_emotion})

    except Exception as e:
        print(f"Error in emotion capture: {e}")
        return jsonify({"error": "Emotion capture failed"}), 500

@app.route("/save_emotion", methods=["POST"])
def save_emotion():
    data = request.json  # Receive the JSON data from the frontend
    emotion = data.get("emotion", "")
    
    if emotion:
        # Save the emotion in a file (you can change this to a database or other storage)
        with open("detected_emotions.txt", "a") as file:
            file.write(f"{emotion}\n")
        return jsonify({"message": "Emotion saved successfully!"}), 200
    else:
        return jsonify({"error": "No emotion provided!"}), 400

if __name__ == "__main__":
    app.run(debug=True)
