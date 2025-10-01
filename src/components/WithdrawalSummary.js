import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';

const WithdrawalSummary = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [showWithdrawAll, setShowWithdrawAll] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchWithdrawalData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [withdrawalResponse, investmentResponse] = await Promise.all([
          axios.get(`${API_URL}/withdrawal/my-withdrawals`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/user/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setWithdrawals(withdrawalResponse.data.withdrawals || []);
        setInvestments(investmentResponse.data.activeInvestments || []);
        setDashboardData(investmentResponse.data);

        // Auto-fill saved wallet address
        if (investmentResponse.data.accountSummary?.withdrawalWallet) {
          setWalletAddress(investmentResponse.data.accountSummary.withdrawalWallet);
        }
      } catch (error) {
        console.error('Failed to fetch withdrawal data');
      }
    };
    fetchWithdrawalData();
  }, []);

  // Calculate totals from available cycles
  const availableCycles = investments
    .filter(inv => inv.cycleEarnings && inv.cycleEarnings.length > 0)
    .flatMap(investment =>
      investment.cycleEarnings
        .filter(cycle => !cycle.withdrawalRequested)
        .map(cycle => cycle.grossAmount)
    );

  // Calculate totals from withdrawal requests
  const completedWithdrawals = withdrawals.filter(w => w.status === 'completed' || w.status === 'approved');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  const totalAvailable = availableCycles.reduce((sum, amount) => sum + amount, 0);
  const totalPending = pendingWithdrawals.reduce((sum, w) => sum + (w.netAmount || w.amount * 0.85), 0);
  const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + (w.netAmount || w.amount * 0.85), 0);
  const totalEarnings = totalAvailable + totalPending + totalWithdrawn;

  const handleWithdrawAll = async () => {
    if (!walletAddress) {
      toast.error('Please enter your wallet address');
      return;
    }

    if (totalAvailable <= 0) {
      toast.error('No available earnings to withdraw');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/withdrawal/request-all`,
        { walletAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      setWalletAddress('');
      setShowWithdrawAll(false);

      // Refresh data
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to request withdrawal');
    }
  };

  if (totalEarnings <= 0) return null;

  return (
    <div style={{
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '15px',
      border: '2px solid #dee2e6',
      marginTop: '30px'
    }}>
      <h3 style={{ color: '#333', margin: '0 0 20px 0', textAlign: 'center' }}>Withdrawal Summary</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>Total Earnings</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            ${totalEarnings.toFixed(2)}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>Available to Withdraw</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
            ${(totalAvailable * 0.85).toFixed(2)}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>Pending Approval</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>
            ${totalPending.toFixed(2)}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>Successfully Withdrawn</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#17a2b8' }}>
            ${totalWithdrawn.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Withdraw All Button */}
      {
        totalAvailable > 0 && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {!showWithdrawAll ? (
              <button
                onClick={() => setShowWithdrawAll(true)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                💰 Withdraw All Available (${(totalAvailable * 0.85).toFixed(2)})
              </button>
            ) : (
              <div style={{
                background: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: '10px',
                padding: '20px',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                <h4 style={{ color: '#856404', margin: '0 0 15px 0' }}>Withdraw All Available Earnings</h4>
                <p style={{ color: '#856404', fontSize: '14px', margin: '0 0 15px 0' }}>
                  You will receive ${(totalAvailable * 0.85).toFixed(2)} after 15% platform fee
                </p>
                <input
                  type="text"
                  placeholder="Enter your wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={handleWithdrawAll}
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
                    ✅ Confirm Withdraw All
                  </button>
                  <button
                    onClick={() => {
                      setShowWithdrawAll(false);
                      setWalletAddress('');
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
            )}
          </div>
        )
      }
    </div >
  );
};

export default WithdrawalSummary;