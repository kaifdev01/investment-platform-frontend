import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';

const DepositSection = ({ user, dashboardData, fetchDashboard }) => {
  const [depositHistory, setDepositHistory] = useState([]);
  const [txHash, setTxHash] = useState('');
  const [realAmount, setRealAmount] = useState('');
  const [fromAddress, setFromAddress] = useState('');

  const fetchDepositHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/deposit-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepositHistory(response.data.deposits);
    } catch (error) {
      console.error('Failed to fetch deposit history');
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
      fetchDepositHistory();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Deposit submission failed');
    }
  };

  useEffect(() => {
    fetchDepositHistory();
  }, []);
  // min 2 min lgty yahan phir loader na laga die? nhi zaroorat nhi
  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Deposit USDC</h3>

      {/* Deposit Address */}
      <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px' }}>
        <h4 style={{ color: '#333', marginBottom: '15px' }}>Platform Deposit Address</h4>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          border: '2px solid #667eea',
          marginBottom: '20px'
        }}>
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
              toast.success('Deposit address copied!');
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
            📋 Copy Address
          </button>
        </div>
        <div style={{ textAlign: 'left', background: '#d1ecf1', padding: '15px', borderRadius: '8px', border: '1px solid #bee5eb' }}>
          <h5 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>🔄 How Real Deposits Work:</h5>
          <ul style={{ color: '#0c5460', margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
            <li><strong>Send USDC</strong> to the address above from your wallet (OKX, MetaMask, etc.)</li>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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



      {/* Deposit History */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #dee2e6' }}>
        <h4 style={{ color: '#333', marginBottom: '15px' }}>Recent Deposits</h4>
        {depositHistory.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {depositHistory.slice(0, 5).map((deposit, index) => (
              <div key={index} style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    ${deposit.amount.toFixed(2)} USDC
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    {new Date(deposit.createdAt).toLocaleString()}
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