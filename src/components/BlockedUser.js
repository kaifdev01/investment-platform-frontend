import React from 'react';

const BlockedUser = ({ onLogout }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          fontSize: '60px',
          marginBottom: '20px'
        }}>
          🚫
        </div>
        
        <h2 style={{
          color: '#dc3545',
          marginBottom: '20px',
          fontSize: '24px'
        }}>
          Account Blocked
        </h2>
        
        <p style={{
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '30px'
        }}>
          Your account has been temporarily blocked by the administrator. 
          Please contact support for assistance or more information about your account status.
        </p>
        
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h4 style={{ color: '#333', marginBottom: '10px' }}>Contact Support</h4>
          <p style={{ color: '#666', margin: 0 }}>
            📧 support@platform.com<br/>
            📞 +1 (555) 123-4567
          </p>
        </div>
        
        <button
          onClick={onLogout}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default BlockedUser;