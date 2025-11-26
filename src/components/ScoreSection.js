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
          🎯 Your score directly affects your investment earnings<br/>
          💰 New users receive 50 points upon first deposit<br/>
          👥 Earn 3 points when someone registers with your invitation<br/>
          ⚠️ Scores below 50 reduce your earnings percentage
        </p>
        
        {/* Earnings Multiplier Table */}
        <div style={{
          background: 'white',
          border: '2px solid #e1e5e9',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '15px'
        }}>
          <h5 style={{ color: '#333', margin: '0 0 10px 0', textAlign: 'center' }}>📈 Earnings Multiplier Chart</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', fontSize: '12px' }}>
            <div style={{ textAlign: 'center', padding: '8px', background: userScore >= 50 ? '#d4edda' : '#f8f9fa', borderRadius: '4px', border: userScore >= 50 ? '2px solid #28a745' : '1px solid #dee2e6' }}>
              <div style={{ fontWeight: 'bold', color: userScore >= 50 ? '#28a745' : '#333' }}>50+ Points</div>
              <div style={{ color: userScore >= 50 ? '#28a745' : '#666' }}>100% Earnings</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: userScore >= 40 && userScore < 50 ? '#fff3cd' : '#f8f9fa', borderRadius: '4px', border: userScore >= 40 && userScore < 50 ? '2px solid #ffc107' : '1px solid #dee2e6' }}>
              <div style={{ fontWeight: 'bold', color: userScore >= 40 && userScore < 50 ? '#856404' : '#333' }}>40-49 Points</div>
              <div style={{ color: userScore >= 40 && userScore < 50 ? '#856404' : '#666' }}>90% Earnings</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: userScore >= 30 && userScore < 40 ? '#ffeaa7' : '#f8f9fa', borderRadius: '4px', border: userScore >= 30 && userScore < 40 ? '2px solid #fd7e14' : '1px solid #dee2e6' }}>
              <div style={{ fontWeight: 'bold', color: userScore >= 30 && userScore < 40 ? '#8b4513' : '#333' }}>30-39 Points</div>
              <div style={{ color: userScore >= 30 && userScore < 40 ? '#8b4513' : '#666' }}>80% Earnings</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: userScore >= 20 && userScore < 30 ? '#f8d7da' : '#f8f9fa', borderRadius: '4px', border: userScore >= 20 && userScore < 30 ? '2px solid #dc3545' : '1px solid #dee2e6' }}>
              <div style={{ fontWeight: 'bold', color: userScore >= 20 && userScore < 30 ? '#721c24' : '#333' }}>20-29 Points</div>
              <div style={{ color: userScore >= 20 && userScore < 30 ? '#721c24' : '#666' }}>70% Earnings</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: userScore >= 10 && userScore < 20 ? '#f1c0c7' : '#f8f9fa', borderRadius: '4px', border: userScore >= 10 && userScore < 20 ? '2px solid #dc3545' : '1px solid #dee2e6' }}>
              <div style={{ fontWeight: 'bold', color: userScore >= 10 && userScore < 20 ? '#721c24' : '#333' }}>10-19 Points</div>
              <div style={{ color: userScore >= 10 && userScore < 20 ? '#721c24' : '#666' }}>60% Earnings</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: userScore < 10 ? '#d1ecf1' : '#f8f9fa', borderRadius: '4px', border: userScore < 10 ? '2px solid #17a2b8' : '1px solid #dee2e6' }}>
              <div style={{ fontWeight: 'bold', color: userScore < 10 ? '#0c5460' : '#333' }}>0-9 Points</div>
              <div style={{ color: userScore < 10 ? '#0c5460' : '#666' }}>50% Earnings</div>
            </div>
          </div>
          
          {userScore < 50 && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              padding: '10px',
              marginTop: '10px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#856404', fontWeight: 'bold' }}>
                ⚠️ Your current score ({userScore}) reduces your earnings to {userScore >= 40 ? '90%' : userScore >= 30 ? '80%' : userScore >= 20 ? '70%' : userScore >= 10 ? '60%' : '50%'}
              </p>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default ScoreSection;