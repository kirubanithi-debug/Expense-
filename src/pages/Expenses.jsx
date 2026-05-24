import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useExpenses from '../hooks/useExpenses';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { 
  Search, Filter, Plus, Trash2, Edit2, ChevronLeft, 
  ChevronRight, Calendar, Tag, CreditCard, ArrowRight, Download, X, Receipt
} from 'lucide-react';

const Expenses = () => {
  const { expenses, addExpense, deleteExpense, updateExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
    if (location.search) {
      navigate('/expenses', { replace: true });
    }
  };

  const [formData, setFormData] = useState({
    amount: '', category: 'food', description: '', date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const autoAddCat = params.get('autoAdd');
    const autoAddDate = params.get('date');

    if (autoAddCat) {
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          category: autoAddCat === 'true' ? 'food' : autoAddCat,
          date: autoAddDate || new Date().toISOString().split('T')[0]
        }));
        setShowModal(true);
      }, 0);
    }
  }, [location.search]);

  const months = useMemo(() => {
    const m = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        m.push({
            value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
            label: d.toLocaleDateString('default', { month: 'long', year: 'numeric' })
        });
    }
    return m;
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchSearch = (exp.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getCategoryById(exp.category).name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === 'all' || exp.category === filterCategory;
      const matchMonth = filterMonth === 'all' || exp.date.startsWith(filterMonth);
      return matchSearch && matchCategory && matchMonth;
    });
  }, [expenses, searchTerm, filterCategory, filterMonth]);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormData({ amount: '', category: 'food', description: '', date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, amount: parseFloat(formData.amount) };
    if (editingExpense) updateExpense(editingExpense.id, data);
    else addExpense(data);
    handleCloseModal();
  };

  return (
    <div className="animate-in">
      <header style={{ marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Account Ledger</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Full transaction history and categorical analysis.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" style={{ padding: '8px 12px' }}><Download size={16} /> Export</button>
          <button className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={handleOpenAdd}><Plus size={16} /> Add</button>
        </div>
      </header>

      {/* Filter Bar - Classic Design */}
      <div className="glass-card" style={{ marginBottom: 32, padding: '24px', background: 'var(--bg-tertiary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 1fr 1fr', gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="form-input" placeholder="Search references..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: 44, borderColor: 'var(--border-color)' }} />
          </div>
          <select className="form-input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ borderColor: 'var(--border-color)' }}>
            <option value="all">All Sectors</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="form-input" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ borderColor: 'var(--border-color)' }}>
            <option value="all">Full History</option>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: 32, padding: '12px 20px', display: 'flex', gap: 12, overflowX: 'auto', border: '1px solid var(--border-color)' }}>
        {['all', ...CATEGORIES.map(c => c.id)].map(catId => {
          const cat = catId === 'all' ? { name: 'All' } : getCategoryById(catId);
          return (
            <button 
              key={catId}
              onClick={() => setFilterCategory(catId)}
              style={{ 
                padding: '8px 16px', 
                borderRadius: 20, 
                border: '1px solid var(--border-color)',
                background: filterCategory === catId ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
                color: filterCategory === catId ? 'white' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* History Timeline */}
      <div style={{ display: 'grid', gap: 16 }}>
        {filteredExpenses.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Receipt size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
            <p>No transactions found in this sector.</p>
          </div>
        ) : (
          filteredExpenses.map(exp => {
            const cat = getCategoryById(exp.category);
            return (
              <div key={exp.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{cat.name}</h4>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>₹{exp.amount.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description || 'No description provided'}</p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {new Date(exp.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} • {exp.time}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setEditingExpense(exp); setFormData({ ...exp, amount: exp.amount.toString() }); setShowModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                  <button onClick={() => deleteExpense(exp.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', opacity: 0.6, cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal - Classic Professional */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal animate-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div style={{ padding: '24px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{editingExpense ? 'Modify Ledger Entry' : 'Manual History Recording'}</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '32px', display: 'grid', gap: 24 }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Transaction Amount (₹)</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="number" step="0.01" className="form-input" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} style={{ paddingLeft: 44, fontSize: '1.25rem', fontWeight: 800 }} />
                </div>
              </div>
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Sector / Cat</label>
                  <select className="form-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Date</label>
                  <input type="date" className="form-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Reference Details</label>
                <input type="text" className="form-input" placeholder="e.g. Quarterly Utility Payment" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Commit Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
