import React from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return <ForgotPassword onBackToLogin={handleBackToLogin} />;
};

export default ForgotPasswordPage;