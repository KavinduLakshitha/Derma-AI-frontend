import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './pages/Dashboard';
import AcneDetection from './pages/AcneDetection';
import EczemaDetection from './pages/EczemaDetection';
import PsoriasisDetection from './pages/PsoriasisDetection';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/acne-detection" element={<AcneDetection />} />
        <Route path="/eczema-detection" element={<EczemaDetection />} />
        <Route path="/psoriasis-detection" element={<PsoriasisDetection />} />
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
