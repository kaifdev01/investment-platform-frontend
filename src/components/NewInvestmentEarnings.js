import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';
import '../styles/responsive.css';

const NewInvestmentEarnings = ({ dashboardData, fetchDashboard }) => {
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [showWithdrawAll, setShowWithdrawAll] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalPassword, setWithdrawalPassword] = useState('');


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
      const response = await axios.get(`${API_URL}/withdrawal/my-withdrawals?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWithdrawals(response.data.withdrawals || []);
      console.log('Fetched withdrawals at', new Date().toLocaleTimeString(), ':', response.data.withdrawals);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
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

  // eslint-disable-next-line no-unused-vars
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
      // Don't clear wallet address - keep it saved
      fetchInvestments();
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to request withdrawal');
    }
  };

  const handleWithdrawAll = async () => {
    if (!walletAddress) {
      toast.error('Please enter your wallet address');
      return;
    }

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    if (!withdrawalPassword) {
      toast.error('Please enter your withdrawal password');
      return;
    }

    const availableCycles = investments
      .filter(inv => inv.cycleEarnings && inv.cycleEarnings.length > 0)
      .flatMap(investment =>
        investment.cycleEarnings
          .filter(cycle => !cycle.withdrawalRequested)
          .map(cycle => cycle.grossAmount)
      );

    const cycleEarnings = availableCycles.reduce((sum, amount) => sum + amount, 0);
    const userBalance = dashboardData?.accountSummary?.balance || 0;
    const referralRewards = dashboardData?.accountSummary?.referralRewards || 0;
    const totalAvailable = (cycleEarnings * 0.85) + userBalance + referralRewards;

    if (parseFloat(withdrawalAmount) > totalAvailable) {
      toast.error(`Insufficient funds. Available: $${totalAvailable.toFixed(2)}`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/withdrawal/request-all`,
        { 
          walletAddress, 
          withdrawalPassword,
          amount: parseFloat(withdrawalAmount)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      setShowWithdrawAll(false);
      setWithdrawalAmount('');
      setWithdrawalPassword('');
      fetchInvestments();
      fetchWithdrawals();
      fetchDashboard();
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
    }, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Load wallet address from dashboardData or user profile
  useEffect(() => {
    const loadWalletAddress = async () => {
      // First try from dashboard data
      if (dashboardData?.accountSummary?.withdrawalWallet) {
        console.log('Loading wallet address from dashboard:', dashboardData.accountSummary.withdrawalWallet);
        setWalletAddress(dashboardData.accountSummary.withdrawalWallet);
        return;
      }

      // Fallback: load from user profile
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.user.withdrawalWallet) {
          console.log('Loading wallet address from profile:', response.data.user.withdrawalWallet);
          setWalletAddress(response.data.user.withdrawalWallet);
        }
      } catch (error) {
        console.error('Failed to load wallet address:', error);
      }
    };

    if (dashboardData) {
      loadWalletAddress();
    }
  }, [dashboardData]);

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
                    Total Earned: ${((investment.totalEarned || 0) * 0.85).toFixed(2)} (Net)
                  </p>
                  <p style={{ fontSize: '14px', color: 'orange', marginBottom: '4px' }}>Withdrawals may take up to 48 hours to process.</p>
                </div>

                <div className="investment-cycle-actions" style={{ textAlign: 'right' }}>
                  {/* Show cycle status based on current state */}
                  {investment.withdrawalApprovedAt && investment.nextCycleAvailableAt && new Date() < new Date(investment.nextCycleAvailableAt) ? (
                    // Waiting period after withdrawal approval
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
                  ) : investment.earningStarted && investment.cycleEndTime && !investment.earningCompleted ? (
                    // Earning cycle in progress
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

                  ) : (
                    // Ready to start earning (new or next cycle)
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
                          {investment.totalEarned > 0 ? 'Start new 8-hour earning cycle' : '8-hour earning cycle'} (Mon-Fri only)
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
                        🚀 Start {investment.totalEarned > 0 ? 'New Cycle' : 'Earning'}
                      </button>
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

      {/* Withdrawal Management Section */}
      {(investments.some(inv => inv.cycleEarnings && inv.cycleEarnings.length > 0) || withdrawals.length > 0 || (dashboardData?.accountSummary?.balance > 0) || (dashboardData?.accountSummary?.referralRewards > 0)) && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#333', margin: 0 }}>Cycle Withdrawals</h3>
            <button
              onClick={() => {
                fetchInvestments();
                fetchWithdrawals();
              }}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {/* Withdrawal Summary */}
          {(() => {
            // Calculate totals from available cycles
            const availableCycles = investments
              .filter(inv => inv.cycleEarnings && inv.cycleEarnings.length > 0)
              .flatMap(investment =>
                investment.cycleEarnings
                  .filter(cycle => !cycle.withdrawalRequested)
                  .map(cycle => cycle.grossAmount)
              );

            // Include USDC balance and referral rewards
            const cycleEarnings = availableCycles.reduce((sum, amount) => sum + amount, 0);
            const userBalance = dashboardData?.accountSummary?.balance || 0;
            const referralRewards = dashboardData?.accountSummary?.referralRewards || 0;

            // Calculate totals from withdrawal requests
            const completedWithdrawals = withdrawals.filter(w => w.status === 'completed' || w.status === 'approved');
            const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

            const totalAvailable = cycleEarnings + userBalance + referralRewards;
            const totalPending = pendingWithdrawals.reduce((sum, w) => sum + (w.netAmount || w.amount * 0.85), 0);
            const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + (w.netAmount || w.amount * 0.85), 0);
            const totalEarnings = cycleEarnings; // Current available earnings only

            if (totalEarnings > 0 || userBalance > 0 || referralRewards > 0) {
              return (
                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #dee2e6',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ color: '#333', margin: '0 0 15px 0' }}>Withdrawal Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Current Earnings</p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                        ${totalEarnings.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Available to Withdraw</p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                        ${(cycleEarnings * 0.85 + userBalance + referralRewards).toFixed(2)}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#666' }}>
                        USDC + Referral
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Pending Approval</p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#ffc107' }}>
                        ${totalPending.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Successfully Withdrawn</p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#17a2b8' }}>
                        ${totalWithdrawn.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Withdraw All Button */}
                  {totalAvailable > 0 && (
                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                      {!showWithdrawAll ? (
                        <button
                          onClick={() => setShowWithdrawAll(true)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          💰 Withdraw All Available (${(cycleEarnings * 0.85 + userBalance + referralRewards).toFixed(2)})
                        </button>
                      ) : (
                        <div style={{
                          background: '#fff3cd',
                          border: '2px solid #ffc107',
                          borderRadius: '8px',
                          padding: '15px',
                          maxWidth: '400px',
                          margin: '0 auto'
                        }}>
                          <h5 style={{ color: '#856404', margin: '0 0 10px 0' }}>Withdraw Funds</h5>
                          <p style={{ color: '#856404', fontSize: '12px', margin: '0 0 10px 0' }}>
                            Available: ${(cycleEarnings * 0.85 + userBalance + referralRewards).toFixed(2)} (15% fee only on earnings)
                          </p>
                          <input
                            type="text"
                            placeholder="Enter your wallet address"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              fontSize: '12px',
                              marginBottom: '10px',
                              boxSizing: 'border-box'
                            }}
                          />
                          <input
                            type="number"
                            placeholder="Enter withdrawal amount"
                            value={withdrawalAmount}
                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                            min="0"
                            max={(cycleEarnings * 0.85 + userBalance + referralRewards).toFixed(2)}
                            step="0.01"
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              fontSize: '12px',
                              marginBottom: '10px',
                              boxSizing: 'border-box'
                            }}
                          />
                          <input
                            type="password"
                            placeholder="Enter withdrawal password"
                            value={withdrawalPassword}
                            onChange={(e) => setWithdrawalPassword(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              fontSize: '12px',
                              marginBottom: '10px',
                              boxSizing: 'border-box'
                            }}
                          />
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={handleWithdrawAll}
                              style={{
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}
                            >
                              ✅ Confirm Withdrawal
                            </button>
                            <button
                              onClick={() => {
                                setShowWithdrawAll(false);
                                setWithdrawalAmount('');
                                setWithdrawalPassword('');
                              }}
                              style={{
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })()}

          {/* Individual withdrawals disabled - only show withdrawal history */}
          <div style={{ display: 'grid', gap: '15px' }}>
            {/* Show withdrawal status for requested withdrawals */}
            {withdrawals.map((withdrawal, index) => {
              const investment = investments.find(inv => {
                const invId = inv._id?.toString();
                const wId = withdrawal.investmentId?._id?.toString() || withdrawal.investmentId?.toString();
                return invId === wId;
              });

              console.log(`Withdrawal ${index}:`, {
                id: withdrawal._id,
                status: withdrawal.status,
                cycleNumber: withdrawal.cycleNumber,
                amount: withdrawal.amount
              });

              return (
                <div key={`withdrawal-${withdrawal._id}-${index}`} style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #e1e5e9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: '1', minWidth: '250px' }}>
                      <h5 style={{ color: '#333', margin: '0 0 8px 0' }}>
                        {investment?.tier || (!withdrawal.investmentId ? 'Balance & Rewards' : 'Investment')} - {withdrawal.cycleNumber ? `Cycle #${withdrawal.cycleNumber}` : ''} Withdrawal
                      </h5>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                        Amount: ${investment?.amount?.toLocaleString() || withdrawal.amount.toFixed(2)}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                        Gross: ${withdrawal.amount.toFixed(2)}
                      </p>
                      {(withdrawal.feeAmount || 0) > 0 && (
                        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#dc3545' }}>
                          Fee (15%): ${(withdrawal.feeAmount || withdrawal.amount * 0.15).toFixed(2)}
                        </p>
                      )}
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
                        Net: ${(withdrawal.netAmount || withdrawal.amount * 0.85).toFixed(2)}{(withdrawal.feeAmount || 0) === 0 ? ' (No Fee)' : ''}
                      </p>
                    </div>

                    <div style={{ minWidth: '200px', textAlign: 'center', flex: '0 0 auto', maxWidth: '100%' }}>

                      <div>
                        <div style={{
                          padding: '12px',
                          borderRadius: '8px',
                          background: (withdrawal.status === 'completed' || withdrawal.status === 'approved') ? '#d4edda' :
                            withdrawal.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                          border: (withdrawal.status === 'completed' || withdrawal.status === 'approved') ? '1px solid #c3e6cb' :
                            withdrawal.status === 'rejected' ? '1px solid #f5c6cb' : '1px solid #ffeaa7',
                          marginBottom: '8px'
                        }}>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: (withdrawal.status === 'completed' || withdrawal.status === 'approved') ? '#155724' :
                              withdrawal.status === 'rejected' ? '#721c24' : '#856404',
                            margin: 0
                          }}>
                            {(withdrawal.status === 'completed' || withdrawal.status === 'approved') ? 'Completed' :
                              withdrawal.status === 'rejected' ? 'Rejected' : 'Pending'}
                          </p>
                        </div>

                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                          {new Date(withdrawal.requestedAt).toLocaleString()}
                        </p>
                        {withdrawal.txHash && (
                          <p style={{ fontSize: '10px', color: '#666', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
                            TX: {withdrawal.txHash.substring(0, 20)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewInvestmentEarnings;