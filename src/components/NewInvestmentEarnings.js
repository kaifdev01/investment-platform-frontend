import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';
import '../styles/responsive.css';

const NewInvestmentEarnings = ({ dashboardData, fetchDashboard }) => {
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestments(response.data.activeInvestments || []);
    } catch (error) {
      console.error('Failed to fetch investments');
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/withdrawal/my-withdrawals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWithdrawals(response.data.withdrawals || []);
      console.log('Fetched withdrawals:', response.data.withdrawals);
    } catch (error) {
      console.error('Failed to fetch withdrawals');
    }
  };

  const startEarning = async (investmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/user/start-earning`,
        { investmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchInvestments();
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start earning');
    }
  };

  const completeCycle = async (investmentId) => {
    const now = new Date();
    const dayOfWeek = now.getDay();

    // Block completing cycles on weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      toast.error('Earnings cannot be completed on weekends. Please wait until Monday.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/user/complete-cycle`,
        { investmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchInvestments();
      fetchDashboard();
      // Force dashboard refresh after delay
      setTimeout(() => {
        fetchDashboard();
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete cycle');
    }
  };

  const requestWithdrawal = async (investmentId) => {
    if (!walletAddress) {
      toast.error('Please enter your wallet address');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/withdrawal/request`,
        { investmentId, walletAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Withdrawal requested! Admin approval required.');
      setWalletAddress('');
      fetchInvestments();
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to request withdrawal');
    }
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ready to complete!';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s remaining`;
  };

  const getWaitingTimeRemaining = (availableTime) => {
    const now = new Date();
    const available = new Date(availableTime);
    const diff = available - now;

    if (diff <= 0) return 'Available now!';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s remaining`;
  };

  useEffect(() => {
    fetchInvestments();
    fetchWithdrawals();
    const interval = setInterval(() => {
      fetchInvestments();
      fetchWithdrawals();
    }, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Investment Cycles</h3>

      {/* Active Investments */}
      {investments.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
          {investments.map((investment, index) => (
            <div key={index} style={{
              background: '#f8f9fa',
              padding: '24px',
              borderRadius: '16px',
              border: '2px solid #e1e5e9'
            }}>
              <div className="investment-cycle-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="investment-cycle-content">
                  <h4 style={{ color: '#333', marginBottom: '8px' }}>{investment.tier}</h4>
                  <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    Amount: ${investment.amount.toLocaleString()}
                  </p>
                  <p style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '4px' }}>
                    Daily Rate: {investment.dailyRate}%
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    Total Earned: ${(investment.totalEarned || 0).toFixed(2)}
                  </p>
                  <p style={{ fontSize: '14px', color: 'red', marginBottom: '4px' }}>Withdrawal Time is 48 Hour.</p>
                </div>

                <div className="investment-cycle-actions" style={{ textAlign: 'right' }}>
                  {investment.withdrawalApprovedAt && investment.nextCycleAvailableAt && new Date() < new Date(investment.nextCycleAvailableAt) ? (
                    <div>
                      <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7'
                      }}>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#856404' }}>
                          Waiting Period (48h)
                        </p>
                        <p style={{ fontSize: '12px', color: '#856404' }}>
                          Next cycle: {getWaitingTimeRemaining(investment.nextCycleAvailableAt)}
                        </p>
                      </div>
                      <button
                        disabled
                        style={{
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          cursor: 'not-allowed'
                        }}
                      >
                        ⏳ Waiting Period
                      </button>
                    </div>
                  ) : !investment.earningStarted || (investment.withdrawalApprovedAt && new Date() >= new Date(investment.nextCycleAvailableAt)) ? (
                    <div>
                      <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        background: '#e7f3ff',
                        border: '1px solid #b3d9ff'
                      }}>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#0066cc' }}>
                          Ready to Start Earning
                        </p>
                        <p style={{ fontSize: '12px', color: '#0066cc' }}>
                          {investment.withdrawalApprovedAt ? 'New cycle available!' : '8-hour earning cycle (Mon-Fri only)'}
                        </p>
                      </div>
                      <button
                        onClick={() => startEarning(investment._id)}
                        style={{
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        🚀 Start Earning
                      </button>
                    </div>
                  ) : investment.cycleEndTime && !investment.earningCompleted ? (
                    <div>
                      <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7'
                      }}>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                          Earning in Progress
                        </p>
                        <p style={{ fontSize: '12px', marginBottom: '4px' }}>
                          {getTimeRemaining(investment.cycleEndTime)}
                        </p>
                      </div>

                      {new Date() >= new Date(investment.cycleEndTime) && new Date().getDay() !== 0 && new Date().getDay() !== 6 ? (
                        <button
                          onClick={() => completeCycle(investment._id)}
                          style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          ✅ Complete Earning
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            cursor: 'not-allowed'
                          }}
                        >
                          ⏳ In Progress
                        </button>
                      )}
                    </div>
                  ) : investment.canWithdraw && investment.earningCompleted ? (
                    <div>
                      <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        background: '#d4edda',
                        border: '1px solid #c3e6cb'
                      }}>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#155724' }}>
                          Ready for Withdrawal
                        </p>
                        <p style={{ fontSize: '12px', color: '#666' }}>
                          Gross: ${investment.totalEarned.toFixed(2)}
                        </p>
                        <p style={{ fontSize: '12px', color: '#dc3545' }}>
                          Fee (15%): ${(investment.totalEarned * 0.15).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#28a745' }}>
                          Net: ${(investment.totalEarned * 0.85).toFixed(2)}
                        </p>
                      </div>

                      <input
                        type="text"
                        placeholder="Your wallet address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          marginBottom: '8px',
                          fontSize: '12px'
                        }}
                      />

                      <button
                        onClick={() => requestWithdrawal(investment._id)}
                        style={{
                          background: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        💰 Request Withdrawal
                      </button>
                    </div>
                  ) : investment.withdrawalRequestedAt ? (
                    (() => {
                      const withdrawal = withdrawals.find(w => {
                        const wId = w.investmentId?._id || w.investmentId;
                        return wId?.toString() === investment._id?.toString();
                      });
                      const status = withdrawal?.status || 'pending';
                      console.log('Investment:', investment._id, 'Withdrawal:', withdrawal?.status);

                      const statusConfig = {
                        pending: { bg: '#fff3cd', border: '#ffeaa7', color: '#856404', text: 'Pending withdrawal time: 48h' },
                        approved: { bg: '#d4edda', border: '#c3e6cb', color: '#155724', text: 'Approved - Processing' },
                        rejected: { bg: '#f8d7da', border: '#f5c6cb', color: '#721c24', text: 'Rejected' },
                        completed: { bg: '#d1ecf1', border: '#bee5eb', color: '#0c5460', text: 'Completed' }
                      };

                      const config = statusConfig[status];

                      return (
                        <div style={{
                          padding: '12px',
                          borderRadius: '8px',
                          background: config.bg,
                          border: `1px solid ${config.border}`
                        }}>
                          <p style={{ fontSize: '14px', fontWeight: 'bold', color: config.color, margin: 0 }}>
                            {config.text}
                          </p>
                          {status === 'pending' && (
                            <p style={{ fontSize: '12px', color: config.color, margin: '4px 0 0 0' }}>
                              Admin has 48 hours to process
                            </p>
                          )}
                          {withdrawal?.txHash && (
                            <p style={{ fontSize: '10px', color: config.color, margin: '4px 0 0 0', wordBreak: 'break-all' }}>
                              TX: {withdrawal.txHash.substring(0, 20)}...
                            </p>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#e2e3e5',
                      border: '1px solid #d6d8db'
                    }}>
                      <p style={{ fontSize: '14px', color: '#6c757d' }}>
                        Cycle Completed
                      </p>

                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>No active investments</p>
      )}

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <div>
          <h4 style={{ color: '#333', marginBottom: '15px' }}>Withdrawal History</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            {withdrawals.map((withdrawal, index) => (
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
                    Net: ${(withdrawal.netAmount || withdrawal.amount * 0.85).toFixed(2)}
                  </p>
                  <p style={{ margin: '0 0 2px 0', fontSize: '10px', color: '#666' }}>
                    Gross: ${withdrawal.amount.toFixed(2)} | Fee: ${(withdrawal.feeAmount || withdrawal.amount * 0.15).toFixed(2)}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    {new Date(withdrawal.requestedAt).toLocaleString()}
                  </p>
                </div>
                <span style={{
                  background: withdrawal.status === 'approved' ? '#28a745' :
                    withdrawal.status === 'pending' ? '#ffc107' : '#dc3545',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {withdrawal.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewInvestmentEarnings;