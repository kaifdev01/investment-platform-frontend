import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';

const ScoreSection = ({ dashboardData }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/leaderboard?limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const userScore = dashboardData?.accountSummary?.score || 0;

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Activity Score</h3>
      
      {/* User Score Card */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '25px',
        borderRadius: '15px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '48px', fontWeight: 'bold' }}>
          {userScore}
        </h2>
        <p style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Your Activity Score</p>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          <p style={{ margin: '5px 0' }}>🏆 Earn points for platform activities</p>
          <p style={{ margin: '5px 0' }}>📈 Higher scores unlock future benefits</p>
        </div>
      </div>

      {/* Score Info */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h4 style={{ color: '#333', margin: '0 0 10px 0' }}>Activity Score System</h4>
        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
          🎯 Your score reflects your platform activity and engagement<br/>
          💰 New users receive 50 points upon their first deposit<br/>
          📊 Additional score changes are managed by administrators<br/>
          🏆 Higher scores may unlock future benefits and rewards
        </p>
      </div>

      {/* Leaderboard */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid #e1e5e9'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ color: '#333', margin: 0 }}>🏆 Top Performers</h4>
          <button
            onClick={fetchLeaderboard}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            Loading leaderboard...
          </div>
        ) : leaderboard.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {leaderboard.map((user, index) => (
              <div
                key={user._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: index < 3 ? 
                    (index === 0 ? '#fff3cd' : index === 1 ? '#f8f9fa' : '#e8f5e8') : 
                    '#f8f9fa',
                  borderRadius: '8px',
                  border: index < 3 ? '2px solid' : '1px solid #dee2e6',
                  borderColor: index === 0 ? '#ffc107' : index === 1 ? '#6c757d' : index === 2 ? '#28a745' : '#dee2e6'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: index === 0 ? '#ffc107' : index === 1 ? '#6c757d' : index === 2 ? '#28a745' : '#667eea',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#333' }}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      {user.email}
                    </p>
                  </div>
                </div>
                <div style={{
                  background: index < 3 ? 'rgba(255,255,255,0.8)' : '#667eea',
                  color: index < 3 ? '#333' : 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {user.score} pts
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No leaderboard data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreSection;