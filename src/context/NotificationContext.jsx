import { createContext, useContext, useState, useCallback } from 'react';
import NotificationToast from '../components/NotificationToast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'info', // 'info', 'success', 'error', 'warning'
    actionLabel: '',
    onAction: null
  });

  const showNotification = useCallback((message, options = {}) => {
    setNotification({
      show: true,
      message,
      type: options.type || 'info',
      actionLabel: options.actionLabel || '',
      onAction: options.onAction || null
    });

    // Auto-hide after 5 seconds unless it's an error or has an action
    if (!options.onAction && options.type !== 'error') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <NotificationToast 
        show={notification.show}
        message={notification.message}
        type={notification.type}
        actionLabel={notification.actionLabel}
        onClose={hideNotification}
        onAction={notification.onAction}
      />
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
