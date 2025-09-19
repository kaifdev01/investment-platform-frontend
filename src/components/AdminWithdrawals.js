import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';
import '../styles/responsive.css';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [txHash, setTxHash] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token');
      const [pendingResponse, allResponse] = await Promise.all([
        axios.get(`${API_URL}/withdrawal/admin/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/withdrawal/admin/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setWithdrawals(pendingResponse.data.withdrawals || []);
      setAllWithdrawals(allResponse.data.withdrawals || []);
    } catch (error) {
      console.error('Failed to fetch withdrawals');
      toast.error('Failed to fetch withdrawals');
    }
  };

  const approveWithdrawal = async (withdrawalId) => {
    if (!txHash) {
      toast.error('Please enter transaction hash');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/withdrawal/admin/approve`, 
        { withdrawalId, txHash, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Withdrawal approved successfully');
      setTxHash('');
      setNotes('');
      setSelectedWithdrawal(null);
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve withdrawal');
    }
  };

  const rejectWithdrawal = async (withdrawalId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/withdrawal/admin/reject`, 
        { withdrawalId, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Withdrawal rejected');
      setNotes('');
      setSelectedWithdrawal(null);
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject withdrawal');
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    const interval = setInterval(fetchWithdrawals, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const currentWithdrawals = activeTab === 'pending' ? withdrawals : allWithdrawals;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e1e5e9', marginBottom: '20px' }}>
          {['pending', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: activeTab === tab ? '#667eea' : 'transparent',
                color: activeTab === tab ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: activeTab === tab ? '10px 10px 0 0' : '0'
              }}
            >
              {tab === 'pending' ? `Pending (${withdrawals.length})` : `History (${allWithdrawals.length})`}
            </button>
          ))}
        </div>
        <div className="withdrawal-management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#333', margin: 0 }}>
            {activeTab === 'pending' ? 'Pending Withdrawals' : 'Withdrawal History'}
          </h3>
        <button
          onClick={fetchWithdrawals}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh
        </button>
        </div>
      </div>

      {currentWithdrawals.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {currentWithdrawals.map((withdrawal) => (
            <div key={withdrawal._id} style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              border: `2px solid ${getStatusColor(withdrawal.status)}`
            }}>
              <div className="withdrawal-box" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* User Info */}
                <div className="withdrawal-user-info">
                  <h4 style={{ color: '#333', marginBottom: '10px' }}>User Information</h4>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    {withdrawal.userId.firstName} {withdrawal.userId.lastName}
                  </p>
                  <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                    {withdrawal.userId.email}
                  </p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                    Requested: {new Date(withdrawal.requestedAt).toLocaleString()}
                  </p>
                  <p style={{ 
                    margin: '0 0 5px 0', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    color: getStatusColor(withdrawal.status)
                  }}>
                    Status: {withdrawal.status.toUpperCase()}
                  </p>
                </div>

                {/* Withdrawal Info */}
                <div className="withdrawal-amount-info">
                  <h4 style={{ color: '#333', marginBottom: '10px' }}>Withdrawal Details</h4>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#28a745', fontSize: '18px' }}>
                    ${withdrawal.amount.toFixed(2)} USDC
                  </p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                    Investment: {withdrawal.investmentId?.tier || 'N/A'}
                  </p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                    Wallet: {withdrawal.walletAddress}
                  </p>
                  {withdrawal.processedAt && (
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                      Processed: {new Date(withdrawal.processedAt).toLocaleString()}
                    </p>
                  )}
                  {withdrawal.txHash && (
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                      TX: {withdrawal.txHash}
                    </p>
                  )}
                  {withdrawal.notes && (
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                      Notes: {withdrawal.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {activeTab === 'pending' && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                {selectedWithdrawal === withdrawal._id ? (
                  <div style={{ width: '100%' }}>
                    <input
                      type="text"
                      placeholder="Transaction Hash (for approval)"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '10px'
                      }}
                    />
                    <textarea
                      placeholder="Notes (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        minHeight: '60px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => approveWithdrawal(withdrawal._id)}
                        style={{
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          flex: 1
                        }}
                      >
                        ✅ Approve & Send
                      </button>
                      <button
                        onClick={() => rejectWithdrawal(withdrawal._id)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          flex: 1
                        }}
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => setSelectedWithdrawal(null)}
                        style={{
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedWithdrawal(withdrawal._id)}
                    style={{
                      background: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    💰 Process Withdrawal
                  </button>
                )}
              </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          {activeTab === 'pending' ? 'No pending withdrawals' : 'No withdrawal history'}
        </p>
      )}
    </div>
  );
};

export default AdminWithdrawals;