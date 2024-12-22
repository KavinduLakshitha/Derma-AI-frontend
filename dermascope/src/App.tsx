import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AuthPage from './components/auth/AuthPage'

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* Add routes for other pages (About, SignIn, SignUp) here */}
      </Routes>
    </Router>
  );
};

export default App;