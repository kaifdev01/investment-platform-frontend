import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import '../styles/responsive.css';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(response.data.metrics);
      setRecentActivity(response.data.recentActivity);
    } catch (error) {
      console.error('Failed to fetch admin dashboard data');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (!metrics) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '30px' }}>Admin Dashboard</h3>

      {/* Key Metrics */}
      <div className="admin-metrics" style={{ marginBottom: '30px' }}>
        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h4 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>Total Users</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2', margin: 0 }}>
            {metrics.totalUsers}
          </p>
        </div>

        <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h4 style={{ color: '#388e3c', margin: '0 0 10px 0' }}>Total Deposits</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#388e3c', margin: 0 }}>
            ${metrics.totalDeposits.toFixed(2)}
          </p>
        </div>

        <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h4 style={{ color: '#f57c00', margin: '0 0 10px 0' }}>Total Investments</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f57c00', margin: 0 }}>
            ${metrics.totalInvestments.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Pending Items */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff8e1', padding: '20px', borderRadius: '10px', border: '2px solid #ffc107' }}>
          <h4 style={{ color: '#f57c00', margin: '0 0 10px 0' }}>⏳ Pending Deposits</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00', margin: 0 }}>
            {metrics.pendingDeposits}
          </p>
        </div>

        <div style={{ background: '#ffebee', padding: '20px', borderRadius: '10px', border: '2px solid #f44336' }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>💸 Pending Withdrawals</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#d32f2f', margin: 0 }}>
            {metrics.pendingWithdrawals}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-recent-activity" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Deposits */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #dee2e6' }}>
          <h4 style={{ color: '#333', marginBottom: '15px' }}>Recent Deposits</h4>
          {recentActivity.deposits.length > 0 ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              {recentActivity.deposits.map((deposit, index) => (
                <div key={index} style={{
                  background: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 'bold' }}>
                      {deposit.userId.firstName} {deposit.userId.lastName}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      {deposit.userId.email}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 'bold', color: '#28a745' }}>
                      ${deposit.amount.toFixed(2)}
                    </p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#666' }}>
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>No recent deposits</p>
          )}
        </div>

        {/* Recent Withdrawals */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #dee2e6' }}>
          <h4 style={{ color: '#333', marginBottom: '15px' }}>Recent Withdrawals</h4>
          {recentActivity.withdrawals.length > 0 ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              {recentActivity.withdrawals.map((withdrawal, index) => (
                <div key={index} style={{
                  background: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 'bold' }}>
                      {withdrawal.userId.firstName} {withdrawal.userId.lastName}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      {withdrawal.userId.email}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 'bold', color: '#dc3545' }}>
                      ${withdrawal.amount.toFixed(2)}
                    </p>
                    <span style={{
                      background: withdrawal.status === 'approved' ? '#28a745' : '#ffc107',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {withdrawal.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>No recent withdrawals</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;