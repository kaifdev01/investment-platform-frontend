import React from 'react';

const ScoreSection = ({ dashboardData }) => {

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
          🏆 Higher scores may unlock future benefits and rewards
        </p>
      </div>


    </div>
  );
};

export default ScoreSection;