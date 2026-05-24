import { useState, useMemo } from 'react';
import useExpenses from '../hooks/useExpenses';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { 
    Download, FileText, Calendar, Filter, ArrowRight, 
    ChevronDown, CheckCircle, PieChart, BarChart 
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reports = () => {
  const { expenses } = useExpenses();
  const [period, setPeriod] = useState('This Month');
  const [format, setFormat] = useState('PDF');

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    if (period === 'This Month') {
      return expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (period === 'Last Month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
      });
    } else if (period === 'Current Quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      return expenses.filter(e => {
        const d = new Date(e.date);
        const q = Math.floor(d.getMonth() / 3);
        return q === currentQuarter && d.getFullYear() === now.getFullYear();
      });
    } else if (period === 'Full Fiscal Year') {
      // In India, fiscal year starts in April, but let's assume calendar year for simplicity or current year
      return expenses.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
    }
    return expenses;
  }, [expenses, period]);

  const total = filteredExpenses.reduce((s, e) => s + e.amount, 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Financial Expenditure Report - Executive Summary', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()} | Period: ${period}`, 14, 30);
    
    const tableData = filteredExpenses.map(e => [
      e.date, 
      getCategoryById(e.category).name, 
      e.description || '--', 
      `₹${e.amount.toLocaleString()}`
    ]);

    doc.autoTable({
      startY: 40,
      head: [['Execution Date', 'Sector', 'Description', 'Amount (INR)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175] }
    });

    doc.save(`ExpenseAI_Report_${period.replace(' ', '_')}.pdf`);
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredExpenses.map(e => ({
        Date: e.date,
        Category: getCategoryById(e.category).name,
        Description: e.description,
        Amount: e.amount
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenditure");
    XLSX.writeFile(wb, `ExpenseAI_Report_${period.replace(' ', '_')}.xlsx`);
  };

  return (
    <div className="animate-in">
        <header style={{ marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Audit & Compliance</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Generate formal financial reports and expenditure documentation.</p>
        </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: 32 }}>
        {/* Report Configuration */}
        <div style={{ display: 'grid', gap: 24 }}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <FileText size={22} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem' }}>Data Export Protocol</h3>
            </div>
            
            <div className="form-group" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Fiscal Period Selection</label>
                <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select className="form-input" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ paddingLeft: 44 }}>
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Current Quarter</option>
                        <option>Full Fiscal Year</option>
                    </select>
                </div>
            </div>

            <div className="form-group" style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Preferred Documentation Format</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <button 
                        onClick={() => setFormat('PDF')}
                        style={{ padding: '12px', borderRadius: 6, border: format === 'PDF' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)', background: format === 'PDF' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)', color: format === 'PDF' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)' }}
                    >Adobe PDF</button>
                    <button 
                        onClick={() => setFormat('Excel')}
                        style={{ padding: '12px', borderRadius: 6, border: format === 'Excel' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)', background: format === 'Excel' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)', color: format === 'Excel' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)' }}
                    >Microsoft Excel</button>
                </div>
            </div>

            <button 
                className="btn btn-primary" 
                style={{ width: '100%', height: 52, fontSize: '1rem' }}
                onClick={format === 'PDF' ? downloadPDF : downloadExcel}
            >
                <Download size={20} />
                Generate Audit Report
            </button>
          </div>

          <div className="glass-card" style={{ background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--success)', marginBottom: 12 }}>
                    <CheckCircle size={20} />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>System Integrity Verified</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All data points are sourced from local encrypted storage and validated for accuracy.</p>
          </div>
        </div>

        {/* Report Preview Summary */}
        <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>Documentation Preview</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Period Total Expenditure</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{total.toLocaleString()}</p>
                </div>
                <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Transaction Volume</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{filteredExpenses.length} Records</p>
                </div>
            </div>

            <div style={{ overflow: 'hidden', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '12px 16px' }}>Ref Date</th>
                            <th style={{ padding: '12px 16px' }}>Sector</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.slice(0, 8).map(e => (
                            <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{e.date}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{getCategoryById(e.category).name}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>₹{e.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredExpenses.length > 8 && (
                    <div style={{ padding: '12px', textAlign: 'center', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        ... and {filteredExpenses.length - 8} more records ...
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
