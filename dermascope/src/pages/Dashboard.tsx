import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { userType} = location.state || { userType: 'User' };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const conditions = [
    {
      title: 'Acne Detection & Severity',
      image: '/images/acne-placeholder.jpg',
      alt: 'Person touching face showing acne condition',
      route: '/acne-detection',
    },
    {
      title: 'Eczema Detection & Severity',
      image: '/images/eczema-placeholder.jpg',
      alt: 'Person showing eczema on skin',
      route: '/eczema-detection',
    },
    {
      title: 'Psoriasis Detection & Severity',
      image: '/images/psoriasis-placeholder.jpg',
      alt: 'Person showing psoriasis condition',
      route: '/psoriasis-detection',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F0ED] flex items-center justify-center">
      <div className="py-1 px-6">
        <div className="mb-6 mt-16">
          <h1 className="text-2xl font-bold text-blue-800">{`${getGreeting()}, ${user?.firstName || 'Guest'}!`}</h1>
          <p className="text-gray-600">Welcome to your {userType} dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {conditions.map((condition, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center"
            >
              <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                {condition.title}
              </h2>
              <div className="relative w-64 h-64 mb-4">
                <img
                  src={condition.image}
                  alt={condition.alt}
                  className="rounded-full bg-pink-50 object-cover"
                />
              </div>
              <Link
                to={condition.route}
                className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-brown-700 transition-colors text-center"
              >
                Check Here
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
