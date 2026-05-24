import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationToast = ({ show, onClose, onAction, message, type, actionLabel }) => {
  if (!show) return null;

  const getIcon = () => {
    switch(type) {
      case 'success': return <CheckCircle size={20} color="var(--success)" />;
      case 'error': return <AlertTriangle size={20} color="var(--error)" />;
      default: return <Info size={20} color="var(--accent-primary)" />;
    }
  };

  return (
    <div className="notification-toast" style={{
      position: 'fixed',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: 420,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 24,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      zIndex: 10001,
      animation: 'toast-slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.03)', 
        width: 44, height: 44, 
        borderRadius: '50%', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', lineHeight: 1.4 }}>
          {message}
        </p>
        {onAction && (
          <button 
            onClick={onAction}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent-primary)', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              padding: '4px 0', 
              marginTop: 4,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {actionLabel || 'View Details'} →
          </button>
        )}
      </div>

      <button 
        onClick={onClose}
        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, borderRadius: '50%' }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes toast-slide-down {
          from { transform: translate(-50%, -40px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
