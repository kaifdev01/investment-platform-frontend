import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import '../styles/responsive.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddBalance, setShowAddBalance] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceNote, setBalanceNote] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showUpdateScore, setShowUpdateScore] = useState(null);
  const [scoreChange, setScoreChange] = useState('');
  const [scoreNote, setScoreNote] = useState('');
  const [showRegisterUser, setShowRegisterUser] = useState(null);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    withdrawalPassword: ''
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
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

  const updateUserBalance = async (userId) => {
    if (balanceAmount === '' || parseFloat(balanceAmount) < 0) {
      alert('Please enter a valid amount (0 or greater)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin/update-user-balance`, {
        userId,
        newBalance: parseFloat(balanceAmount),
        note: balanceNote || 'Admin balance update'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(response.data.message);
      setShowAddBalance(null);
      setBalanceAmount('');
      setBalanceNote('');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update balance');
    }
  };

  const resetUserPassword = async (userId) => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (!window.confirm('Are you sure you want to reset this user\'s password?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin/reset-user-password`, {
        userId,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(response.data.message);
      setShowResetPassword(null);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reset password');
    }
  };

  const registerUserUnder = async (referrerId) => {
    if (!registerData.firstName || !registerData.lastName || !registerData.email || 
        !registerData.phone || !registerData.password || !registerData.withdrawalPassword) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin-register`, {
        ...registerData,
        referrerId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('User registered successfully!');
      setShowRegisterUser(null);
      setRegisterData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        withdrawalPassword: ''
      });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  const updateUserScore = async (userId) => {
    if (!scoreChange || isNaN(scoreChange)) {
      alert('Please enter a valid score change (positive or negative number)');
      return;
    }

    const change = parseInt(scoreChange);
    const action = change >= 0 ? 'increase' : 'decrease';
    const absChange = Math.abs(change);

    if (!window.confirm(`Are you sure you want to ${action} this user's score by ${absChange} points?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin/update-user-score`, {
        userId,
        scoreChange: change,
        note: scoreNote || `Admin ${action} by ${absChange} points`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(response.data.message);
      setShowUpdateScore(null);
      setScoreChange('');
      setScoreNote('');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update score');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [users]);

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>User Management ({filteredUsers.length} of {users.length} users)</h3>
      
      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Search users by name or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e1e5e9',
            borderRadius: '10px',
            fontSize: '16px',
            outline: 'none',
            background: '#f8f9fa'
          }}
        />
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredUsers.map((user) => (
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
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                      🏆 Activity Score: <strong>{user.score} points</strong>
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
                  💰 Update Balance
                </button>
                <button
                  onClick={() => setShowResetPassword(showResetPassword === user._id ? null : user._id)}
                  style={{
                    background: '#ffc107',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🔑 Reset Password
                </button>
                <button
                  onClick={() => setShowUpdateScore(showUpdateScore === user._id ? null : user._id)}
                  style={{
                    background: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🏆 Update Score
                </button>
                <button
                  onClick={() => setShowRegisterUser(showRegisterUser === user._id ? null : user._id)}
                  style={{
                    background: '#6f42c1',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  👤 Register User
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

            {/* Update Score Form */}
            {showUpdateScore === user._id && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#e8f4fd', borderRadius: '8px', border: '2px solid #17a2b8' }}>
                <h5 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>
                  🏆 Update Score for {user.firstName} {user.lastName}
                </h5>
                <p style={{ color: '#0c5460', fontSize: '12px', margin: '0 0 10px 0' }}>
                  Current Score: <strong>{user.score || 50} points</strong>
                </p>
                <div style={{
                  background: '#d1ecf1',
                  border: '1px solid #bee5eb',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '15px'
                }}>
                  <p style={{
                    color: '#0c5460',
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    ℹ️ Enter positive numbers to increase score, negative numbers to decrease score.
                  </p>
                </div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Score Change</label>
                    <input
                      type="number"
                      value={scoreChange}
                      onChange={(e) => setScoreChange(e.target.value)}
                      placeholder="Enter +/- points (e.g., +10 or -5)"
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
                      value={scoreNote}
                      onChange={(e) => setScoreNote(e.target.value)}
                      placeholder="Reason for score change"
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
                      onClick={() => updateUserScore(user._id)}
                      style={{
                        background: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ✅ Update Score
                    </button>
                    <button
                      onClick={() => {
                        setShowUpdateScore(null);
                        setScoreChange('');
                        setScoreNote('');
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

            {/* Register User Form */}
            {showRegisterUser === user._id && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#f3e5f5', borderRadius: '8px', border: '2px solid #6f42c1' }}>
                <h5 style={{ color: '#4a148c', margin: '0 0 10px 0' }}>
                  👤 Register New User Under {user.firstName} {user.lastName}
                </h5>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name</label>
                      <input
                        type="text"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                        placeholder="First Name"
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
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name</label>
                      <input
                        type="text"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                        placeholder="Last Name"
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      placeholder="Email Address"
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
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone</label>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                      placeholder="Phone Number"
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
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Login Password</label>
                    <input
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      placeholder="Login Password"
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
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Withdrawal Password</label>
                    <input
                      type="password"
                      value={registerData.withdrawalPassword}
                      onChange={(e) => setRegisterData({...registerData, withdrawalPassword: e.target.value})}
                      placeholder="Withdrawal Password"
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
                      onClick={() => registerUserUnder(user._id)}
                      style={{
                        background: '#6f42c1',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ✅ Register User
                    </button>
                    <button
                      onClick={() => {
                        setShowRegisterUser(null);
                        setRegisterData({
                          firstName: '',
                          lastName: '',
                          email: '',
                          phone: '',
                          password: '',
                          withdrawalPassword: ''
                        });
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

            {/* Reset Password Form */}
            {showResetPassword === user._id && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107' }}>
                <h5 style={{ color: '#856404', margin: '0 0 10px 0' }}>
                  🔑 Reset Password for {user.firstName} {user.lastName}
                </h5>
                <div style={{
                  background: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '15px'
                }}>
                  <p style={{
                    color: '#721c24',
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    ⚠️ WARNING: This will permanently change the user's password. The user will need to use the new password to login.
                  </p>
                </div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
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
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
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
                      onClick={() => resetUserPassword(user._id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ✅ Reset Password
                    </button>
                    <button
                      onClick={() => {
                        setShowResetPassword(null);
                        setNewPassword('');
                        setConfirmPassword('');
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

            {/* Add Balance Form */}
            {showAddBalance === user._id && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e8', borderRadius: '8px', border: '2px solid #28a745' }}>
                <h5 style={{ color: '#333', margin: '0 0 10px 0' }}>
                  💰 Update Balance for {user.firstName} {user.lastName}
                </h5>
                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 10px 0' }}>
                  Current Balance: <strong>${user.balance.toFixed(2)}</strong>
                </p>
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
                    ⚠️ WARNING: This will set the user's balance to the exact amount entered. This action cannot be undone.
                  </p>
                </div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Balance ($)</label>
                    <input
                      type="number"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      placeholder={`Current: ${user.balance.toFixed(2)}`}
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
                      onClick={() => updateUserBalance(user._id)}
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
                      ✅ Update Balance
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

      {filteredUsers.length === 0 && users.length > 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No users found matching "{searchTerm}"</p>
          <button
            onClick={() => handleSearch('')}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Clear Search
          </button>
        </div>
      )}
      
      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No users found
        </div>
      )}
    </div>
  );
};

export default UserManagement;