import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';

const InvestmentEarnings = ({ dashboardData, fetchDashboard }) => {
  const [activeCycles, setActiveCycles] = useState([]);

  const fetchActiveCycles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/active-cycles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveCycles(response.data.cycles || []);
    } catch (error) {
      console.error('Failed to fetch active cycles:', error);
      setActiveCycles([]);
    }
  };

  const startCycle = async (investmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/user/start-cycle`,
        { investmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Earning cycle started!');
      fetchActiveCycles();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start cycle');
    }
  };

  const claimReward = async (cycleId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/user/claim-reward`,
        { cycleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Claimed $${response.data.earning} reward!`);
      fetchActiveCycles();
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to claim reward');
    }
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ready to claim!';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s remaining`;
  };

  const isWeekday = () => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5;
  };

  useEffect(() => {
    fetchActiveCycles();
    const interval = setInterval(fetchActiveCycles, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Investment Earnings</h3>

      {!isWeekday() && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
          <p style={{ color: '#856404', textAlign: 'center', margin: 0 }}>
            ⚠️ Weekend Notice: Earnings calculated after 20 minutes on weekends (Testing Mode)
          </p>
        </div>
      )}

      {dashboardData?.activeInvestments?.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {dashboardData.activeInvestments.map((investment, index) => {
            const activeCycle = activeCycles.find(cycle =>
              cycle.investmentId && cycle.investmentId._id === investment._id
            );

            return (
              <div key={index} style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', border: '2px solid #e1e5e9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ color: '#333', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{investment.tier}</h4>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Amount: ${investment.amount.toLocaleString()}</p>
                    <p style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '4px' }}>Daily Rate: {investment.dailyRate}%</p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      Total Earned: ${(investment.totalEarned || 0).toFixed(2)}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Cycles Completed: {investment.cyclesCompleted || 0}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {activeCycle ? (
                      <div>
                        <div style={{
                          padding: '12px',
                          borderRadius: '8px',
                          marginBottom: '12px',
                          border: '1px solid',
                          background: activeCycle.isWeekday ? '#d4edda' : '#fff3cd',
                          borderColor: activeCycle.isWeekday ? '#c3e6cb' : '#ffeaa7'
                        }}>
                          <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                            Active Cycle
                          </p>
                          <p style={{ fontSize: '12px', marginBottom: '4px' }}>
                            {getTimeRemaining(activeCycle.endTime)}
                          </p>
                          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#28a745' }}>
                            Earning: ${activeCycle.cycleEarning.toFixed(2)}
                          </p>
                        </div>

                        {new Date() >= new Date(activeCycle.endTime) ? (
                          <button
                            onClick={() => claimReward(activeCycle._id)}
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
                            💰 Claim Reward
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
                      <button
                        onClick={() => startCycle(investment._id)}
                        style={{
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        🚀 Start 5min Cycle
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', fontSize: '14px' }}>
                  <p style={{ color: '#666', marginBottom: '4px' }}>
                    <strong>How it works:</strong> Each cycle lasts 5 minutes. You earn {(investment.dailyRate / 3).toFixed(1)}% per cycle (daily rate ÷ 3).
                  </p>
                  <p style={{ color: '#666' }}>
                    <strong>Testing Mode:</strong> Weekends earn after 20 minutes, weekdays earn immediately.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>No active investments</p>
      )}
    </div>
  );
};

export default InvestmentEarnings;