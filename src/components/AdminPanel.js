import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'https://investment-platform-backend.vercel.app/api';

const AdminPanel = () => {
  const [pendingDeposits, setPendingDeposits] = useState([]);

  const fetchPendingDeposits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/admin/pending-deposits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingDeposits(response.data.deposits);
    } catch (error) {
      console.error('Failed to fetch pending deposits');
    }
  };

  const processDeposit = async (depositId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/user/admin/manual-process/${depositId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchPendingDeposits();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error('Failed to process deposit');
    }
  };

  useEffect(() => {
    fetchPendingDeposits();
    const interval = setInterval(fetchPendingDeposits, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '10px', margin: '20px' }}>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Admin Panel - Pending Deposits</h3>

      <button
        onClick={fetchPendingDeposits}
        style={{
          background: '#667eea',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🔄 Refresh
      </button>

      {pendingDeposits.length > 0 ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          {pendingDeposits.map((deposit, index) => (
            <div key={index} style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              border: '2px solid #ffc107'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    {deposit.userId.firstName} {deposit.userId.lastName}
                  </p>
                  <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                    {deposit.userId.email}
                  </p>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#28a745' }}>
                    Amount: ${deposit.amount} USDC
                  </p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                    TX Hash: {deposit.txHash || 'N/A'}
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    From: {deposit.fromAddress || 'N/A'}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => processDeposit(deposit._id)}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✅ Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>No pending deposits</p>
      )}
    </div>
  );
};

export default AdminPanel;