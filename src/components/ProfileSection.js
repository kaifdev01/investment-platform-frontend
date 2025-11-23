import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';

const ProfileSection = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    currentWithdrawalPassword: '',
    newWithdrawalPassword: '',
    confirmWithdrawalPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    currentWithdrawalPassword: false,
    newWithdrawalPassword: false,
    confirmWithdrawalPassword: false
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (formData.newWithdrawalPassword && formData.newWithdrawalPassword !== formData.confirmWithdrawalPassword) {
      toast.error('New withdrawal passwords do not match');
      return;
    }

    if (formData.newWithdrawalPassword && formData.newWithdrawalPassword.length < 6) {
      toast.error('New withdrawal password must be at least 6 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName
      };

      // Admin can update email
      if (user.isAdmin && formData.email !== user.email) {
        await axios.put(`${API_URL}/user/admin/update-email`, 
          { newEmail: formData.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      if (formData.newWithdrawalPassword) {
        updateData.currentWithdrawalPassword = formData.currentWithdrawalPassword;
        updateData.newWithdrawalPassword = formData.newWithdrawalPassword;
      }

      const response = await axios.put(`${API_URL}/user/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data.user);
      setIsEditing(false);
      setFormData({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: formData.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        currentWithdrawalPassword: '',
        newWithdrawalPassword: '',
        confirmWithdrawalPassword: ''
      });
      
      // Update user object with new email if admin changed it
      if (user.isAdmin && formData.email !== user.email) {
        setUser({ ...response.data.user, email: formData.email });
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };



  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  };

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Profile Information</h3>

      {!isEditing ? (
        <div style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Full Name</p>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{user.firstName} {user.lastName}</p>
          </div>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Email Address</p>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{user.email}</p>
          </div>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Phone Number</p>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{user.phone || 'Not provided'}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              maxWidth: '200px'
            }}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Email {!user.isAdmin && '(Cannot be changed)'}
              {user.isAdmin && <span style={{ color: '#28a745', fontSize: '12px' }}> (Admin can edit)</span>}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!user.isAdmin}
              style={{
                ...inputStyle,
                background: user.isAdmin ? 'white' : '#f5f5f5',
                color: user.isAdmin ? '#333' : '#999'
              }}
            />
          </div>

          <h4 style={{ color: '#333', marginBottom: '15px' }}>Change Password (Optional)</h4>

          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Current Password</label>
            <input
              type={showPassword.currentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('currentPassword')}
              style={{
                position: 'absolute',
                right: '15px',
                top: '35px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#667eea',
                fontWeight: 'bold'
              }}
            >
              {showPassword.currentPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>New Password</label>
            <input
              type={showPassword.newPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('newPassword')}
              style={{
                position: 'absolute',
                right: '15px',
                top: '35px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#667eea',
                fontWeight: 'bold'
              }}
            >
              {showPassword.newPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Confirm New Password</label>
            <input
              type={showPassword.confirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              style={{
                position: 'absolute',
                right: '15px',
                top: '35px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#667eea',
                fontWeight: 'bold'
              }}
            >
              {showPassword.confirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <h4 style={{ color: '#333', marginBottom: '15px', marginTop: '30px' }}>Change Withdrawal Password (Optional)</h4>
          


          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Current Withdrawal Password</label>
            <input
              type={showPassword.currentWithdrawalPassword ? 'text' : 'password'}
              name="currentWithdrawalPassword"
              value={formData.currentWithdrawalPassword}
              onChange={handleChange}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('currentWithdrawalPassword')}
              style={{
                position: 'absolute',
                right: '15px',
                top: '35px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#667eea',
                fontWeight: 'bold'
              }}
            >
              {showPassword.currentWithdrawalPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>New Withdrawal Password</label>
            <input
              type={showPassword.newWithdrawalPassword ? 'text' : 'password'}
              name="newWithdrawalPassword"
              value={formData.newWithdrawalPassword}
              onChange={handleChange}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('newWithdrawalPassword')}
              style={{
                position: 'absolute',
                right: '15px',
                top: '35px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#667eea',
                fontWeight: 'bold'
              }}
            >
              {showPassword.newWithdrawalPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Confirm New Withdrawal Password</label>
            <input
              type={showPassword.confirmWithdrawalPassword ? 'text' : 'password'}
              name="confirmWithdrawalPassword"
              value={formData.confirmWithdrawalPassword}
              onChange={handleChange}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmWithdrawalPassword')}
              style={{
                position: 'absolute',
                right: '15px',
                top: '35px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#667eea',
                fontWeight: 'bold'
              }}
            >
              {showPassword.confirmWithdrawalPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="submit"
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                  currentWithdrawalPassword: '',
                  newWithdrawalPassword: '',
                  confirmWithdrawalPassword: ''
                });
              }}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileSection;