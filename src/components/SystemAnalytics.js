import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import '../styles/responsive.css';

const SystemAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  const fetchAnalytics = async (selectedPeriod = period) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/admin/analytics?period=${selectedPeriod}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchAnalytics(newPeriod);
  };

  useEffect(() => {
    fetchAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SimpleChart = ({ data, title, color, valueKey = 'count', prefix = '' }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d[valueKey] || 0));
    
    return (
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h4 style={{ color: '#333', marginBottom: '15px' }}>{title}</h4>
        <div style={{ display: 'flex', alignItems: 'end', gap: '4px', height: '200px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  background: color,
                  width: '100%',
                  height: `${((item[valueKey] || 0) / maxValue) * 150}px`,
                  minHeight: '2px',
                  borderRadius: '2px 2px 0 0',
                  marginBottom: '5px'
                }}
              />
              <div style={{ fontSize: '10px', color: '#666', textAlign: 'center' }}>
                {item._id.split('-')[2]}/{item._id.split('-')[1]}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#333' }}>
                {prefix}{(item[valueKey] || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div>
      <div className="analytics-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h3 style={{ color: '#333', margin: 0 }}>System Analytics</h3>
        <div className="analytics-period-buttons" style={{ display: 'flex', gap: '10px' }}>
          {['7', '14', '30', '90'].map(days => (
            <button
              key={days}
              onClick={() => handlePeriodChange(days)}
              style={{
                background: period === days ? '#667eea' : '#f8f9fa',
                color: period === days ? 'white' : '#666',
                border: '1px solid #dee2e6',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-responsive" style={{ marginBottom: '30px' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Total Users</h4>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{analytics.summary.totalUsers.toLocaleString()}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>💰 Investment Volume</h4>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>${analytics.summary.totalInvestments.toLocaleString()}</p>
          <p style={{ fontSize: '12px', margin: '5px 0 0 0', opacity: 0.9 }}>Total amount invested by users</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)', padding: '20px', borderRadius: '15px', color: 'white', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>💳 USDC Deposits</h4>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>${analytics.summary.totalDeposits.toLocaleString()}</p>
          <p style={{ fontSize: '12px', margin: '5px 0 0 0', opacity: 0.9 }}>Total USDC deposited to platform</p>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        <SimpleChart 
          data={analytics.userGrowth} 
          title={`📈 New User Registrations (Last ${period} Days)`}
          color="#667eea"
          valueKey="count"
        />
        
        <SimpleChart 
          data={analytics.investmentTrends} 
          title={`💰 Total Investment Amount (Last ${period} Days)`}
          color="#28a745"
          valueKey="totalAmount"
          prefix="$"
        />
        
        <SimpleChart 
          data={analytics.depositTrends} 
          title={`💳 USDC Deposits Received (Last ${period} Days)`}
          color="#17a2b8"
          valueKey="totalAmount"
          prefix="$"
        />
        
        <SimpleChart 
          data={analytics.investmentTrends} 
          title={`🎯 Number of Investments Made (Last ${period} Days)`}
          color="#ffc107"
          valueKey="count"
        />
      </div>

      {/* Data Tables */}
      <div style={{ marginTop: '30px' }}>
        <h4 style={{ color: '#333', marginBottom: '15px' }}>Recent Trends Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* User Growth Table */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
            <h5 style={{ color: '#333', marginBottom: '15px' }}>Recent User Registrations</h5>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {analytics.userGrowth.slice(-7).map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#666' }}>{new Date(item._id).toLocaleDateString()}</span>
                  <span style={{ fontWeight: 'bold', color: '#667eea' }}>{item.count} users</span>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Trends Table */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
            <h5 style={{ color: '#333', marginBottom: '15px' }}>Recent Investment Volume</h5>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {analytics.investmentTrends.slice(-7).map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#666' }}>{new Date(item._id).toLocaleDateString()}</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>${item.totalAmount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;