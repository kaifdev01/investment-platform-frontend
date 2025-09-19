import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';

const AdminSettings = ({ user, setUser }) => {
  const [newEmail, setNewEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    
    if (!newEmail) {
      toast.error('Please enter a new email address');
      return;
    }

    if (newEmail === user.email) {
      toast.error('New email must be different from current email');
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/user/admin/update-email`, 
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update user object with new email
      setUser({ ...user, email: newEmail });
      toast.success('Email updated successfully!');
      setNewEmail('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update email');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Admin Settings</h3>

      {/* Current Admin Info */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px' 
      }}>
        <h4 style={{ color: '#333', margin: '0 0 15px 0' }}>Current Admin Information</h4>
        <div style={{ display: 'grid', gap: '10px' }}>
          <p style={{ margin: 0 }}>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Current Email:</strong> {user.email}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Phone:</strong> {user.phone}
          </p>
        </div>
      </div>

      {/* Email Update Form */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        border: '1px solid #dee2e6' 
      }}>
        <h4 style={{ color: '#333', margin: '0 0 15px 0' }}>Update Email Address</h4>
        <form onSubmit={handleEmailUpdate}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#333', 
              fontWeight: 'bold' 
            }}>
              New Email Address:
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
            />
          </div>
          
          <button
            type="submit"
            disabled={isUpdating}
            style={{
              background: isUpdating ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: isUpdating ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {isUpdating && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {isUpdating ? 'Updating...' : 'Update Email'}
          </button>
        </form>
        
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: '#d1ecf1', 
          borderRadius: '6px',
          fontSize: '14px',
          color: '#0c5460'
        }}>
          <strong>Note:</strong> Only admin users can update their email address. 
          This change will be reflected immediately across the platform.
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;