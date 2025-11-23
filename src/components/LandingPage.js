import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import '../styles/landing.css';

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);



const LandingPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Get Invitation",
      description: "Receive an exclusive invitation code from existing members",
      icon: "📧",
      details: "HPR Farm operates on an invitation-only basis to ensure quality and security for all members."
    },
    {
      id: 2,
      title: "Sign Up",
      description: "Create your account with email verification",
      icon: "👤",
      details: "Complete registration with your invitation code and verify your email address."
    },
    {
      id: 3,
      title: "Deposit USDC",
      description: "Fund your account with USDC on Polygon network",
      icon: "💰",
      details: "Deposit real USDC tokens which are automatically verified on the blockchain."
    },
    {
      id: 4,
      title: "Choose Investment Tier",
      description: "Select from 32 investment tiers ($1,000 - $100,000)",
      icon: "📊",
      details: "Higher tiers offer better daily returns, from 3.30% to 4.00% daily."
    },
    {
      id: 5,
      title: "Start Earning",
      description: "Begin your daily earning cycles (Monday-Friday)",
      icon: "🚀",
      details: "Earnings are calculated daily and can be withdrawn after each cycle completion."
    },
    {
      id: 6,
      title: "Withdraw Profits",
      description: "Request withdrawal of your earnings (85% after fees)",
      icon: "💸",
      details: "Withdraw your profits with admin approval, keeping 15% as platform fee."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

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
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/login" style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            Login
          </Link>
          <Link to="/signup" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '60px 20px',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Welcome to HPR Farm
        </h1>
        <p style={{
          fontSize: '1.3rem',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px auto',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          lineHeight: '1.6'
        }}>
          Premium USDC Investment Platform with Daily Returns
          <br />
          <span style={{ color: '#ffd700' }}>3.30% - 4.00% Daily • Blockchain Verified • Invitation Only</span>
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          marginBottom: '60px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
            <div style={{ fontWeight: 'bold' }}>Invitation Only</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Exclusive Access</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⛓️</div>
            <div style={{ fontWeight: 'bold' }}>Blockchain Verified</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Polygon Network</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📈</div>
            <div style={{ fontWeight: 'bold' }}>Daily Returns</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Up to 4.00%</div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: '120px 20px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '3.5rem',
              color: 'white',
              marginBottom: '25px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #fff 0%, #667eea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              How HPR Farm Works
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '700px',
              margin: '0 auto 30px auto',
              lineHeight: '1.6'
            }}>
              Follow these simple steps to start your investment journey with HPR Farm
            </p>
            <div style={{
              width: '120px',
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              margin: '0 auto',
              borderRadius: '2px',
              boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)'
            }} />
          </div>

          {/* Vertical Timeline */}
          <div style={{
            position: 'relative',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Central Timeline Line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              bottom: '0',
              width: '4px',
              background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
              transform: 'translateX(-50%)',
              borderRadius: '2px',
              boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)'
            }} />

            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              const isActive = activeStep === index;

              return (
                <div
                  key={step.id}
                  style={{
                    position: 'relative',
                    marginBottom: index === steps.length - 1 ? '0' : '60px',
                    opacity: isActive ? 1 : 0.8,
                    transform: isActive ? 'scale(1)' : 'scale(0.98)',
                    transition: 'all 0.6s ease'
                  }}
                >
                  {/* Timeline Node */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: isActive
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    border: '4px solid rgba(255,255,255,0.2)',
                    boxShadow: isActive
                      ? '0 0 30px rgba(102, 126, 234, 0.6), 0 0 60px rgba(102, 126, 234, 0.3)'
                      : '0 5px 20px rgba(0,0,0,0.2)',
                    zIndex: 10,
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.6s ease'
                  }}>
                    {step.id}
                  </div>

                  {/* Content Card */}
                  <div style={{
                    width: '45%',
                    marginLeft: isLeft ? '0' : '55%',
                    background: isActive
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.08)',
                    padding: '40px',
                    borderRadius: '25px',
                    backdropFilter: 'blur(25px)',
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.25)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: isActive
                      ? '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 40px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 15px 35px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    transition: 'all 0.6s ease',
                    overflow: 'hidden'
                  }}>
                    {/* Card Arrow */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      [isLeft ? 'right' : 'left']: '-10px',
                      transform: 'translateY(-50%)',
                      width: '0',
                      height: '0',
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      [isLeft ? 'borderRight' : 'borderLeft']: isActive
                        ? '10px solid rgba(102, 126, 234, 0.3)'
                        : '10px solid rgba(255,255,255,0.1)'
                    }} />

                    {/* Animated Background */}
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
                        animation: 'rotate 10s linear infinite'
                      }} />
                    )}

                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{
                        fontSize: '3.5rem',
                        marginBottom: '20px',
                        textAlign: isLeft ? 'left' : 'right',
                        filter: isActive ? 'drop-shadow(0 0 15px rgba(255,255,255,0.4))' : 'none'
                      }}>
                        {step.icon}
                      </div>
                      <h3 style={{
                        color: 'white',
                        fontSize: '1.8rem',
                        marginBottom: '15px',
                        textAlign: isLeft ? 'left' : 'right',
                        fontWeight: '700',
                        textShadow: isActive ? '0 0 20px rgba(255,255,255,0.3)' : 'none'
                      }}>
                        {step.title}
                      </h3>
                      <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '1.2rem',
                        marginBottom: '20px',
                        textAlign: isLeft ? 'left' : 'right',
                        lineHeight: '1.6'
                      }}>
                        {step.description}
                      </p>
                      <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '1rem',
                        textAlign: isLeft ? 'left' : 'right',
                        lineHeight: '1.5'
                      }}>
                        {step.details}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: '80px 20px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            marginBottom: '60px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Why Choose HPR Farm?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '40px',
              borderRadius: '20px',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛡️</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Secure & Transparent</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                All deposits are verified on Polygon blockchain with automatic processing every 2 minutes.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '40px',
              borderRadius: '20px',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👥</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Referral Rewards</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Earn 10% from Level 1, 3% from Level 2, and 1% from Level 3 referrals.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '40px',
              borderRadius: '20px',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚡</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Fast Processing</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Automated deposit processing and quick withdrawal approvals by admin team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: '80px 20px',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            color: 'white',
            marginBottom: '20px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Ready to Start Earning?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '40px'
          }}>
            Join HPR Farm today and start your journey to financial growth with our premium investment platform.
          </p>
          <Link to="/signup" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px 40px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.3s ease'
          }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get Your Invitation →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '40px 20px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.6)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p>© 2024 HPR Farm. All rights reserved. | Premium USDC Investment Platform</p>
      </footer>
    </div>
  );
};

export default LandingPage;