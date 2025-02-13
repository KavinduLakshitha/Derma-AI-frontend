import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { userType } = location.state || { userType: 'User' };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 15) return 'Good afternoon';
    if (hours < 18) return 'Good evening';
    return 'Good night';
  };
  

  const getNameWithTitle = () => {
    const name = user?.firstName || 'Guest';
    return user?.userType === 'doctor' ? `Dr. ${name}` : name;
  };

  const conditions = [
    {
      title: 'Acne Detection & Severity',
      image: '/images/acne-placeholder.png',
      alt: 'Person touching face showing acne condition',
      route: '/acne-detection',
    },
    {
      title: 'Eczema Detection & Severity',
      image: '/images/eczema-placeholder.png',
      alt: 'Person showing eczema on skin',
      route: '/eczema-detection',
    },
    {
      title: 'Psoriasis Detection & Severity',
      image: '/images/psoriasis-placeholder.png',
      alt: 'Person showing psoriasis condition',
      route: '/psoriasis-detection',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fff7f2] to-[#ffeae5] pt-16">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {`${getGreeting()}, `}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5c2e0d] to-[#ff6b6b]">
              {getNameWithTitle()}
            </span>
          </h1>
          <p className="text-lg text-gray-700 mt-2">Welcome to your {userType} dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {conditions.map((condition, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#5c2e0d] to-[#ff6b6b] rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative h-full bg-white rounded-3xl p-6 flex flex-col items-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {condition.title}
                </h2>
                <div className="relative w-64 h-64 mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={condition.image}
                    alt={condition.alt}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />
                </div>
                <Link
                  to={condition.route}
                  className="bg-gradient-to-r from-[#5c2e0d] to-[#cc5b2a] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-[#5c2e0d]/30"
                >
                  Check Here
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;