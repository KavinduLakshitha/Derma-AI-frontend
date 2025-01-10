import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignInForm = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent, userType: 'patient' | 'doctor') => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Generate a simple token (in a real app, this would come from your backend)
        const token = `token-${Date.now()}`;
        
        // Set authentication with user data
        setAuthenticated(true, token, {
          userId: data.userId,
          firstName: data.firstName
        });

        navigate('/dashboard');
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm"
          >
            Sign in as {userType}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-600">Please sign in to access your account</p>
      </div>

      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('patient')}
          className={`flex-1 py-2 ${activeTab === 'patient' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Patient Login
        </button>
        <button
          onClick={() => setActiveTab('doctor')}
          className={`flex-1 py-2 ${activeTab === 'doctor' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Doctor Login
        </button>
      </div>

      {activeTab === 'patient' ? <SignInPanel userType="patient" /> : <SignInPanel userType="doctor" />}
    </div>
  );
};

export default SignInForm;