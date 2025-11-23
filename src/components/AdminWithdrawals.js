import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';
import '../styles/responsive.css';

const AdminWithdrawals = () => {
  const [groupedWithdrawals, setGroupedWithdrawals] = useState([]);
  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [txHash, setTxHash] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

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
      setGroupedWithdrawals(pendingResponse.data.groupedWithdrawals || []);
      setAllWithdrawals(allResponse.data.withdrawals || []);
    } catch (error) {
      console.error('Failed to fetch withdrawals');
      toast.error('Failed to fetch withdrawals');
    }
  };

  const approveUserWithdrawals = async (userId) => {
    if (!txHash) {
      toast.error('Please enter transaction hash');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/withdrawal/admin/approve-user`, 
        { userId, txHash, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      setTxHash('');
      setNotes('');
      setSelectedUser(null);
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve withdrawals');
    }
  };

  const rejectUserWithdrawals = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/withdrawal/admin/reject-user`, 
        { userId, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      setNotes('');
      setSelectedUser(null);
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject withdrawals');
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    const interval = setInterval(fetchWithdrawals, 30000);
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
              {tab === 'pending' ? `Pending (${groupedWithdrawals.length} users)` : `History (${allWithdrawals.length})`}
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

      {activeTab === 'pending' ? (
        groupedWithdrawals.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {groupedWithdrawals.map((userGroup) => (
              <div key={userGroup.user._id} style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                border: '2px solid #ffc107'
              }}>
                <div className="withdrawal-box" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="withdrawal-user-info">
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>User Information</h4>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                      {userGroup.user.firstName} {userGroup.user.lastName}
                    </p>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                      {userGroup.user.email}
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                      Earliest Request: {new Date(userGroup.earliestRequest).toLocaleString()}
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', color: '#ffc107' }}>
                      Status: PENDING ({userGroup.count} withdrawals)
                    </p>
                  </div>

                  <div className="withdrawal-amount-info">
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>Combined Withdrawal Details</h4>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#28a745', fontSize: '18px' }}>
                      Total Gross: ${userGroup.totalGrossAmount.toFixed(2)} USDC
                    </p>
                    {userGroup.totalFeeAmount > 0 ? (
                      <>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#dc3545' }}>
                          Total Fee (15%): ${userGroup.totalFeeAmount.toFixed(2)} USDC
                        </p>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#007bff', fontSize: '16px' }}>
                          Total Net: ${userGroup.totalNetAmount.toFixed(2)} USDC
                        </p>
                      </>
                    ) : (
                      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#007bff', fontSize: '16px' }}>
                        Total Net: ${userGroup.totalNetAmount.toFixed(2)} USDC (No Fee)
                      </p>
                    )}
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                      Number of Withdrawals: {userGroup.count}
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                      Wallet: {userGroup.withdrawals[0]?.walletAddress}
                    </p>
                    <button
                      onClick={() => setExpandedUser(expandedUser === userGroup.user._id ? null : userGroup.user._id)}
                      style={{
                        background: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {expandedUser === userGroup.user._id ? 'Hide Details' : 'Show Individual Withdrawals'}
                    </button>
                  </div>
                </div>

                {expandedUser === userGroup.user._id && (
                  <div style={{ marginTop: '15px', padding: '15px', background: '#e9ecef', borderRadius: '8px' }}>
                    <h5 style={{ color: '#333', marginBottom: '10px' }}>Individual Withdrawals:</h5>
                    {userGroup.withdrawals.map((withdrawal) => (
                      <div key={withdrawal._id} style={{ 
                        background: 'white', 
                        padding: '10px', 
                        borderRadius: '6px', 
                        marginBottom: '8px',
                        fontSize: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ margin: '0 0 3px 0', fontWeight: 'bold' }}>
                              ${(withdrawal.grossAmount || withdrawal.amount || 0).toFixed(2)} USDC
                            </p>
                            <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#666' }}>
                              Cycle {withdrawal.cycleNumber || 'N/A'} • {new Date(withdrawal.createdAt || withdrawal.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {(withdrawal.feeAmount || 0) > 0 && (
                              <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#dc3545' }}>
                                Fee: ${(withdrawal.feeAmount || 0).toFixed(2)}
                              </p>
                            )}
                            <p style={{ margin: '0', fontWeight: 'bold', color: '#007bff' }}>
                              Net: ${(withdrawal.netAmount || withdrawal.amount || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {selectedUser === userGroup.user._id ? (
                    <>
                      <input
                        type="text"
                        placeholder="Transaction Hash"
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        style={{
                          flex: '1',
                          minWidth: '200px',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Notes (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{
                          flex: '1',
                          minWidth: '150px',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      <button
                        onClick={() => approveUserWithdrawals(userGroup.user._id)}
                        style={{
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✓ Approve All
                      </button>
                      <button
                        onClick={() => rejectUserWithdrawals(userGroup.user._id)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✗ Reject All
                      </button>
                      <button
                        onClick={() => setSelectedUser(null)}
                        style={{
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedUser(userGroup.user._id)}
                      style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      Process All Withdrawals (${userGroup.totalNetAmount.toFixed(2)})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No pending withdrawals</p>
          </div>
        )
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {allWithdrawals.length > 0 ? (
            allWithdrawals.map((withdrawal) => (
              <div key={withdrawal._id} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                border: `2px solid ${getStatusColor(withdrawal.status)}`
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div>
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>User</h4>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                      {withdrawal.user.firstName} {withdrawal.user.lastName}
                    </p>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                      {withdrawal.user.email}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>Amount</h4>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#28a745' }}>
                      ${withdrawal.grossAmount.toFixed(2)} USDC
                    </p>
                    {withdrawal.feeAmount > 0 && (
                      <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#dc3545' }}>
                        Fee: ${withdrawal.feeAmount.toFixed(2)}
                      </p>
                    )}
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#007bff' }}>
                      Net: ${withdrawal.netAmount.toFixed(2)} USDC
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>Status</h4>
                    <p style={{ 
                      margin: '0 0 5px 0', 
                      fontWeight: 'bold', 
                      color: getStatusColor(withdrawal.status),
                      textTransform: 'uppercase'
                    }}>
                      {withdrawal.status}
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                      {new Date(withdrawal.createdAt).toLocaleString()}
                    </p>
                    {withdrawal.txHash && (
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                        TX: {withdrawal.txHash}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No withdrawal history</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;