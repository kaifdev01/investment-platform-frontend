import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';

const WelcomePanel = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />
      
      {/* Header */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          HPR Farm
        </div>
        <button
          onClick={onLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            border: 'none',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ padding: '40px 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Welcome Section */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '25px',
            padding: '40px',
            marginBottom: '30px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              color: '#333',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#666',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Great to see you again! Your HPR Farm account is ready for action.
              <br />
              Check your investments, earnings, and explore new opportunities.
            </p>
            
            <button
              onClick={handleDashboardClick}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '30px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Go to Dashboard →
            </button>
          </div>

          {/* Advertisements Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '25px',
            marginBottom: '30px'
          }}>
            
            {/* Ad 1 - Investment Opportunity */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '30px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚀</div>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>New Investment Tiers Available!</h3>
              <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
                Explore our latest high-yield investment options with returns up to 4.00% daily.
              </p>
              <button
                onClick={handleDashboardClick}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  padding: '10px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                View Tiers
              </button>
            </div>

            {/* Ad 2 - Referral Program */}
            <div style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              borderRadius: '20px',
              padding: '30px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👥</div>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>Earn with Referrals</h3>
              <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
                Invite friends and earn up to 10% from their investments. Build your network today!
              </p>
              <button
                onClick={handleDashboardClick}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  padding: '10px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Get Invitation Code
              </button>
            </div>

            {/* Ad 3 - Security Notice */}
            <div style={{
              background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
              borderRadius: '20px',
              padding: '30px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🛡️</div>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>Secure & Verified</h3>
              <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
                All transactions are verified on Polygon blockchain. Your investments are safe with us.
              </p>
              <button
                onClick={handleDashboardClick}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  padding: '10px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                View Security
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>Platform Highlights</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
                <div style={{ fontWeight: 'bold', color: '#333' }}>32 Investment Tiers</div>
                <div style={{ fontSize: '14px', color: '#666' }}>$1K - $100K Range</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📈</div>
                <div style={{ fontWeight: 'bold', color: '#333' }}>Daily Returns</div>
                <div style={{ fontSize: '14px', color: '#666' }}>3.30% - 4.00%</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div>
                <div style={{ fontWeight: 'bold', color: '#333' }}>Auto Processing</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Every 2 Minutes</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
                <div style={{ fontWeight: 'bold', color: '#333' }}>Invitation Only</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Exclusive Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;