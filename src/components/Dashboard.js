import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from './Header';
import AnimatedBackground from './AnimatedBackground';
import InvitationModal from './InvitationModal';
import ProfileSection from './ProfileSection';
import InvestmentEarnings from './InvestmentEarnings';
import NewInvestmentEarnings from './NewInvestmentEarnings';
import DepositSection from './DepositSection';
import AdminPanel from './AdminPanel';
import AdminWithdrawals from './AdminWithdrawals';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import DepositManagement from './DepositManagement';
import SystemAnalytics from './SystemAnalytics';
import AdminSettings from './AdminSettings';
import BlockedUser from './BlockedUser';
import { API_URL } from '../utils/api';

const Dashboard = ({ user, setUser }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [investmentTiers, setInvestmentTiers] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [referralTree, setReferralTree] = useState(null);
  const [activeTab, setActiveTab] = useState(user?.isAdmin ? 'admin' : 'dashboard');
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState({
    dashboard: false,
    tiers: false,
    referrals: false
  });
  const [withdrawalData, setWithdrawalData] = useState({ withdrawals: [], investments: [] });


  const fetchDashboard = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

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
      setWithdrawalData({
        withdrawals: withdrawalResponse.data.withdrawals || [],
        investments: investmentResponse.data.activeInvestments || []
      });
    } catch (error) {
      console.error('Failed to fetch withdrawal data');
    }
  };

  const fetchInvestmentTiers = async () => {
    if (investmentTiers.length > 0) return;
    try {
      setLoading(prev => ({ ...prev, tiers: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/investment-tiers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestmentTiers(response.data.tiers);
    } catch (error) {
      console.error('Failed to fetch investment tiers');
    } finally {
      setLoading(prev => ({ ...prev, tiers: false }));
    }
  };

  const fetchReferrals = async () => {
    try {
      setLoading(prev => ({ ...prev, referrals: true }));
      const token = localStorage.getItem('token');
      const [referralsResponse, treeResponse] = await Promise.all([
        axios.get(`${API_URL}/user/referrals`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/user/referral-tree`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setReferrals(referralsResponse.data.referrals);
      setReferralTree(treeResponse.data);
    } catch (error) {
      console.error('Failed to fetch referrals');
    } finally {
      setLoading(prev => ({ ...prev, referrals: false }));
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
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    // Block investments on weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      toast.error('Investments are only available Monday through Friday. Please try again on a weekday.');
      return;
    }
    
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
      fetchReferrals(); // Initial fetch
      fetchWithdrawalData();
    }
  }, [user]);

  // Lazy load data when switching tabs
  useEffect(() => {
    if (user) {
      if (activeTab === 'tiers') {
        fetchInvestmentTiers();
      }
    }
  }, [activeTab, user]);

  // Check if user is blocked
  if (user?.isBlocked) {
    return <BlockedUser onLogout={handleLogout} />;
  }

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

      <div className="mobile-padding" style={{ padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: 'white', marginBottom: '30px', fontSize: '28px' }}>Investment Dashboard</h2>

          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px', marginBottom: '20px' }}>
            <div className="dashboard-nav-tabs admin-tabs" style={{ display: 'flex', borderBottom: '1px solid #e1e5e9' }}>
              {(user?.isAdmin ? ['admin', 'analytics', 'users', 'deposits', 'withdrawals', 'referrals'] : ['dashboard', 'deposit', 'tiers', 'investments', 'referrals']).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="dashboard-tab-button admin-tab-button"
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
              {activeTab === 'dashboard' && !user?.isAdmin && (
                loading.dashboard ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '18px', color: '#666' }}>Loading dashboard...</div>
                  </div>
) : dashboardData ? (
                  <>
                  {(() => {
                    const { withdrawals, investments } = withdrawalData;
                    
                    const availableCycles = investments
                      .filter(inv => inv.cycleEarnings && inv.cycleEarnings.length > 0)
                      .flatMap(investment => 
                        investment.cycleEarnings
                          .filter(cycle => !cycle.withdrawalRequested)
                          .map(cycle => cycle.grossAmount)
                      );
                    
                    const completedWithdrawals = withdrawals.filter(w => w.status === 'completed' || w.status === 'approved');
                    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
                    
                    const totalAvailable = availableCycles.reduce((sum, amount) => sum + amount, 0);
                    const totalPending = pendingWithdrawals.reduce((sum, w) => sum + (w.netAmount || w.amount * 0.85), 0);
                    const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + (w.netAmount || w.amount * 0.85), 0);
                    const totalEarnings = totalAvailable + totalPending + totalWithdrawn;
                    
                    return (
                      <div className="grid-responsive">
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
                          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>${totalEarnings.toFixed(2)}</p>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                          <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>Available to Withdraw</h3>
                          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107', margin: 0 }}>${(totalAvailable * 0.85).toFixed(2)}</p>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                          <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>Pending Approval</h3>
                          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14', margin: 0 }}>${totalPending.toFixed(2)}</p>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                          <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>Successfully Withdrawn</h3>
                          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1', margin: 0 }}>${totalWithdrawn.toFixed(2)}</p>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                          <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>Referral Rewards</h3>
                          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8', margin: 0 }}>${dashboardData.accountSummary.referralRewards.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })()}

                  </>
                ) : null
              )}

              {activeTab === 'tiers' && (
                loading.tiers ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '18px', color: '#666' }}>Loading investment tiers...</div>
                  </div>
                ) : (
                  <div className="investment-tiers">
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
                )
              )}

              {activeTab === 'investments' && (
                <NewInvestmentEarnings
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
                <AdminDashboard />
              )}

              {activeTab === 'analytics' && (
                <SystemAnalytics />
              )}



              {activeTab === 'users' && (
                <UserManagement />
              )}

              {activeTab === 'deposits' && (
                <DepositManagement />
              )}

              {activeTab === 'withdrawals' && user?.isAdmin && (
                <AdminWithdrawals />
              )}

              {activeTab === 'referrals' && (
                loading.referrals ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '18px', color: '#666' }}>Loading referrals...</div>
                  </div>
                ) : (
                  <div>
                    <div className="referral-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ color: '#333', margin: 0 }}>Referral Network ({referralTree?.totalReferrals || 0})</h3>
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
                    {referralTree ? (
                      <div style={{ display: 'grid', gap: '20px' }}>
                        {referralTree.level1.length > 0 && (
                          <div className="referral-level-container" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '10px' }}>
                            <h4 style={{ color: '#155724', margin: '0 0 15px 0' }}>Level 1 - Direct Referrals (10% rewards) - {referralTree.level1.length}</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                              {referralTree.level1.map((user, index) => (
                                <div key={index} className="referral-user-box" style={{ background: 'white', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                  <div className="referral-user-info">
                                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{user.firstName} {user.lastName}</p>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{user.email}</p>
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {referralTree.level2.length > 0 && (
                          <div className="referral-level-container" style={{ background: '#fff3cd', padding: '20px', borderRadius: '10px' }}>
                            <h4 style={{ color: '#856404', margin: '0 0 15px 0' }}>Level 2 - Indirect Referrals (3% rewards) - {referralTree.level2.length}</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                              {referralTree.level2.map((user, index) => (
                                <div key={index} style={{ background: 'white', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                  <div>
                                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{user.firstName} {user.lastName}</p>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{user.email}</p>
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {referralTree.level3.length > 0 && (
                          <div className="referral-level-container" style={{ background: '#f8d7da', padding: '20px', borderRadius: '10px' }}>
                            <h4 style={{ color: '#721c24', margin: '0 0 15px 0' }}>Level 3 - Deep Referrals (1% rewards) - {referralTree.level3.length}</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                              {referralTree.level3.map((user, index) => (
                                <div key={index} style={{ background: 'white', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                  <div>
                                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{user.firstName} {user.lastName}</p>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{user.email}</p>
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {referralTree.totalReferrals === 0 && (
                          <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                            <h4 style={{ color: '#333', marginBottom: '10px' }}>No Referrals Yet</h4>
                            <p style={{ color: '#666', margin: 0 }}>Share your invitation code to start building your referral network and earning rewards!</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '18px', color: '#666' }}>Loading referral tree...</div>
                      </div>
                    )}
                  </div>
                )
              )}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;