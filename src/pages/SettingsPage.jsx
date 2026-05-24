import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, Shield, Wallet, CreditCard, ChevronRight, Save, 
  Moon, Sun, Volume2, Clock, Trash2, HelpCircle, Lock 
} from 'lucide-react';

const SettingsPage = () => {
    const { user, updateBudget, updateSettings } = useAuth();
    const [budget, setBudget] = useState(user?.budget || 30000);
    const [audioEnabled, setAudioEnabled] = useState(user?.settings?.audioEnabled ?? true);
    const [hourlyEnabled, setHourlyEnabled] = useState(user?.settings?.hourlyEnabled ?? true); // Default to true as per user request
    const [reminderTime, setReminderTime] = useState(user?.settings?.reminderTime || '20:00');

    const handleSave = () => {
        updateBudget(Number(budget));
        updateSettings({ audioEnabled, hourlyEnabled, reminderTime });
        alert('Portfolio configuration updated successfully.');
    };

    return (
        <div className="animate-in">
            <header style={{ marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Account Configuration</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Security preferences and fiscal policy settings.</p>
            </header>

            <div className="mobile-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32 }}>
                <div style={{ display: 'grid', gap: 24 }}>
                    {/* Fiscal Policy */}
                    <div className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <Wallet size={20} color="var(--accent-primary)" />
                            <h3 style={{ fontSize: '1rem' }}>Fiscal Policy</h3>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Target Monthly Budget (INR)</label>
                            <input 
                                type="number" className="form-input" value={budget} 
                                onChange={(e) => setBudget(e.target.value)} 
                                style={{ fontSize: '1.25rem', fontWeight: 800 }}
                            />
                        </div>
                        <p style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>This value defines your ceiling for automated spending alerts and analytics.</p>
                    </div>

                    {/* Notification Protocol */}
                    <div className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <Bell size={20} color="var(--accent-primary)" />
                            <h3 style={{ fontSize: '1rem' }}>Notification Protocol</h3>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div>
                                <h4 style={{ fontSize: '0.9rem' }}>Audio Reminders</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Play chime for reporting updates.</p>
                            </div>
                            <label className="switch">
                                <input 
                                    type="checkbox" checked={audioEnabled} 
                                    onChange={(e) => setAudioEnabled(e.target.checked)} 
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <h4 style={{ fontSize: '0.9rem' }}>Hourly Protocol</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trigger audit chime every hour.</p>
                            </div>
                            <label className="switch">
                                <input 
                                    type="checkbox" checked={hourlyEnabled} 
                                    onChange={(e) => setHourlyEnabled(e.target.checked)} 
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Report Threshold Time</label>
                            <div style={{ position: 'relative' }}>
                                <Clock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="time" className="form-input" value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    style={{ paddingLeft: 44, fontWeight: 700 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    {/* Security & Access */}
                    <div className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <Shield size={20} color="var(--accent-primary)" />
                            <h3 style={{ fontSize: '1rem' }}>Security & Access</h3>
                        </div>
                        <div style={{ display: 'grid', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 8, cursor: 'pointer' }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <Lock size={18} color="var(--text-secondary)" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Change Security Credentials</span>
                                </div>
                                <ChevronRight size={18} color="var(--text-muted)" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 8, cursor: 'pointer' }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <Trash2 size={18} color="#ef4444" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444' }}>Terminate Financial Portfolio</span>
                                </div>
                                <ChevronRight size={18} color="var(--text-muted)" />
                            </div>
                        </div>
                    </div>

                    {/* Support & Resources */}
                    <div className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <HelpCircle size={20} color="var(--accent-primary)" />
                            <h3 style={{ fontSize: '1rem' }}>Internal Resources</h3>
                        </div>
                        <div style={{ display: 'grid', gap: 12 }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Account holder: **{user?.name}**</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status: **Verified Executive**</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Data Region: Local Device Storage (Encrypted)</p>
                        </div>
                    </div>

                    <div className="settings-action-container" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                        <button className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1rem' }} onClick={handleSave}>
                            <Save size={18} />
                            Save Portfolio Update
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; }
                .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; }
                input:checked + .slider { background-color: var(--accent-primary); }
                input:checked + .slider:before { transform: translateX(20px); }
                .slider.round { border-radius: 24px; }
                .slider.round:before { border-radius: 50%; }
            `}</style>
        </div>
    );
};

export default SettingsPage;
