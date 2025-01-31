from flask import Flask, request, jsonify, render_template
import numpy as np
import pickle

app = Flask(__name__)

# Load the trained model (use the correct path to the pickled model)
model_filename = 'heart-disease-prediction-rf-model.pkl'  # Update this if needed
model = pickle.load(open(model_filename, 'rb'))

@app.route('/')
def home():
    return render_template('main.html')

# Route to handle form submission
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Retrieve form data
        age = int(request.form['age'])
        sex = int(request.form['sex'])
        cp = int(request.form['cp'])
        trestbps = int(request.form['trestbps'])
        chol = int(request.form['chol'])
        fbs = int(request.form['fbs'])
        restecg = int(request.form['restecg'])
        thalach = int(request.form['thalach'])
        exang = int(request.form['exang'])
        oldpeak = float(request.form['oldpeak'])
        slope = int(request.form['slope'])
        ca = int(request.form['ca'])
        thal = int(request.form['thal'])

        # Prepare input data for prediction
        input_data = np.array([[age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]])
        
        # Make prediction
        prediction = model.predict(input_data)
        prediction_message = 'Heart Disease' if prediction[0] == 1 else 'No Heart Disease'

        # Render result page with prediction
        return render_template('result.html', prediction=prediction_message)

    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'An error occurred while processing the request'
        })

if __name__ == '__main__':
    app.run(debug=True)
