import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SignInFormProps {
  onUserTypeChange: (userType: 'patient' | 'doctor') => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onUserTypeChange }) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const handleTabChange = (userType: 'patient' | 'doctor') => {
    setActiveTab(userType);
    onUserTypeChange(userType);
  };

  const handleSubmit = async (e: React.FormEvent, userType: 'patient' | 'doctor') => {
    e.preventDefault();
    setError(null);
  
    try {
      const endpoint = userType === 'doctor' 
        ? 'http://localhost:5000/api/doctor/signin' 
        : 'http://localhost:5000/api/signin';
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = `token-${Date.now()}`;
        
        if (userType === 'doctor') {
          setAuthenticated(true, token, {
            firstName: data.firstName,
            doctorId: data.doctorId,
            userType: 'doctor'
          });
          navigate('/doctor-dashboard');
        } else {
          setAuthenticated(true, token, {
            firstName: data.firstName,
            userId: data.userId,
            userType: 'patient'
          });
          navigate('/dashboard');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Error during sign-in:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SignInPanel = ({ userType }: { userType: 'patient' | 'doctor' }) => (
    <div>
      <form className="space-y-6" onSubmit={(e) => handleSubmit(e, userType)}>
        <div>
          <label htmlFor={`${userType}-email`} className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id={`${userType}-email`}
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5c2e0d] focus:border-[#5c2e0d] outline-none transition-all"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${userType}-password`} className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id={`${userType}-password`}
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5c2e0d] focus:border-[#5c2e0d] outline-none transition-all"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-[#5c2e0d] to-[#cc5b2a] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-[#5c2e0d]/30"
          >
            Sign in as {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5c2e0d] to-[#ff6b6b]">
            Dermascope AI
          </span>
        </h1>
        <p className="text-gray-700">Please sign in to access your account</p>
      </div>

      <div className="flex mb-8 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => handleTabChange('patient')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'patient'
              ? 'bg-gradient-to-r from-[#5c2e0d] to-[#cc5b2a] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Patient Login
        </button>
        <button
          onClick={() => handleTabChange('doctor')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'doctor'
              ? 'bg-gradient-to-r from-[#5c2e0d] to-[#cc5b2a] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Doctor Login
        </button>
      </div>

      {activeTab === 'patient' ? <SignInPanel userType="patient" /> : <SignInPanel userType="doctor" />}
    </div>
  );
};

export default SignInForm;