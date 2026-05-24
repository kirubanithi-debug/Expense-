import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ShieldCheck, ArrowRight, LockKeyhole } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication protocol failure');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-secondary)', padding: 20
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Formal Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            width: 72, height: 72, background: 'var(--accent-primary)', 
            borderRadius: 14, display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 20px',
            boxShadow: '0 10px 20px rgba(30, 64, 175, 0.2)'
          }}>💰</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8, color: 'var(--text-primary)' }}>ExpenseAI</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Secure Wealth Management & Analytics Platform</p>
        </div>

        <div className="glass-card" style={{ padding: '48px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--accent-primary)' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', padding: 4, borderRadius: 8 }}>
              <button 
                onClick={() => setIsLogin(true)}
                style={{ padding: '8px 24px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, background: isLogin ? 'white' : 'transparent', color: isLogin ? 'var(--accent-primary)' : 'var(--text-muted)', boxShadow: isLogin ? 'var(--shadow-sm)' : 'none', transition: 'var(--transition)' }}
              >Login</button>
              <button 
                onClick={() => setIsLogin(false)}
                style={{ padding: '8px 24px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, background: !isLogin ? 'white' : 'transparent', color: !isLogin ? 'var(--accent-primary)' : 'var(--text-muted)', boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none', transition: 'var(--transition)' }}
              >Register</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
            {!isLogin && (
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>Full Professional Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text" className="form-input" placeholder="e.g. Alexander Hamilton" required={!isLogin}
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ paddingLeft: 44 }}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>Corporate Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email" className="form-input" placeholder="alex@expenseai.com" required
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>Access Password</label>
              <div style={{ position: 'relative' }}>
                <LockKeyhole size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password" className="form-input" placeholder="••••••••" required
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>

            {error && <div style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center', background: '#fef2f2', padding: 12, borderRadius: 8, border: '1px solid #fecaca' }}>{error}</div>}

            <button type="submit" className="btn btn-primary" style={{ height: 52, fontSize: '1rem', marginTop: 12 }}>
              {isLogin ? 'Sign In Securely' : 'Create Account Portfolio'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Professional Footer */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <div style={{ justifyContent: 'center', gap: 24, padding: '16px', background: 'white', borderRadius: 40, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', display: 'inline-flex' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
              <ShieldCheck size={16} color="var(--success)" /> AES-256 Local Encryption
            </div>
            <div style={{ width: 1, background: 'var(--border-color)' }}></div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>System Version 2.4.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
