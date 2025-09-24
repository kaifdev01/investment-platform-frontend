import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';

const DepositSection = ({ user, dashboardData, fetchDashboard }) => {
  const [depositHistory, setDepositHistory] = useState([]);
  const [failedDeposits, setFailedDeposits] = useState([]);
  const [txHash, setTxHash] = useState('');
  const [realAmount, setRealAmount] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [editingDeposit, setEditingDeposit] = useState(null);

  const fetchDepositHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const [historyResponse, failedResponse] = await Promise.all([
        axios.get(`${API_URL}/user/deposit-history`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/withdrawal/failed-deposits`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setDepositHistory(historyResponse.data.deposits || []);
      setFailedDeposits(failedResponse.data.deposits || []);
    } catch (error) {
      console.error('Failed to fetch deposit history:', error);
    }
  };

  const handleRealDeposit = async () => {
    if (!txHash || !realAmount || !fromAddress) {
      toast.error('Please fill all required fields');
      return;
    }

    if (realAmount < 0.5) {
      toast.error('Minimum deposit is $0.5 USDC');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/user/process-deposit`,
        { txHash, amount: realAmount, fromAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Deposit submitted for processing!');
      setTxHash('');
      setRealAmount('');
      setFromAddress('');
      setEditingDeposit(null);
      fetchDepositHistory();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Deposit submission failed');
    }
  };

  const updateFailedDeposit = async (depositId) => {
    if (!txHash || !realAmount) {
      toast.error('Please fill transaction hash and amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/withdrawal/update-failed-deposit`,
        { depositId, txHash, amount: realAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Deposit updated! Will be reprocessed.');
      setTxHash('');
      setRealAmount('');
      setEditingDeposit(null);
      fetchDepositHistory();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  useEffect(() => {
    fetchDepositHistory();

    // Auto-refresh deposit status every 30 seconds
    const interval = setInterval(() => {
      fetchDepositHistory();
      fetchDashboard(); // Also refresh dashboard data
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboard]);
  // min 2 min lgty yahan phir loader na laga die? nhi zaroorat nhi
  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Deposit USDC</h3>

      {/* Deposit Addresses */}
      <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px' }}>
        <h4 style={{ color: '#333', marginBottom: '15px' }}>Platform Deposit Address</h4>

        {/* wallet Address */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          border: '2px solid #667eea',
          marginBottom: '15px'
        }}>
          {/* <h5 style={{ color: '#667eea', margin: '0 0 10px 0' }}>Wallet</h5> */}
          <p style={{
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#333',
            margin: '0 0 15px 0',
            wordBreak: 'break-all'
          }}>
            {user.depositAddress}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(user.depositAddress);
              toast.success('wallet address copied!');
            }}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📋 Copy wallet Address
          </button>
        </div>


        <div style={{ textAlign: 'left', background: '#d1ecf1', padding: '15px', borderRadius: '8px', border: '1px solid #bee5eb' }}>
          <h5 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>🔄 How Real Deposits Work:</h5>
          <ul style={{ color: '#0c5460', margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
            <li><strong>Send USDC</strong> from your wallet (wallet, OKX, etc.) to the address above</li>
            <li><strong>Submit Details</strong> using the form below</li>
            <li><strong>Auto-Processing</strong>: System monitors blockchain and credits your balance</li>
            <li><strong>Network</strong>: Use Polygon network for lower fees</li>
            <li><strong>Minimum</strong>: $0.5 USDC</li>
          </ul>
        </div>
      </div>

      {/* Network Warning */}
      <div style={{
        background: '#f8d7da',
        border: '2px solid #dc3545',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h4 style={{ color: '#721c24', margin: '0 0 10px 0' }}>⚠️ CRITICAL: Network Warning</h4>
        <p style={{ color: '#721c24', margin: 0 }}>
          <strong>ONLY send USDC on Polygon network!</strong><br />
          Sending on Ethereum, BSC, or other networks will result in PERMANENT LOSS of funds.
        </p>
      </div>

      {/* Balance and Deposit Form Row */}
      <div className="deposit-layout" style={{ marginBottom: '20px' }}>
        {/* Current Balance */}
        <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h4 style={{ color: '#155724', margin: '0 0 10px 0' }}>Current Balance</h4>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#155724', margin: 0 }}>
            ${(dashboardData?.accountSummary?.balance || 0).toFixed(2)} USDC
          </p>
        </div>

        {/* Deposit Form */}
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
          <h4 style={{ color: '#333', marginBottom: '15px' }}>Submit Deposit Details</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input
              type="text"
              placeholder="Transaction Hash"
              style={{
                padding: '8px',
                border: '2px solid #dee2e6',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount (USDC)"
              min="0.5"
              style={{
                padding: '8px',
                border: '2px solid #dee2e6',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              value={realAmount}
              onChange={(e) => setRealAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="From Address"
              style={{
                padding: '8px',
                border: '2px solid #dee2e6',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
            />
            <button
              onClick={handleRealDeposit}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Submit Deposit
            </button>
          </div>
        </div>
      </div>



      {/* Failed Deposits */}
      {failedDeposits.length > 0 && (
        <div style={{ background: '#f8d7da', padding: '20px', borderRadius: '10px', border: '2px solid #dc3545', marginBottom: '20px' }}>
          <h4 style={{ color: '#721c24', marginBottom: '15px' }}>❌ Failed Deposits - Update Required</h4>
          {failedDeposits.map((deposit) => (
            <div key={deposit._id} style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#721c24' }}>
                    ${deposit.amount} USDC - FAILED
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    {new Date(deposit.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingDeposit(deposit._id);
                    setTxHash(deposit.txHash || '');
                    setRealAmount(deposit.amount.toString());
                  }}
                  style={{
                    background: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  🔧 Update
                </button>
              </div>

              {editingDeposit === deposit._id && (
                <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>Update Transaction Details</h5>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Correct Transaction Hash"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      style={{
                        padding: '8px',
                        border: '2px solid #dee2e6',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Correct Amount (USDC)"
                      value={realAmount}
                      onChange={(e) => setRealAmount(e.target.value)}
                      style={{
                        padding: '8px',
                        border: '2px solid #dee2e6',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => updateFailedDeposit(deposit._id)}
                        style={{
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          flex: 1
                        }}
                      >
                        ✅ Update & Reprocess
                      </button>
                      <button
                        onClick={() => {
                          setEditingDeposit(null);
                          setTxHash('');
                          setRealAmount('');
                        }}
                        style={{
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Deposit History */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #dee2e6' }}>
        <h4 style={{ color: '#333', marginBottom: '15px' }}>Recent Deposits</h4>
        {depositHistory && depositHistory.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {depositHistory.slice(0, 5).map((deposit, index) => (
              <div key={deposit._id || index} style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    ${deposit.amount ? deposit.amount.toFixed(2) : '0.00'} USDC
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    {deposit.createdAt ? new Date(deposit.createdAt).toLocaleString() : 'Unknown date'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: deposit.status === 'confirmed' ? '#28a745' :
                      deposit.status === 'pending' ? '#ffc107' : '#dc3545',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {deposit.status.toUpperCase()}
                  </span>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                    {deposit.type === 'demo' ? '🧪 Demo' : '💳 Real'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>No deposits yet</p>
        )}
      </div>
    </div>
  );
};

export default DepositSection;