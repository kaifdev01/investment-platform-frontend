import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/api';

const AdminRegisterUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    withdrawalPassword: '',
    invitationCode: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin-register`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('User registered successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        withdrawalPassword: '',
        invitationCode: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Register User Under Investor</h3>
      
      <form onSubmit={handleSubmit} style={{
        background: '#f8f9fa',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px'
      }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />

          <input
            type="text"
            name="invitationCode"
            placeholder="Referrer's Invitation Code"
            value={formData.invitationCode}
            onChange={handleChange}
            required
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Login Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />

          <input
            type="password"
            name="withdrawalPassword"
            placeholder="Withdrawal Password"
            value={formData.withdrawalPassword}
            onChange={handleChange}
            required
            style={{
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '15px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Registering...' : 'Register User'}
          </button>
        </div>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e8f5e8',
        borderRadius: '10px',
        fontSize: '14px',
        color: '#155724'
      }}>
        <strong>Note:</strong> This will register a new user under the specified investor's referral code.
        The referrer will receive 3 points for the registration.
      </div>
    </div>
  );
};

export default AdminRegisterUser;
