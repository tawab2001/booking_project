import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasVisitedHome = localStorage.getItem('hasVisitedHome');
    
    // Allow direct access to home and authentication pages
    if (location.pathname === '/home' || location.pathname === '/' || 
        location.pathname === '/login' || location.pathname === '/signup') {
      return;
    }

    // If user hasn't visited home, redirect to home
    if (!hasVisitedHome) {
      navigate('/home');
    }
  }, [navigate, location]);

  return children;
};

export default ProtectedRoute; 