import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { toast } from 'react-toastify';

const InvitationModal = ({ isOpen, onClose, invitationCode }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [signupUrl, setSignupUrl] = useState('');

  useEffect(() => {
    if (invitationCode) {
      const url = `${window.location.origin}/signup?code=${invitationCode}`;
      setSignupUrl(url);
      QRCode.toDataURL(url)
        .then(qrUrl => setQrCodeUrl(qrUrl))
        .catch(err => console.error(err));
    }
  }, [invitationCode]);

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

        <h3 style={{ color: '#333', marginBottom: '20px' }}>Invitation Generated!</h3>

        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          alignItems: 'stretch'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Invitation Code:</p>
              <p style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#667eea',
                fontFamily: 'monospace',
                margin: '0 0 15px 0'
              }}>
                {invitationCode}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(invitationCode, 'Invitation code copied!')}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%'
              }}
            >
              Copy Code
            </button>
          </div>

          {qrCodeUrl && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>QR Code:</p>
              <img src={qrCodeUrl} alt="QR Code" style={{ width: '120px', height: '120px' }} />
            </div>
          )}
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Signup URL:</p>
          <p style={{
            fontSize: '12px',
            color: '#333',
            fontFamily: 'monospace',
            margin: '0 0 15px 0',
            wordBreak: 'break-all',
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #e1e5e9'
          }}>
            {signupUrl}
          </p>
          <button
            onClick={() => copyToClipboard(signupUrl, 'Signup URL copied!')}
            style={{
              background: '#667EEA',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Copy URL
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default InvitationModal;