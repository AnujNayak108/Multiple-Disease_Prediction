from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Load the trained model (ensure the correct path)
model_filename = 'heart-disease-prediction-rf-model.pkl'  
try:
    model = pickle.load(open(model_filename, 'rb'))
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/')
def home():
    return jsonify({"message": "Heart Disease Prediction API is running!"})

# Prediction API
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json  
        features = [
            int(data['age']), int(data['sex']), int(data['cp']), int(data['trestbps']),
            int(data['chol']), int(data['fbs']), int(data['restecg']), int(data['thalach']),
            int(data['exang']), float(data['oldpeak']), int(data['slope']),
            int(data['ca']), int(data['thal'])
        ]
        
        input_data = np.array([features])
        prediction = model.predict(input_data)
        prediction_message = "Heart Disease" if prediction[0] == 1 else "No Heart Disease"

        return jsonify({"prediction": prediction_message})

    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An error occurred while processing the request"
        })

if __name__ == '__main__':
    app.run(debug=True)
