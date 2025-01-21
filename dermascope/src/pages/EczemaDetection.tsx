import { useState, ChangeEvent, DragEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EczemaDetection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{ class: string; message: string } | null>(null);

  const getPredictionMessage = (classNumber: string) => {
    switch (classNumber) {
      case '0':
        return {
          class: 'No Psoriasis',
          message: 'Good news! No signs of significant skin conditions were detected in the image.',
        };
      case '2':
        return {
          class: 'Eczema Detected',
          message: 'Eczema has been detected in the image. We recommend consulting with a dermatologist for further evaluation and treatment.',
        };
      default:
        return {
          class: 'Unknown',
          message: 'Unable to determine the condition. Please try again with a clearer image.',
        };
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', image);
            
      const response = await fetch('http://localhost:5000/api/predict/eczema/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction.');
      }

      const result = await response.json();
      const predictionResult = getPredictionMessage(result.predicted_class);
      setPrediction(predictionResult);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Error submitting the image for prediction.');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

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
        <h1 className="text-2xl font-semibold">Eczema Detection & Severity Assessment</h1>
        <nav className="flex gap-6">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Log out</a>
        </nav>
      </header>

      {/* Main Section */}
      <main className="bg-[#F6E5D3] rounded-tl-3xl rounded-tr-3xl p-8">
        <h2 className="text-center text-[#5C2E0D] text-lg font-medium mb-4">
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

        {imagePreview && (
          <div className="w-full max-w-md mx-auto mb-8 relative">
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="rounded-md shadow-md"
            />
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
            <div className="bg-white rounded-md p-4 max-w-md w-full text-[#5C2E0D]">
              <h3 className="font-semibold text-lg mb-2">{prediction.class}</h3>
              <p>{prediction.message}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EczemaDetection;
