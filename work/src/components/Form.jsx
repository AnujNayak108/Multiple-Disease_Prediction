import React, { useState } from "react";

function PredictForm() {
    const [formData, setFormData] = useState({
        age: "", 
        sex: "", 
        cp: "", 
        trestbps: "", 
        chol: "", 
        fbs: "",
        restecg: "", 
        thalach: "", 
        exang: "", 
        oldpeak: "", 
        slope: "", 
        ca: "", 
        thal: ""
    });

    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate that all fields are filled
        const isAllFieldsFilled = Object.values(formData).every(value => value !== "");
        if (!isAllFieldsFilled) {
            setPrediction({ 
                result: "Error", 
                message: "Please fill in all fields" 
            });
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setPrediction({ 
                    result: data.prediction === "High Risk of Heart Disease" ? "High Risk" : "Low Risk",
                    message: data.prediction,
                    details: generateHealthAdvice(data.prediction)
                });
            } else {
                setPrediction({ 
                    result: "Error", 
                    message: data.error || "Something went wrong" 
                });
            }
        } catch (error) {
            setPrediction({ 
                result: "Error", 
                message: "Network error: " + error.message 
            });
        }
    };

    const generateHealthAdvice = (prediction) => {
        if (prediction === "High Risk of Heart Disease") {
            return [
                "Consult with a healthcare professional",
                "Consider a comprehensive cardiac evaluation",
                "Focus on heart-healthy lifestyle changes",
                "Monitor blood pressure and cholesterol levels"
            ];
        }
        return [
            "Maintain a healthy lifestyle",
            "Regular exercise",
            "Balanced diet",
            "Annual health check-ups"
        ];
    };

    const resetForm = () => {
        // Reset form data
        setFormData({
            age: "", sex: "", cp: "", trestbps: "", chol: "", fbs: "",
            restecg: "", thalach: "", exang: "", oldpeak: "", slope: "", ca: "", thal: ""
        });
        // Clear prediction
        setPrediction(null);
    };

    const ResultCard = () => {
        if (!prediction) return null;

        const isHighRisk = prediction.result === "High Risk";
        const isError = prediction.result === "Error";

        return (
            <div className={`
                mt-6 p-6 rounded-lg shadow-lg w-full max-w-md
                ${isHighRisk ? 'bg-red-100 border-4 border-red-500' : 
                  isError ? 'bg-yellow-100 border-4 border-yellow-500' : 
                  'bg-green-100 border-4 border-green-500'}
            `}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`
                        text-2xl font-bold
                        ${isHighRisk ? 'text-red-700' : 
                          isError ? 'text-yellow-700' : 
                          'text-green-700'}
                    `}>
                        {isHighRisk ? "⚠️ High Risk" : 
                         isError ? "❌ Error" : 
                         "✅ Low Risk"}
                    </h2>
                    <button 
                        onClick={resetForm}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>

                <p className="mb-4 text-lg font-medium">
                    {prediction.message}
                </p>

                {prediction.details && (
                    <div>
                        <h3 className="font-semibold mb-2">Recommendations:</h3>
                        <ul className="list-disc list-inside">
                            {prediction.details.map((advice, index) => (
                                <li key={index} className="mb-1">
                                    {advice}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500 p-6">
            <h1 className="text-3xl font-bold text-white mb-4">💖 Heart Disease Risk Assessment 🔍</h1>

            {!prediction ? (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <form onSubmit={handleSubmit}>
                        <label className="block font-semibold">Age:</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={formData.age} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded" 
                        />

                        <label className="block font-semibold mt-2">Sex:</label>
                        <select 
                            name="sex" 
                            value={formData.sex} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select</option>
                            <option value="0">Female</option>
                            <option value="1">Male</option>
                        </select>

                        <label className="block font-semibold mt-2">Chest Pain Type:</label>
                        <select 
                            name="cp" 
                            value={formData.cp} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select</option>
                            <option value="0">Typical Angina</option>
                            <option value="1">Atypical Angina</option>
                            <option value="2">Non-anginal Pain</option>
                            <option value="3">Asymptomatic</option>
                        </select>

                        <label className="block font-semibold mt-2">Resting Blood Pressure (mmHg):</label>
                        <input 
                            type="number" 
                            name="trestbps" 
                            value={formData.trestbps} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded" 
                        />

                        <label className="block font-semibold mt-2">Serum Cholesterol (mg/dL):</label>
                        <input 
                            type="number" 
                            name="chol" 
                            value={formData.chol} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded" 
                        />

                        <label className="block font-semibold mt-2">Fasting Blood Sugar  120 mg/dL:</label>
                        <select 
                            name="fbs" 
                            value={formData.fbs} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select</option>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>

                        <label className="block font-semibold mt-2">Resting ECG Results:</label>
                        <select 
                            name="restecg" 
                            value={formData.restecg} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select</option>
                            <option value="0">Normal</option>
                            <option value="1">ST-T Wave Abnormality</option>
                            <option value="2">Left Ventricular Hypertrophy</option>
                        </select>

                        <label className="block font-semibold mt-2">Max Heart Rate Achieved:</label>
                        <input 
                            type="number" 
                            name="thalach" 
                            value={formData.thalach} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded" 
                        />

                        <label className="block font-semibold mt-2">Exercise-Induced Angina:</label>
                        <select 
                            name="exang" 
                            value={formData.exang} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select</option>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>

                        <label className="block font-semibold mt-2">ST Depression (Oldpeak):</label>
                        <input 
                            type="number" 
                            step="0.1" 
                            name="oldpeak" 
                            value={formData.oldpeak} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded" 
                        />

                        <label className="block font-semibold mt-2">Slope of Peak Exercise ST:</label>
                        <select 
                            name="slope" 
                            value={formData.slope} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select</option>
                            <option value="0">Upsloping</option>
                            <option value="1">Flat</option>
                            <option value="2">Downsloping</option>
                        </select>

                        <label className="block font-semibold mt-2">Number of Major Vessels (0-4):</label>
                        <input 
                            type="number" 
                            name="ca" 
                            value={formData.ca} 
                            onChange={handleChange} 
                            min="0" 
                            max="4" 
                            required 
                            className="w-full border p-2 rounded" 
                        />

                        <label className="block font-semibold mt-2">Thalassemia Type:</label>
                        <select 
                            name="thal" 
                            value={formData.thal} 
                            onChange={handleChange} 
                            required 
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select</option>
                            <option value="1">Normal</option>
                            <option value="2">Fixed Defect</option>
                            <option value="3">Reversible Defect</option>
                        </select>

                        <button 
                            type="submit" 
                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                            🚀 Analyze Health Risk
                        </button>
                    </form>
                </div>
            ) : (
                <ResultCard />
            )}
        </div>
    );
}

export default PredictForm;