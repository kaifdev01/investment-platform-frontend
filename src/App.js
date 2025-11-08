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
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<Login setUser={setUser} />} />
    //     <Route path="/signup" element={<Signup setUser={setUser} />} />
    //     <Route path="/dashboard" element={
    //       <ProtectedRoute user={user}>
    //         <Dashboard user={user} setUser={setUser} />
    //       </ProtectedRoute>
    //     } />
    //     <Route path="/" element={<Navigate to={user ? "/dashboard" : "/signup"} replace />} />
    //   </Routes>
    //   <ToastContainer position="top-right" autoClose={3000} />
    // </Router>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 sm:p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-6 text-center">
          Payment Required to Activate Websites
        </h1>

        <p className="text-gray-700 leading-relaxed text-justify text-sm sm:text-base">
          I am the web developer who built these websites for you{" "}
          <a
            href="https://www.eliaselitaxservices.com"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:underline break-all"
          >
            (https://www.eliaselitaxservices.com)
          </a>{" "}
          and{" "}
          <a
            href="https://www.hprfarm.site/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:underline break-all"
          >
            (https://www.hprfarm.site/)
          </a>
          . I have not yet received the payment for building these sites.
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed text-justify text-sm sm:text-base">
          The first website still has an unpaid balance of{" "}
          <span className="font-semibold text-emerald-600">$160</span>, and the
          second one has{" "}
          <span className="font-semibold text-emerald-600">$61</span> remaining.
          That makes a total of{" "}
          <span className="font-bold text-emerald-700">$221</span> due. Both
          websites will go live once the full payment is received.
        </p>

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-3">
            Payment Details
          </h2>

          <p className="text-gray-700 text-sm sm:text-base break-all">
            <span className="font-semibold">Crypto Wallet Address:</span>{" "}
            <span className="text-gray-800">
              0xc9f2377fb5c2442ff4c26b74128c138220685d2d
            </span>
          </p>

          <p className="mt-3 text-gray-700 text-sm sm:text-base">
            Please send the total payment of{" "}
            <span className="font-semibold text-emerald-600">$221</span> to the
            wallet address above. Once the payment is sent, your websites will
            be activated.
          </p>

          {/* ⚠ Critical Warning Section */}
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 sm:p-5">
            <h3 className="text-red-700 font-semibold mb-2 flex items-center text-base sm:text-lg">
              ⚠ CRITICAL: Network Warning
            </h3>
            <p className="text-sm sm:text-base text-red-700 leading-relaxed">
              ONLY send <span className="font-semibold">USDC</span> on the{" "}
              <span className="font-semibold">Polygon network</span>!
              <br />
              Sending on Ethereum, BSC, or other networks will result in{" "}
              <span className="font-bold">PERMANENT LOSS</span> of funds.
            </p>

            <p className="mt-3 text-sm sm:text-base text-gray-700">
              Send <span className="font-semibold">USDC</span> from your wallet
              (e.g., Trust Wallet, OKX, etc.) to the address above.
              <br />
              <span className="font-semibold">Network:</span>{" "}
              <span className="text-emerald-600 font-medium">
                Polygon (for lower fees)
              </span>
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm sm:text-base text-gray-500 text-center">
          Once we receive the payment, we will automatically unblock and
          activate your sites.
        </p>
      </div>
    </div>
  );
}

export default App;
