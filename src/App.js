import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const API_URL = 'https://investment-platform-backend.vercel.app/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global axios interceptor for blocked users
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403 && error.response?.data?.error?.includes('blocked')) {
          setUser({ isBlocked: true, firstName: 'Blocked', lastName: 'User' });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUser(response.data.user);
        })
        .catch((error) => {
          if (error.response?.status === 403 && error.response?.data?.error?.includes('blocked')) {
            // User is blocked, create blocked user object
            setUser({ isBlocked: true, firstName: 'Blocked', lastName: 'User' });
          } else {
            localStorage.removeItem('token');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} setUser={setUser} />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/signup"} replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;