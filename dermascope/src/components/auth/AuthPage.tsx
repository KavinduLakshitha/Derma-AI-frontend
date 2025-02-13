import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPassword';

type AuthMode = 'signin' | 'signup' | 'forgot';

interface AuthPageProps {}

const AuthPage: React.FC<AuthPageProps> = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [activeUserType, setActiveUserType] = useState<'patient' | 'doctor'>('patient');

  const getTitleText = (currentMode: AuthMode): string => {
    switch (currentMode) {
      case 'signin':
        return 'Sign in to your account';
      case 'signup':
        return 'Create your account';
      case 'forgot':
        return 'Reset your password';
    }
  };

  const handleUserTypeChange = (userType: 'patient' | 'doctor') => {
    setActiveUserType(userType);
    if (userType === 'doctor') {
      setMode('signin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {getTitleText(mode)}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {mode === 'signin' && <SignInForm onUserTypeChange={handleUserTypeChange} />}
          {mode === 'signup' && <SignUpForm />}
          {mode === 'forgot' && <ForgotPasswordForm />}

          <div className="mt-6">
            {mode === 'signin' ? (
              <div className="text-sm flex justify-between">
                <button
                  type="button"
                  onClick={() => activeUserType === 'patient' && setMode('forgot')}
                  className={`text-[#5c2e0d] hover:text-[#4b2509] transition-opacity duration-200 ${
                    activeUserType === 'doctor' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                  aria-hidden={activeUserType === 'doctor'}
                  tabIndex={activeUserType === 'doctor' ? -1 : 0}
                >
                  Forgot your password?
                </button>
                <button
                  type="button"
                  onClick={() => activeUserType === 'patient' && setMode('signup')}
                  className={`text-[#5c2e0d] hover:text-[#4b2509] transition-opacity duration-200 ${
                    activeUserType === 'doctor' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                  aria-hidden={activeUserType === 'doctor'}
                  tabIndex={activeUserType === 'doctor' ? -1 : 0}
                >
                  Create new account
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-sm text-[#5c2e0d] hover:text-[#4b2509]"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;