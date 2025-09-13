import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from './Header';
import AnimatedBackground from './AnimatedBackground';
import InvitationModal from './InvitationModal';
import ProfileSection from './ProfileSection';
import InvestmentEarnings from './InvestmentEarnings';
import DepositSection from './DepositSection';
import AdminPanel from './AdminPanel';

const API_URL = 'https://investment-platform-backend.vercel.app/api';

const Dashboard = ({ user, setUser }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [investmentTiers, setInvestmentTiers] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');


  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    }
  };

  const fetchInvestmentTiers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/investment-tiers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestmentTiers(response.data.tiers);
    } catch (error) {
      console.error('Failed to fetch investment tiers');
    }
  };

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/referrals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReferrals(response.data.referrals);
    } catch (error) {
      console.error('Failed to fetch referrals');
    }
  };

  const generateInvitation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/user/generate-invitation`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGeneratedCode(response.data.code);
      setShowInvitationModal(true);
      toast.success('Invitation code generated!');
    } catch (error) {
      toast.error('Failed to generate invitation code');
    }
  };

  const handleInvestment = async (amount) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/user/invest`, { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Investment created successfully!');
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Investment failed');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setGeneratedCode('');
    setDashboardData(null);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };



  useEffect(() => {
    if (user) {
      fetchDashboard();
      fetchInvestmentTiers();
      fetchReferrals();

      // Auto-refresh referrals every 5 seconds
      const interval = setInterval(() => {
        fetchReferrals();
      }, 5000);

      // Refresh when window becomes active
      const handleFocus = () => {
        fetchReferrals();
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [user]);

  // Refresh referrals when switching to referrals tab
  useEffect(() => {
    if (activeTab === 'referrals' && user) {
      fetchReferrals();
    }
  }, [activeTab, user]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      <Header user={user} onLogout={handleLogout} onGenerateInvitation={generateInvitation} onProfileClick={handleProfileClick} />
      <InvitationModal
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
        invitationCode={generatedCode}
      />

      {showProfileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowProfileModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
            <ProfileSection user={user} setUser={setUser} />
          </div>
        </div>
      )}

      <div style={{ padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: 'white', marginBottom: '30px', fontSize: '28px' }}>Investment Dashboard</h2>

          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e1e5e9' }}>
              {['dashboard', 'deposit', 'tiers', 'investments', 'referrals', 'admin'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: '15px 20px',
                    border: 'none',
                    background: activeTab === tab ? '#667eea' : 'transparent',
                    color: activeTab === tab ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: activeTab === tab ? '20px 20px 0 0' : '0'
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ padding: '30px' }}>
              {activeTab === 'dashboard' && dashboardData && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>USDC Balance</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>${dashboardData.accountSummary.balance.toFixed(4) || 0}</p>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>Total Investment</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: 0 }}>${dashboardData.accountSummary.totalInvestment.toFixed(4)}</p>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>Total Earnings</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>${dashboardData.accountSummary.totalEarnings.toFixed(4)}</p>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>Withdrawable Balance</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107', margin: 0 }}>${dashboardData.accountSummary.withdrawableBalance.toFixed(4)}</p>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>Referral Rewards</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8', margin: 0 }}>${dashboardData.accountSummary.referralRewards.toFixed(2)}</p>
                  </div>
                </div>
              )}

              {activeTab === 'tiers' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {investmentTiers.map((tier, index) => (
                    <div key={index} style={{
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      padding: '25px',
                      borderRadius: '15px',
                      border: '2px solid #e1e5e9',
                      textAlign: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                      <h4 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '18px' }}>{tier.tier}</h4>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: '10px 0' }}>${tier.amount.toLocaleString()}</p>
                      <p style={{ color: '#28a745', fontWeight: 'bold', margin: '10px 0' }}>{tier.dailyRate}% Daily</p>
                      <button
                        onClick={() => handleInvestment(tier.amount)}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          marginTop: '10px'
                        }}
                      >
                        Invest Now
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'investments' && (
                <InvestmentEarnings
                  dashboardData={dashboardData}
                  fetchDashboard={fetchDashboard}
                />
              )}

              {activeTab === 'deposit' && (
                <DepositSection
                  user={user}
                  dashboardData={dashboardData}
                  fetchDashboard={fetchDashboard}
                />
              )}

              {activeTab === 'admin' && (
                <AdminPanel />
              )}

              {activeTab === 'referrals' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: '#333', margin: 0 }}>My Referrals ({referrals.length})</h3>
                    <button
                      onClick={fetchReferrals}
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
                  {referrals.length > 0 ? (
                    <div style={{ display: 'grid', gap: '15px' }}>
                      {referrals.map((referral, index) => (
                        <div key={index} style={{
                          background: '#f8f9fa',
                          padding: '20px',
                          borderRadius: '10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{referral.firstName} {referral.lastName}</p>
                            <p style={{ margin: '0 0 5px 0', color: '#666' }}>{referral.email}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Joined: {new Date(referral.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>No referrals yet</p>
                  )}
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;