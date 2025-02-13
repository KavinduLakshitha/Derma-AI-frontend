import { useState, ChangeEvent, DragEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Activity } from 'lucide-react';

interface SeverityInfo {
  level: string;
  confidence: number;
}

interface PredictionResponse {
  prediction: string;
  confidence: number;
  severity?: SeverityInfo;
  severity_raw?: number[][];
}

interface PredictionResult {
  class: string;
  message: string;
  confidence?: number;
  severity?: SeverityInfo;
  severity_raw?: number[][];
}


const AcneDetectionApp = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [isScanning, setIsScanning] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);  

  const getPredictionMessage = (
    predictedClass: string, 
    confidence: number, 
    severity?: SeverityInfo
  ): PredictionResult => {
    switch (predictedClass) {
      case 'Non Acne':
        return {
          class: 'No Acne',
          message: 'Good news! No signs of significant skin diseases were detected in the image.',
          confidence
        };
      case 'Acne':
        return {
          class: 'Acne Detected',
          message: `Acne has been detected in the image. ${
            severity 
              ? `The analysis suggests ${severity.level.toLowerCase()} severity.`
              : ''
          } We recommend consulting with a dermatologist for proper treatment.`,
          confidence,
          severity
        };
      default:
        return {
          class: 'Unknown',
          message: 'Unable to determine acne condition. Please try with a clearer image.',
          confidence
        };
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }

    if (!user?.userId) {
      setError('User authentication required.');
      navigate('/auth');
      return;
    }
  
    try {
      setIsScanning(true);
      const formData = new FormData();
      formData.append('image', image);
      formData.append('userId', user.userId.toString());
  
      const response = await fetch('http://localhost:5000/api/predict_acne', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }
  
      const result: PredictionResponse = await response.json();
      const predictionResult = getPredictionMessage(
        result.prediction,
        result.confidence,
        result.severity
      );
      setPrediction(predictionResult);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Error submitting the image for prediction.');
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
    }
  }, [isAuthenticated, user, navigate]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      setError('No file selected.');
      return;
    }
    const file = files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 25 * 1024 * 1024) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('Invalid file. Please upload a .jpg or .png file under 25 MB.');
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 25 * 1024 * 1024) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('Invalid file. Please upload a .jpg or .png file under 25 MB.');
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setPrediction(null);
  };

  return (
    <div className="bg-[#5C2E0D] text-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-semibold">Acne Detection & Severity Assessment</h1>
        <nav className="flex gap-6">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Log out</a>
        </nav>
      </header>

      {/* Main Section */}
      <main className="bg-[#F6E5D3] rounded-tl-3xl rounded-tr-3xl p-8">
        <h2 className="text-center text-[#5C2E0D] text-lg font-medium mt-4 mb-4">
          Upload an image to detect and assess severity level
        </h2>

        {/* Upload Section */}
        <div
          className="bg-white shadow-md rounded-md p-6 w-full max-w-md mx-auto mb-8"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="border-2 border-dashed border-gray-400 rounded-md p-4 text-center">
            <input
              type="file"
              accept="image/jpeg, image/png"
              className="hidden"
              id="imageUpload"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="imageUpload"
              className="block cursor-pointer text-sm text-gray-500 mb-2"
            >
              Choose or drag and drop an image
            </label>
            <p className="text-xs text-gray-400">
              Format: .jpg, .png & Max file size: 25 MB
            </p>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Uploaded Image Section */}
        {imagePreview && (
          <div className="w-full max-w-md mx-auto mb-8 relative">
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="rounded-md shadow-md w-full"
            />
            {isScanning && (
              <>
                <div className="absolute inset-0 bg-blue-500/10 rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent h-[200%] animate-scan" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 px-4 py-2 rounded-full flex items-center gap-2">
                    <Activity className="animate-pulse text-blue-500" />
                    <span className="text-blue-500 font-medium">Analyzing Image...</span>
                  </div>
                </div>
              </>
            )}
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Buttons Section */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleSubmit}
            className="bg-[#5C2E0D] text-center text-white w-48 py-2 rounded-md"
            disabled={!image}
          >
            Predict
          </button>
          {prediction && (
            <div className="w-full max-w-md mx-auto space-y-4">
              {/* Main Result Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  {prediction.class === 'No Acne' ? (
                    <CheckCircle2 className="text-green-500 w-6 h-6 mt-1" />
                  ) : (
                    <AlertCircle className="text-amber-500 w-6 h-6 mt-1" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {prediction.class}
                    </h3>
                    <p className="text-gray-600">{prediction.message}</p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">Detection Confidence</span>
                    <span className="text-gray-900 font-bold">{prediction.confidence}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Severity Card (if applicable) */}
              {prediction.severity && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Severity Assessment</h4>
                  
                  <div className="space-y-4">
                    {/* Severity Level */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Severity Level</span>
                      <span className={`font-bold px-3 py-1 rounded-full ${
                        prediction.severity.level === 'Severe' ? 'bg-red-100 text-red-700' :
                        prediction.severity.level === 'Moderate' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {prediction.severity.level}
                      </span>
                    </div>
                    
                    {/* Severity Confidence */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Confidence</span>
                        <span className="text-gray-900 font-bold">{prediction.severity.confidence}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${prediction.severity.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Analysis Card */}
              {prediction.severity_raw && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Detailed Analysis</h4>
                  <div className="space-y-3">
                    {['Clear', 'Mild', 'Moderate', 'Severe'].map((level, index) => (
                      <div key={level}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{level}</span>
                          <span className="text-gray-900 font-bold">
                            {(prediction.severity_raw![0][index] * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              level === 'Severe' ? 'bg-red-500' :
                              level === 'Moderate' ? 'bg-orange-500' :
                              level === 'Mild' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${prediction.severity_raw![0][index] * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AcneDetectionApp;