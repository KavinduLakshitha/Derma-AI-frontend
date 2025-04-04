import { useState, ChangeEvent, DragEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Activity } from 'lucide-react';

interface DetectionResponse {
  resultId: number; 
  detected: boolean;
  confidence: number;
}

interface SeverityResponse {
  resultId: number;
  severity: {
    level: string;
    confidence: number;
  };
  severity_scores: {
    [key: string]: number;
  };
}

interface PredictionResult {
  detection?: {
    isDetected: boolean;
    confidence: number;
    resultId?: number; 
  };
  severity?: {
    level: string;
    confidence: number;
    scores: {
      [key: string]: number;
    };
  };
}

const BODY_PARTS = [
  'Face',
  'Neck',
  'Chest',
  'Back',
  'Arms',
  'Legs',
  'Other'
];

const AcneDetectionApp = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'detection' | 'severity' | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');

  const handleDetection = async () => {
    if (!image || !user?.userId) {
      setError('Please upload an image and ensure you are logged in.');
      return;
    }
  
    if (!selectedBodyPart) {
      setError('Please select a body part.');
      return;
    }
  
    try {
      setIsScanning(true);
      setScanType('detection');
      const formData = new FormData();
      formData.append('image', image);
      formData.append('userId', user.userId.toString());
      formData.append('bodyPart', selectedBodyPart);
  
      const response = await fetch('http://localhost:5000/api/detect/acne', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to process image');
      }
  
      const result: DetectionResponse = await response.json();
  
      setPrediction(prev => ({
        ...prev,
        detection: {
          isDetected: result.detected,
          confidence: result.confidence,
          resultId: result.resultId
        }
      }));
      
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Error during detection.');
    } finally {
      setIsScanning(false);
      setScanType(null);
    }
  };

  const handleSeverityAssessment = async () => {
    if (!image || !user?.userId || !prediction?.detection?.resultId) {
      setError('Missing required information for severity assessment.');
      return;
    }
  
    try {
      setIsScanning(true);
      setScanType('severity');
      const formData = new FormData();
      formData.append('image', image);
      formData.append('resultId', prediction.detection.resultId.toString());
  
      const response = await fetch('http://localhost:5000/api/assess/acne_severity', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to assess severity');
      }
  
      const result: SeverityResponse = await response.json();
      console.log("Severity result:", result); // Debug log
  
      setPrediction(prev => ({
        ...prev,
        severity: {
          level: result.severity.level,
          confidence: result.severity.confidence,
          scores: result.severity_scores
        }
      }));
      
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Error during severity assessment.');
    } finally {
      setIsScanning(false);
      setScanType(null);
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
      setPrediction(null); // Reset predictions when new image is uploaded
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
      setPrediction(null); // Reset predictions when new image is uploaded
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
    setError(null);
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
          Upload an image for acne detection and severity assessment
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
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Image Preview */}
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
                    <span className="text-blue-500 font-medium">
                      {scanType === 'detection' ? 'Detecting Acne...' : 'Assessing Severity...'}
                    </span>
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

      {imagePreview && (  // Only show when image is uploaded
            <div className="w-full max-w-md mx-auto mb-4 flex gap-4">
              <label htmlFor="bodyPart" className="block p-2 text-sm whitespace-nowrap font-medium text-[#5C2E0D] mb-1">
                Select Body Part
              </label>
              <select
                id="bodyPart"
                value={selectedBodyPart}
                onChange={(e) => setSelectedBodyPart(e.target.value)}
                className="block w-full m-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700 p-2 text-sm"
                required
              >
                <option value="">Select a body part</option>
                {BODY_PARTS.map(part => (
                  <option key={part} value={part}>{part}</option>
                ))}
              </select>
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={handleDetection}
              className="bg-[#5C2E0D] text-center text-white px-6 py-2 rounded-md disabled:opacity-50"
              disabled={!image || isScanning}
            >
              Detect Acne
            </button>
            <button
              onClick={handleSeverityAssessment}
              className="bg-[#5C2E0D] text-center text-white px-6 py-2 rounded-md disabled:opacity-50"
              disabled={!image || isScanning || !prediction?.detection?.isDetected}
            >
              Assess Severity
            </button>
          </div>

          {/* Detection Results */}
          {prediction?.detection && (
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  {prediction.detection.isDetected ? (
                    <AlertCircle className="text-amber-500 w-6 h-6 mt-1" />
                  ) : (
                    <CheckCircle2 className="text-green-500 w-6 h-6 mt-1" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Detection Results
                    </h3>
                    <p className="text-gray-600">
                      {prediction.detection.isDetected 
                        ? 'Acne detected in the image' 
                        : 'No significant acne detected'}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Confidence</span>
                    <span className="text-gray-900 font-bold">{prediction.detection.confidence}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.detection.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Severity Results */}
          {prediction?.severity && (
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Severity Assessment</h3>
                
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

                  {/* Confidence */}
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

                  {/* Detailed Scores */}
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Detailed Analysis</h4>
                    <div className="space-y-3">
                      {Object.entries(prediction.severity.scores).map(([level, score]) => (
                        <div key={level}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{level}</span>
                            <span className="text-gray-900 font-bold">
                              {score.toFixed(1)}%
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
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AcneDetectionApp;