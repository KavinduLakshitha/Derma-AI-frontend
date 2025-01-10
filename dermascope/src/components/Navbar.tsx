import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, setAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticated(false); // Update context state
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/'); // Redirect to homepage or login page
  };
  

  return (
    <nav className="bg-[#5C2E0D] absolute w-full">
      <div className="relative px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="text-white text-xl font-semibold">
            Dermascope AI
          </Link>
          
          <button
            className="md:hidden text-white hover:text-gray-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-white hover:text-gray-400 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-gray-400 transition-colors">
              About Us
            </Link>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="text-white hover:text-gray-400 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link to="/auth" className="text-white hover:text-gray-400 transition-colors">
                Login/Register
              </Link>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 mt-4 py-4">
            <div className="flex flex-col space-y-4 px-2">
              <Link to="/" className="text-white hover:text-gray-400 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-white hover:text-gray-400 transition-colors">
                About Us
              </Link>
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-gray-400 transition-colors text-left"
                >
                  Logout
                </button>
              ) : (
                <Link to="/auth" className="text-white hover:text-gray-400 transition-colors">
                  Login/Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;