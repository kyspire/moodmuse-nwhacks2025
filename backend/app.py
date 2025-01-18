from flask import Flask, Response
from flask_cors import CORS
import cv2
from deepface import DeepFace

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for development purposes

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
                    # Analyze the current frame for both age and emotion
                    result = DeepFace.analyze(frame, actions=['age', 'emotion'], enforce_detection=False)

                    # Check if the result is a list (multiple faces)
                    faces = result if isinstance(result, list) else [result]

                    # Loop through detected faces
                    for face_data in faces:
                        # Get bounding box for the detected face
                        x, y, w, h = face_data['region']['x'], face_data['region']['y'], face_data['region']['w'], face_data['region']['h']

                        # Get the detected age and emotion
                        detected_age = face_data['age']
                        dominant_emotion = face_data['dominant_emotion']

                        # Draw a rectangle around the detected face
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

                        # Combine Age and Emotion into a single label
                        label = f'Age: {int(detected_age)} | Emotion: {dominant_emotion}'

                        # Calculate the position for the label (top-right corner of the rectangle)
                        text_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                        text_x = x + w - text_size[0]
                        text_y = y - 10 if y - 10 > 20 else y + 20

                        # Draw a filled rectangle behind the text for visibility
                        cv2.rectangle(frame, (text_x - 5, text_y - 25), (text_x + text_size[0] + 5, text_y), (0, 255, 0), -1)

                        # Display the combined age and emotion label
                        cv2.putText(frame, label, (text_x, text_y),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2, cv2.LINE_AA)

                except Exception as e:
                    print(f"Error in DeepFace analysis: {e}")

                # Encode the frame as JPEG
                _, buffer = cv2.imencode('.jpg', frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__ == "__main__":
    app.run(debug=True)
