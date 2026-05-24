import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpensesProvider } from './context/ExpensesContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import ChatAssistant from './pages/ChatAssistant';
import ReceiptScanner from './pages/ReceiptScanner';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import VoiceFAB from './components/VoiceInput';
import useAudioReminder from './hooks/useAudioReminder';
import useExpenses from './hooks/useExpenses';
import {
  LayoutDashboard, Receipt, BarChart3, MessageCircle, Menu, X, Settings
} from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Authenticating Access...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const { showNotification } = useNotification();
  const { expenses, addExpense } = useExpenses();
  const { checkAndNotify, checkHourly } = useAudioReminder();

  useEffect(() => {
    const interval = setInterval(() => {
      const lastExp = expenses.length > 0 ? expenses[0].date : ''; 
      if (checkHourly()) {
        showNotification('Hourly Financial Awareness Update', {
          actionLabel: 'Check Ledger',
          onAction: () => navigate('/expenses')
        });
      } else if (checkAndNotify(lastExp)) {
        showNotification('Daily Financial Record Pending', {
          actionLabel: 'Log Now',
          onAction: () => navigate('/expenses')
        });
      }
    }, 60000); 
    return () => clearInterval(interval);
  }, [expenses, checkAndNotify, checkHourly, showNotification, navigate]);

  return (
    <div className="app-layout">
      {/* Sidebar - Desktop Only */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <button className="sidebar-close-btn mobile-only" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        )}
      </aside>

      {/* Main Perspective Area */}
      <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <header className="desktop-header">
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Expense<span style={{ color: 'var(--accent-primary)' }}>AI</span></h1>
          </div>
          <button 
            className="btn btn-secondary mobile-hide" 
            style={{ padding: '8px' }} 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/chat" element={<ChatAssistant />} />
          <Route path="/scanner" element={<ReceiptScanner />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

        {/* Global Voice Input - Floating on Desktop */}
        <div className="mobile-hide">
          <VoiceFAB onAdd={(exp) => addExpense({ ...exp, source: 'voice' })} />
        </div>
      </main>

      {/* Mobile Bottom Navigation - Premium App Style */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <BarChart3 size={20} />
          <span>Graph</span>
        </NavLink>
        
        {/* CENTER ACTION: VOICE FAB INTEGRATED */}
        <div className="mobile-center-action">
           <VoiceFAB className="static-mobile" onAdd={(exp) => addExpense({ ...exp, source: 'voice' })} />
        </div>

        <NavLink to="/chat" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <MessageCircle size={20} />
          <span>AI Chat</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Menu</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExpensesProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
            </Routes>
          </NotificationProvider>
        </ExpensesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
