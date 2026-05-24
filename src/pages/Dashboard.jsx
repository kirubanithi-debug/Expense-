import { useNavigate } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { TrendingUp, Wallet, Target, ArrowUpRight, Plus, Activity, CreditCard, PieChart, ShieldCheck } from 'lucide-react';
import useExpenses from '../hooks/useExpenses';
import { useAuth } from '../context/AuthContext';
import { getCategoryById } from '../data/categories';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const Dashboard = () => {
  const navigate = useNavigate();
  const { expenses, getMonthlyTotal } = useExpenses();
  const { user } = useAuth();
  
  const now = new Date();
  const thisMonthTotal = getMonthlyTotal(now.getMonth(), now.getFullYear());
  const budget = user?.budget || 30000;
  const budgetPercent = Math.round((thisMonthTotal / budget) * 100) || 0;

  const categoryTotals = expenses.reduce((acc, exp) => {
    if (new Date(exp.date).getMonth() === now.getMonth()) {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    }
    return acc;
  }, {});

  const recentExpenses = expenses.slice(0, 5);

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [65, 59, 80, 81, 56, 55],
      fill: true,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  };

  const doughnutData = {
    labels: Object.keys(categoryTotals).map(k => getCategoryById(k)?.name || k),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: Object.keys(categoryTotals).map(k => getCategoryById(k)?.color || '#ccc'),
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  return (
    <div className="animate-in" style={{ maxWidth: 1600, margin: '0 auto', paddingBottom: 40 }}>
      {/* 1. Header Area */}
      <div className="bento-tile header-tile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Welcome back, {user?.name || 'Executive'}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>System status normal. Your financial portfolio is looking healthy.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => navigate('/expenses?autoAdd=true')}>
            <Plus size={20} /> Deploy Transaction
          </button>
        </div>
      </div>

      {/* 2. Main Trajectory (Span 3x2) */}
      <div className="bento-tile large-tile">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.25rem' }}>
            <Activity size={20} color="var(--accent-primary)" /> Financial Trajectory
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>6 Month Audit</span>
        </div>
        <div style={{ height: '100%', minHeight: 280 }}>
          <Line data={lineData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: 'var(--text-muted)', font: { size: 12, weight: '600' } } },
              y: { display: false }
            }
          }} />
        </div>
      </div>

      {/* 3. Daily Pulse */}
      <div className="bento-tile small-tile" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
        <span className="stat-label">Daily Average</span>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, margin: '8px 0', color: 'var(--success)' }}>₹{Math.round(thisMonthTotal / now.getDate()).toLocaleString()}</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Burn rate normalized</p>
      </div>

      {/* 4. Portfolio Health */}
      <div className="bento-tile small-tile">
        <span className="stat-label">System Security</span>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, margin: '8px 0', color: 'var(--success)' }}>
          <ShieldCheck size={40} />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>End-to-end Encryption</p>
      </div>

      {/* 5. Category Matrix (Vertical Span 1x2) */}
      <div className="bento-tile vertical-tile">
        <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <PieChart size={20} color="var(--accent-secondary)" /> Sector Split
        </h3>
        <div style={{ height: 200, position: 'relative', marginBottom: 24 }}>
          <Doughnut data={doughnutData} options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: { legend: { display: false } }
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(categoryTotals).slice(0, 4).map(([id, val]) => (
            <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{getCategoryById(id).name.slice(0, 10)}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{Math.round((val/thisMonthTotal)*100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Budget Gauge (Wide Span 2) */}
      <div className="bento-tile wide-tile">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wallet size={20} color="var(--accent-primary)" /> Monthly Allocation
          </h3>
          <span style={{ fontWeight: 800 }}>{budgetPercent}%</span>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 16 }}>₹{thisMonthTotal.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ ₹{budget.toLocaleString()}</span></div>
        <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ 
            width: `${budgetPercent}%`, 
            height: '100%', 
            background: 'var(--accent-primary)', 
            boxShadow: '0 0 15px var(--accent-glow)'
          }}></div>
        </div>
      </div>

      {/* 7. Recent Protocol entries */}
      <div className="bento-tile large-tile">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CreditCard size={20} color="var(--accent-secondary)" /> Activity Ledger
          </h3>
          <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => navigate('/expenses')}>Access Full Logs</button>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {recentExpenses.map(exp => (
            <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: '1.2rem' }}>{getCategoryById(exp.category).icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{exp.description || 'System Entry'}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {new Date(exp.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {exp.time}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 900, color: 'white' }}>₹{exp.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 100 }} className="mobile-only" />
    </div>
  );
};

export default Dashboard;

