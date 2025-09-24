import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';

const WithdrawalSummary = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [investments, setInvestments] = useState([]);

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
    </div>
  );
};

export default WithdrawalSummary;