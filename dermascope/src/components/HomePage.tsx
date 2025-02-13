import React from 'react';

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fff7f2] to-[#ffeae5] pt-16">
      <div className="container mx-auto px-4 py-12 md:py-24">        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">          
          <div className="flex flex-col justify-center space-y-6 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Transform Your Skin Health with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5c2e0d] to-[#ff6b6b]">
                Dermascope AI
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed md:leading-loose">
              Harness the power of artificial intelligence for precise skin disease diagnosis 
              and severity assessment. Our platform offers instant image analysis for patients 
              and advanced tracking tools for healthcare professionals.
            </p>
            <div className="flex space-x-4 mt-4">
              <button className="bg-gradient-to-r from-[#5c2e0d] to-[#cc5b2a] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-[#5c2e0d]/30">
                Get Started
              </button>
              <button className="border-2 border-[#5c2e0d] text-[#5c2e0d] px-8 py-3 rounded-xl font-semibold hover:bg-[#f5e6dc] transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>          
          
          <div className="relative group md:order-2">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5c2e0d] to-[#ff6b6b] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-[1.02] transition duration-500">
              <img 
                src='/images/welcome-screen.jpg' 
                alt='AI skin analysis interface' 
                className="w-full h-full object-cover" 
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;