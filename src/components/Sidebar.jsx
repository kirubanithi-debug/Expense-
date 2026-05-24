import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Receipt, BarChart3, MessageCircle, Camera,
  FileText, Trophy, Settings, LogOut, ChevronRight
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/expenses', icon: <Receipt size={18} />, label: 'History' },
    { to: '/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
    { to: '/chat', icon: <MessageCircle size={18} />, label: 'AI Chat' },
    { to: '/scanner', icon: <Camera size={18} />, label: 'Receipt Scanner' },
    { to: '/reports', icon: <FileText size={18} />, label: 'Reports' },
    { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
  ];

  return (
    <>
      <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ 
            width: 44, height: 44, background: 'var(--accent-primary)', 
            borderRadius: 8, display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '1.4rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            💰
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', color: 'white', fontWeight: 800, letterSpacing: '-0.5px' }}>ExpenseAI</h1>
            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Executive Edition</p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
            end={item.to === '/'}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            <ChevronRight size={14} className="chevron" style={{ opacity: 0.3 }} />
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '24px', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ 
            width: 38, height: 38, borderRadius: '6px', background: 'rgba(255,255,255,0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', color: 'white', fontWeight: 700,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</h4>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          style={{ 
            width: '100%', padding: '10px', borderRadius: '6px', 
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
          }}
        >
          <LogOut size={16} />
          <span>Logout Session</span>
        </button>
      </div>

      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
          border-left: 3px solid transparent;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.03);
          color: white;
        }
        .nav-link.active {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-primary);
          border-left-color: var(--accent-primary);
          font-weight: 600;
        }
        .nav-link .chevron { transition: var(--transition); }
        .nav-link.active .chevron { opacity: 0 !important; }
        .nav-link:hover .chevron { transform: translateX(3px); opacity: 0.8 !important; }
      `}</style>
    </>
  );
};

export default Sidebar;
