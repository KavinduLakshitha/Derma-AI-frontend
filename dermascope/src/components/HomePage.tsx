import React from 'react';

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto px-4 py-8">        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">          
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to Dermascope AI
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to Dermascope AI, a cutting-edge platform that uses machine 
              learning and deep learning to accurately diagnose skin diseases and 
              assess their severity. Patients can upload images for fast, reliable 
              analysis, while doctors gain advanced tools to track patient progress 
              and provide expert insights. Empowering both patients and healthcare 
              professionals, Dermascope AI is revolutionizing skin health management.
            </p>
          </div>
          
          <div aria-hidden="true" className="bg-gray-300 h-64 md:h-full rounded-lg shadow-md"></div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
