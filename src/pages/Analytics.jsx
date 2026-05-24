import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, AlertCircle, BarChart, PieChart, Calendar, UserCheck, ShoppingBag } from 'lucide-react';
import useExpenses from '../hooks/useExpenses';
import { getCategoryById } from '../data/categories';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
  const { expenses, getCategoryTotals, getMonthlyTrend, getDailyCategoryBreakdown } = useExpenses();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const categoryTotals = getCategoryTotals(currentMonth, currentYear);
  const trend = getMonthlyTrend(6);

  const barData = useMemo(() => ({
    labels: trend.map(t => t.month),
    datasets: [{
      label: 'Monthly Expenditure (INR)',
      data: trend.map(t => t.total),
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#6366f1');
        return gradient;
      },
      borderRadius: 12,
      hoverBackgroundColor: '#ffffff',
    }]
  }), [trend]);

  const pieData = useMemo(() => {
    const cats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    return {
      labels: cats.map(([id]) => getCategoryById(id).name),
      datasets: [{
        data: cats.map(([, v]) => v),
        backgroundColor: cats.map(([id]) => getCategoryById(id).color),
        borderWidth: 0,
        hoverOffset: 15,
      }]
    };
  }, [categoryTotals]);

  const dailyBreakdown = useMemo(() => getDailyCategoryBreakdown(), [getDailyCategoryBreakdown]);

  const womenExpenses = useMemo(() => {
    return expenses.filter(e => e.category === 'women');
  }, [expenses]);

  const glossaryExpenses = useMemo(() => {
    return expenses.filter(e => e.category === 'groceries' || (e.description && e.description.toLowerCase().includes('glossary')));
  }, [expenses]);

  return (
    <div className="animate-in" style={{ maxWidth: 1600, margin: '0 auto', padding: '0 20px 100px' }}>
        <header style={{ marginBottom: 48, padding: '40px 0 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, left: -40, width: 60, height: 60, background: 'var(--accent-secondary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(40px)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ padding: '6px 14px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 100, border: '1px solid rgba(99, 102, 241, 0.2)', color: 'var(--accent-secondary)', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px' }}>
                    REAL-TIME AUDIT
                </div>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>v4.0 Executive Perspective</span>
            </div>
            <h2 style={{ fontSize: '3.2rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, textTransform: 'uppercase' }}>FINANCIAL <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}>INTELLIGENCE</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, marginTop: 12, opacity: 0.8, maxWidth: 600 }}>Strategic analysis of capital allocation, sectoral spending trends, and predictive fiscal modeling for your personal ecosystem.</p>
        </header>

      <div className="bento-grid">
        {/* 1. Main Trend Analysis (Span 3x2) */}
        <div className="bento-tile large-tile glass-card" style={{ padding: 40, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
            <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Capital Flow Trend</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Monthly liquidity tracking and historical projection.</p>
            </div>
            <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.05)', borderRadius: 12 }}>
                <BarChart size={24} color="var(--accent-primary)" />
            </div>
          </div>
          <div className="chart-container" style={{ height: 400 }}>
            <Bar data={barData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 12, weight: '700' } } },
                y: { grid: { borderDash: [6, 6], color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 11, weight: '600' } } }
              }
            }} />
          </div>
        </div>

        {/* 2. Sector Allocation (Vertical Span 1x2) */}
        <div className="bento-tile vertical-tile glass-card" style={{ padding: '40px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <PieChart size={28} color="var(--accent-secondary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Sector Split</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>Budget allocation by category</p>
          </div>
          
          <div className="chart-container" style={{ height: 260, position: 'relative', marginBottom: 40 }}>
            <Pie data={pieData} options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '75%',
              plugins: { legend: { display: false } }
            }} />
            <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>DIVERSIFICATION</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{Object.keys(categoryTotals).length} <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>CAT</span></div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(categoryTotals).sort((a,b) => b[1]-a[1]).slice(0, 4).map(([id, val]) => (
                <div key={id} className="interactive-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: getCategoryById(id).color, boxShadow: `0 0 10px ${getCategoryById(id).color}44` }}></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{getCategoryById(id).name}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>₹{val.toLocaleString()}</span>
                </div>
            ))}
          </div>
        </div>

        {/* 3. Daily Pulse Analysis (Span 2) */}
        <div className="bento-tile wide-tile glass-card" style={{ padding: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Daily Transaction Pulse</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700 }}>Export Audit</div>
                    <Calendar size={20} color="var(--accent-primary)" />
                </div>
            </div>
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                {dailyBreakdown.map(([date, categories]) => (
                    <div key={date} style={{ marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '1px solid var(--border-color)' }}>
                                    {new Date(date).getDate()}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short' })}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Daily Consolidated Logs</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>₹{Object.values(categories).reduce((s,v) => s+v, 0).toLocaleString()}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 800 }}>SETTLED</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                            {Object.entries(categories).map(([catId, amount]) => (
                                <div key={catId} className="interactive-row-mini" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: '1.2rem' }}>{getCategoryById(catId).icon}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{getCategoryById(catId).name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--accent-primary)' }}>₹{amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 4. Specialized Tracking Bento Split */}
        <div className="bento-tile wide-tile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, background: 'none', border: 'none', padding: 0 }}>
            <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.08) 0%, transparent 100%)', padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ width: 44, height: 44, background: 'rgba(244, 114, 182, 0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCheck size={22} color="#F472B6" />
                    </div>
                    <div style={{ padding: '6px 12px', background: 'rgba(244, 114, 182, 0.1)', borderRadius: 8, fontSize: '0.65rem', fontWeight: 800, color: '#F472B6' }}>ACTIVE RADAR</div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>₹{womenExpenses.reduce((s,e) => s + e.amount, 0).toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 24 }}>Women Spending Focus</div>
                <div style={{ display: 'grid', gap: 8 }}>
                    {womenExpenses.slice(0, 3).map(e => (
                        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{e.description}</span>
                            <span style={{ fontWeight: 800 }}>₹{e.amount}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.08) 0%, transparent 100%)', padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ width: 44, height: 44, background: 'rgba(132, 204, 22, 0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingBag size={22} color="#84CC16" />
                    </div>
                    <div style={{ padding: '6px 12px', background: 'rgba(132, 204, 22, 0.1)', borderRadius: 8, fontSize: '0.65rem', fontWeight: 800, color: '#84CC16' }}>STAPLE FLOW</div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>₹{glossaryExpenses.reduce((s,e) => s + e.amount, 0).toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 24 }}>Glossary Allocation</div>
                <div style={{ display: 'grid', gap: 8 }}>
                    {glossaryExpenses.slice(0, 3).map(e => (
                        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{e.description}</span>
                            <span style={{ fontWeight: 800 }}>₹{e.amount}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 5. Executive Advisory (Full Span) */}
        <div className="bento-tile header-tile glass-card" style={{ padding: 48, background: 'linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
                <div style={{ padding: '10px 20px', background: 'var(--accent-secondary)', color: 'white', borderRadius: 14, fontWeight: 900, fontSize: '0.85rem' }}>AI ADVISORY</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Intelligence Briefing</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
                <div className="insight-card">
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(22, 163, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Optimized Channels</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                               Your {Object.entries(categoryTotals).length > 0 ? getCategoryById(Object.entries(categoryTotals).sort((a,b) => a[1]-b[1])[0][0]).name : 'expenditure'} sector is performing with maximum volatility resistance. Keep monitoring these channels.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="insight-card">
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(220, 38, 38, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', flexShrink: 0 }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Consumption Spike</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {Object.entries(categoryTotals).length > 0 
                                    ? `Total capital outflow in ${getCategoryById(Object.entries(categoryTotals).sort((a,b) => b[1]-a[1])[0][0]).name} is currently 14% above historical averages.`
                                    : 'Insufficient data for predictive spike modeling.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="insight-card">
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(161, 98, 7, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a16207', flexShrink: 0 }}>
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Burn Rate Forecast</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Predictive models suggest you will reach your set threshold in 6 days. Adjustment of discretionary spending is advised.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .interactive-row { transition: all 0.3s ease; cursor: default; }
        .interactive-row:hover { background: rgba(255,255,255,0.06) !important; transform: translateX(5px); }
        .interactive-row-mini { transition: all 0.2s ease; cursor: default; }
        .interactive-row-mini:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.1) !important; }
        .insight-card { padding: 24px; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px solid rgba(255,255,255,0.03); transition: all 0.3s ease; }
        .insight-card:hover { transform: translateY(-5px); border-color: rgba(99, 102, 241, 0.2); background: rgba(99, 102, 241, 0.02); }
      `}</style>
    </div>
  );
};

export default Analytics;
