import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isAuthenticated, setAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('token');
    navigate('/');
    setShowLogoutConfirm(false);
  };

  const homePath = isAuthenticated ? (user?.userType === 'doctor' ? '/doctor-dashboard' : '/dashboard'): '/';

  const showDashboardLink = isAuthenticated && user?.userType !== 'doctor';

  return (
    <nav className="bg-[#fcecdc] shadow-lg fixed w-full z-50">
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-[#5c2e0d] to-[#cc5b2a] text-white rounded-full hover:shadow-md transition-all"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative px-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to={homePath} className="flex items-center space-x-3">
            <img 
              src="/images/logo.png" 
              alt="Dermascope AI Logo" 
              className="h-24 object-contain" 
            />
          </Link>
          
          <button
            className="md:hidden text-[#5c2e0d] hover:text-[#ffab7b] transition-colors p-2 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-6">
          {!isAuthenticated && (
              <Link 
                to="/" 
                className="text-[#5c2e0d] hover:text-[#ffab7b] transition-colors px-3 py-2 rounded-lg"
              >
                Home
              </Link>
            )}
            {showDashboardLink && (
              <Link 
                to="/dashboard" 
                className="text-[#5c2e0d] hover:text-[#ffab7b] transition-colors px-3 py-2 rounded-lg"
              >
                Dashboard
              </Link>
            )}
            
            {isAuthenticated && user?.userType === 'doctor' && (
              <Link 
                to="/doctor-dashboard" 
                className="text-[#5c2e0d] hover:text-[#ffab7b] transition-colors px-3 py-2 rounded-lg"
              >
                Doctor Dashboard
              </Link>
            )}
            
            <Link 
              to="/about" 
              className="text-[#5c2e0d] hover:text-[#ffab7b] transition-colors px-3 py-2 rounded-lg"
            >
              About Us
            </Link>
            
            {isAuthenticated ? (
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="text-[#5c2e0d] px-6 py-2 rounded-full 
                          duration-300 ml-4"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/auth" 
                className="text-[#5c2e0d] px-6 py-2 rounded-full duration-300"
              >
                Login/Register
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#6d3a1a] mt-2 py-4 rounded-lg mx-2">
            <div className="flex flex-col space-y-3 px-4">
              <Link 
                to={homePath} 
                className="text-[#5c2e0d] hover:text-[#ffab7b] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {isAuthenticated ? 'Dashboard' : 'Home'}
              </Link>
              
              {isAuthenticated && user?.userType === 'doctor' && (
                <Link 
                  to="/doctor-dashboard" 
                  className="text-[#5c2e0d] hover:text-[#ffab7b] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Doctor Dashboard
                </Link>
              )}
              
              <Link 
                to="/about" 
                className="text-[#5c2e0d] hover:text-[#ffab7b] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setIsMenuOpen(false);
                  }}
                  className="text-[#5c2e0d] hover:text-[#ffab7b] transition-colors text-left py-2"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/auth" 
                  className="text-[#5c2e0d] hover:text-[#ffab7b] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
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