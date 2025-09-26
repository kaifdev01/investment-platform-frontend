import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import '../styles/responsive.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddBalance, setShowAddBalance] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceNote, setBalanceNote] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  const toggleBlockUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/user/admin/toggle-block/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user block status');
    }
  };

  const addUserBalance = async (userId) => {
    if (!balanceAmount || parseFloat(balanceAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin/add-user-balance`, {
        userId,
        amount: parseFloat(balanceAmount),
        note: balanceNote || 'Admin balance addition'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(response.data.message);
      setShowAddBalance(null);
      setBalanceAmount('');
      setBalanceNote('');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add balance');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>User Management ({users.length} users)</h3>

      <div style={{ display: 'grid', gap: '15px' }}>
        {users.map((user) => (
          <div key={user._id} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #dee2e6'
          }}>
            <div className="user-management-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {/* User Info */}
              <div className="user-basic-info" style={{ flex: 1 }}>
                <div className="user-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <h4 style={{ color: '#333', margin: '0 0 10px 0' }}>
                      {user.firstName} {user.lastName}
                      {user.isAdmin && (
                        <span style={{
                          background: '#dc3545',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          marginLeft: '10px'
                        }}>
                          ADMIN
                        </span>
                      )}
                      {user.isBlocked && (
                        <span style={{
                          background: '#6c757d',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          marginLeft: '10px'
                        }}>
                          BLOCKED
                        </span>
                      )}
                    </h4>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>📧 {user.email}</p>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>📱 {user.phone}</p>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h5 style={{ color: '#333', margin: '0 0 10px 0' }}>Account Summary</h5>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                      💰 Balance: <strong>${user.balance.toFixed(2)}</strong>
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                      📈 Total Investment: <strong>${user.totalInvestment.toFixed(2)}</strong>
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                      💵 Total Earnings: <strong>${user.totalEarnings.toFixed(2)}</strong>
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                      🎁 Referral Rewards: <strong>${user.referralRewards.toFixed(2)}</strong>
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                      💳 Total Deposits: <strong>${user.totalDeposits.toFixed(2)}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="user-actions" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <button
                  onClick={() => setSelectedUser(selectedUser === user._id ? null : user._id)}
                  style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {selectedUser === user._id ? 'Hide Details' : 'View Deposits'}
                </button>
                <button
                  onClick={() => setShowAddBalance(showAddBalance === user._id ? null : user._id)}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  💰 Add Balance
                </button>
                {!user.isAdmin && (
                  <button
                    onClick={() => toggleBlockUser(user._id)}
                    style={{
                      background: user.isBlocked ? '#28a745' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                )}
              </div>
            </div>

            {/* Add Balance Form */}
            {showAddBalance === user._id && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e8', borderRadius: '8px', border: '2px solid #28a745' }}>
                <h5 style={{ color: '#333', margin: '0 0 10px 0' }}>
                  💰 Add Balance to {user.firstName} {user.lastName}
                </h5>
                <div style={{ 
                  background: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '6px', 
                  padding: '12px', 
                  marginBottom: '15px' 
                }}>
                  <p style={{ 
                    color: '#856404', 
                    margin: 0, 
                    fontSize: '14px', 
                    fontWeight: 'bold' 
                  }}>
                    ⚠️ WARNING: Please add balance carefully. This action cannot be undone once confirmed. Double-check the amount before proceeding.
                  </p>
                </div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Amount ($)</label>
                    <input
                      type="number"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      placeholder="Enter amount to add"
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Note (Optional)</label>
                    <input
                      type="text"
                      value={balanceNote}
                      onChange={(e) => setBalanceNote(e.target.value)}
                      placeholder="Reason for balance addition"
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      onClick={() => addUserBalance(user._id)}
                      style={{
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ✅ Add Balance
                    </button>
                    <button
                      onClick={() => {
                        setShowAddBalance(null);
                        setBalanceAmount('');
                        setBalanceNote('');
                      }}
                      style={{
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Deposit Details */}
            {selectedUser === user._id && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h5 style={{ color: '#333', margin: '0 0 15px 0' }}>
                  Deposit History ({user.deposits.length})
                </h5>
                {user.deposits.length > 0 ? (
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {user.deposits.map((deposit, index) => (
                      <div key={index} style={{
                        background: 'white',
                        padding: '12px',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <p style={{ margin: '0 0 3px 0', fontWeight: 'bold' }}>
                            ${deposit.amount.toFixed(2)} USDC
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                            {new Date(deposit.createdAt).toLocaleString()}
                          </p>
                          {deposit.txHash && (
                            <p style={{ margin: '3px 0 0 0', fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>
                              TX: {deposit.txHash.substring(0, 20)}...
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            background: deposit.status === 'confirmed' ? '#28a745' :
                              deposit.status === 'pending' ? '#ffc107' : '#dc3545',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            {deposit.status.toUpperCase()}
                          </span>
                          <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#666' }}>
                            {deposit.type === 'demo' ? '🧪 Demo' : deposit.type === 'admin_credit' ? '👨‍💼 Admin' : '💳 Real'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>No deposits yet</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No users found
        </div>
      )}
    </div>
  );
};

export default UserManagement;