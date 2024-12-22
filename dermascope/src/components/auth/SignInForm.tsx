import React, { useState } from 'react';

const SignInForm = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent, userType: 'patient' | 'doctor') => {
    e.preventDefault();    
    console.log(`${userType} sign in:`, formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const SignInPanel = ({ userType }: { userType: 'patient' | 'doctor' }) => (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Sign in as a {userType}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {userType === 'doctor' 
            ? "Analyze skin conditions and manage patient records"
            : "Check your skin conditions and view assessments"}
        </p>
      </div>

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
              autoComplete="off"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              autoComplete="off"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in as {userType}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Please sign in to access your account</p>
        </div>

        <div className="mb-6">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setActiveTab('patient')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md focus:outline-none ${
                activeTab === 'patient'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Patient Login
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md focus:outline-none ${
                activeTab === 'doctor'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Doctor Login
            </button>
          </div>
        </div>

        {activeTab === 'patient' && <SignInPanel userType="patient" />}
        {activeTab === 'doctor' && <SignInPanel userType="doctor" />}
      </div>
    </div>
  );
};

export default SignInForm;