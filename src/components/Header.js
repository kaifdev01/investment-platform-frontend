import React, { useState } from 'react';

const Header = ({ user, onLogout, onGenerateInvitation, onProfileClick }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div>
        <h1 style={{
          color: 'white',
          margin: 0,
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          HPR Farm
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0,
          fontSize: '12px',
          fontStyle: 'italic'
        }}>
          Investment Platform
        </p>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={onGenerateInvitation}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Invite
          </button>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 12px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '16px' }}>👤</span>
              <span>{user.firstName} {user.lastName}</span>
            </button>
            {showProfileDropdown && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                minWidth: '200px',
                zIndex: 1000
              }}>
                <div style={{ padding: '15px', borderBottom: '1px solid #e1e5e9' }}>
                  <p style={{ margin: '0', fontWeight: 'bold', color: '#333' }}>{user.firstName} {user.lastName}</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    onProfileClick();
                    setShowProfileDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                    borderBottom: '1px solid #e1e5e9'
                  }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#dc3545'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;