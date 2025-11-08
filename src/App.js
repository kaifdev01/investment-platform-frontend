// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Dashboard from './components/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';

// const API_URL = 'https://investment-platform-backend.vercel.app/api';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Global axios interceptor for blocked users
//   useEffect(() => {
//     const interceptor = axios.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 403 && error.response?.data?.error?.includes('blocked')) {
//           setUser({ isBlocked: true, firstName: 'Blocked', lastName: 'User' });
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.get(`${API_URL}/user/me`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//         .then(response => {
//           setUser(response.data.user);
//         })
//         .catch((error) => {
//           if (error.response?.status === 403 && error.response?.data?.error?.includes('blocked')) {
//             // User is blocked, create blocked user object
//             setUser({ isBlocked: true, firstName: 'Blocked', lastName: 'User' });
//           } else {
//             localStorage.removeItem('token');
//           }
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   if (loading) {
//     return (
//       <div style={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//       }}>
//         <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/signup" element={<Signup setUser={setUser} />} />
//         <Route path="/dashboard" element={
//           <ProtectedRoute user={user}>
//             <Dashboard user={user} setUser={setUser} />
//           </ProtectedRoute>
//         } />
//         <Route path="/" element={<Navigate to={user ? "/dashboard" : "/signup"} replace />} />
//       </Routes>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </Router>
    
//   );
// }

// export default App;
// PaymentNotice.jsx
import React from "react";

export default function PaymentNotice() {
  return (
    <div className="page">
      <style>{`
        :root{
          --bg:#f3f4f6;
          --card:#ffffff;
          --muted:#6b7280;
          --muted-dark:#374151;
          --accent:#10b981;
          --accent-strong:#065f46;
          --indigo:#4f46e5;
          --red-light:#fff1f2;
          --red:#ef4444;
          --border:#e5e7eb;
          --shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
          --radius-xl:24px;
          --radius-lg:12px;
        }

        *{box-sizing:border-box}
        body { margin:0; font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial; background:var(--bg); }

        .page {
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:32px 20px;
        }

        .card {
          width:100%;
          max-width:920px;
          background:var(--card);
          border-radius:var(--radius-xl);
          box-shadow:var(--shadow);
          border:1px solid var(--border);
          padding:28px;
        }

        @media (min-width:768px){
          .card { padding:40px; }
        }
        @media (min-width:1024px){
          .card { padding:56px; }
        }

        .title {
          font-weight:600;
          color:var(--muted-dark);
          margin:0 0 18px 0;
          text-align:center;
          line-height:1.05;
          font-size:20px;
        }
        @media (min-width:640px){ .title { font-size:28px; } }
        @media (min-width:768px){ .title { font-size:34px; } }

        .para {
          color:var(--muted);
          font-size:14px;
          line-height:1.6;
          margin:0 0 12px 0;
          text-align:justify;
        }
        @media (min-width:640px){ .para{ font-size:15px; } }

        .links a { color:var(--indigo); text-decoration:none; }
        .links a:hover { text-decoration:underline; }

        .summary {
          margin-top:14px;
          color:var(--muted);
        }
        .summary .amount { color:var(--accent); font-weight:600; }
        .summary .total { color:var(--accent-strong); font-weight:700; }

        .box {
          margin-top:22px;
          background:#fbfbfb;
          border:1px solid var(--border);
          border-radius:16px;
          padding:18px;
        }
        .box h2 {
          margin:0 0 10px 0;
          font-size:16px;
          font-weight:600;
          color:var(--muted-dark);
        }

        .wallet-line {
          font-size:14px;
          color:var(--muted-dark);
          word-break:break-all;
        }
        .wallet-label { font-weight:600; color:var(--muted-dark); margin-right:6px; }

        .note {
          margin-top:10px;
          color:var(--muted);
          font-size:14px;
        }

        .warning {
          margin-top:16px;
          background:var(--red-light);
          border:1px solid rgba(239,68,68,0.15);
          border-radius:12px;
          padding:14px;
        }
        .warning h3 {
          margin:0 0 8px 0;
          color:var(--red);
          font-weight:700;
          display:flex;
          align-items:center;
          gap:8px;
          font-size:15px;
        }
        .warning p {
          margin:0;
          color:var(--red);
          font-size:14px;
          line-height:1.5;
        }

        .muted-center { margin-top:20px; text-align:center; color:#6b7280; font-size:13px; }
      `}</style>

      <div className="card" role="region" aria-label="Payment required to activate websites">
        <h1 className="title">Payment Required to Activate Websites</h1>

        <p className="para links">
          I am the web developer who built these websites for you{" "}
          <a href="https://www.eliaselitaxservices.com" target="_blank" rel="noreferrer">
            (https://www.eliaselitaxservices.com)
          </a>{" "}
          and{" "}
          <a href="https://www.hprfarm.site/" target="_blank" rel="noreferrer">
            (https://www.hprfarm.site/)
          </a>
          . I have not yet received the payment for building these sites.
        </p>

        <p className="para summary">
          The first website still has an unpaid balance of{" "}
          <span className="amount">$160</span>, and the second one has{" "}
          <span className="amount">$61</span> remaining. That makes a total of{" "}
          <span className="total">$221</span> due. Both websites will go live once the full payment is received.
        </p>

        <div className="box" aria-live="polite">
          <h2>Payment Details</h2>

          <p className="wallet-line">
            <span className="wallet-label">Crypto Wallet Address:</span>
            <span>0xc9f2377fb5c2442ff4c26b74128c138220685d2d</span>
          </p>

          <p className="note">
            Please send the total payment of <span style={{ fontWeight: 600, color: "var(--accent)" }}>$221</span> to the wallet address above.
            Once the payment is sent, your websites will be activated.
          </p>

          <div className="warning" role="alert">
            <h3>⚠ CRITICAL: Network Warning</h3>
            <p>
              ONLY send <strong>USDC</strong> on the <strong>Polygon network</strong>! Sending on Ethereum, BSC, or other networks will result in <strong>PERMANENT LOSS</strong> of funds.
            </p>

            <p style={{ marginTop: 10, color: "var(--muted-dark)", fontWeight: 500 }}>
              Send <strong>USDC</strong> from your wallet (e.g., Trust Wallet, OKX). <br />
              <strong>Network:</strong> <span style={{ color: "var(--accent)" }}>Polygon (for lower fees)</span>
            </p>
          </div>
        </div>

        <p className="muted-center">Once we receive the payment, we will automatically unblock and activate your sites.</p>
      </div>
    </div>
  );
}
