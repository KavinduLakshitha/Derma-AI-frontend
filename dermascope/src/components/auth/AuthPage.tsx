import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPassword';

type AuthMode = 'signin' | 'signup' | 'forgot';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin' && 'Sign in to your account'}
          {mode === 'signup' && 'Create your account'}
          {mode === 'forgot' && 'Reset your password'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {mode === 'signin' && <SignInForm />}
          {mode === 'signup' && <SignUpForm />}
          {mode === 'forgot' && <ForgotPasswordForm />}

          <div className="mt-6">
            {mode === 'signin' && (
              <div className="text-sm flex justify-between">
                <button
                  onClick={() => setMode('forgot')}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Create new account
                </button>
              </div>
            )}
            {(mode === 'signup' || mode === 'forgot') && (
              <button
                onClick={() => setMode('signin')}
                className="text-sm text-indigo-600 hover:text-indigo-500"
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