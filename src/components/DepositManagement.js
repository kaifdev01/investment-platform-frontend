import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';
import '../styles/responsive.css';

const DepositManagement = () => {
  const [deposits, setDeposits] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/deposits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeposits(response.data.deposits);
    } catch (error) {
      console.error('Failed to fetch deposits');
    }
  };

  const approveDeposit = async (depositId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/process-deposit`, 
        { depositId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Deposit approved successfully!');
      fetchDeposits();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve deposit');
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const filteredDeposits = deposits.filter(deposit => {
    if (filter === 'all') return true;
    return deposit.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      <div className="deposit-management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#333', margin: 0 }}>Deposit Management ({filteredDeposits.length})</h3>
        
        {/* Filter Buttons */}
        <div className="deposit-filter-buttons" style={{ display: 'flex', gap: '10px' }}>
          {['all', 'pending', 'confirmed', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                background: filter === status ? '#667eea' : '#f8f9fa',
                color: filter === status ? 'white' : '#666',
                border: '1px solid #dee2e6',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && ` (${deposits.filter(d => d.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredDeposits.map((deposit) => (
          <div key={deposit._id} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            border: `2px solid ${getStatusColor(deposit.status)}`
          }}>
            <div className="deposit-box" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '20px', alignItems: 'center' }}>
              {/* User Info */}
              <div className="deposit-user-info">
                <h4 style={{ color: '#333', margin: '0 0 5px 0' }}>
                  {deposit.userId.firstName} {deposit.userId.lastName}
                </h4>
                <p style={{ margin: '0 0 3px 0', color: '#666', fontSize: '14px' }}>
                  {deposit.userId.email}
                </p>
                <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                  {new Date(deposit.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Deposit Details */}
              <div className="deposit-amount-info">
                <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  ${deposit.amount.toFixed(2)} USDC
                </p>
                <p style={{ margin: '0 0 3px 0', fontSize: '12px', color: '#666' }}>
                  Type: {deposit.type === 'demo' ? '🧪 Demo' : '💳 Real'}
                </p>
                {deposit.txHash && (
                  <p style={{ margin: 0, fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>
                    TX: {deposit.txHash.substring(0, 30)}...
                  </p>
                )}
              </div>

              {/* Status & Processing Info */}
              <div className="deposit-status-info">
                <span style={{
                  background: getStatusColor(deposit.status),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {deposit.status.toUpperCase()}
                </span>
                {deposit.processedAt && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                    Processed: {new Date(deposit.processedAt).toLocaleString()}
                  </p>
                )}
                {deposit.confirmations && (
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#666' }}>
                    Confirmations: {deposit.confirmations}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="deposit-actions">
                {deposit.status === 'pending' && (
                  <button
                    onClick={() => approveDeposit(deposit._id)}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✅ Approve
                  </button>
                )}
                {deposit.status === 'confirmed' && (
                  <div className="deposit-checkmark" style={{ textAlign: 'center', color: '#28a745', fontSize: '24px' }}>
                    ✅
                  </div>
                )}
                {deposit.status === 'failed' && (
                  <div className="deposit-checkmark" style={{ textAlign: 'center', color: '#dc3545', fontSize: '24px' }}>
                    ❌
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDeposits.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No {filter === 'all' ? '' : filter} deposits found
        </div>
      )}
    </div>
  );
};

export default DepositManagement;