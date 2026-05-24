import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, ShieldCheck, ArrowDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useExpenses from '../hooks/useExpenses';
import { processQuery } from '../utils/chatEngine';

const ChatAssistant = () => {
  const { user } = useAuth();
  const { expenses } = useExpenses();
  const [messages, setMessages] = useState([
    { role: 'bot', content: `Good day, ${user?.name}. I am your AI Financial Advisor. How may I assist with your portfolio analysis today?` }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Process with engine
    setTimeout(() => {
      const response = processQuery(input, expenses);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    }, 600);
  };

  return (
    <div className="animate-in" style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Financial <span style={{ color: 'var(--accent-primary)' }}>Advisor</span></h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Precision insights and strategic fiscal guidance.</p>
      </header>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div className="chat-messages-container" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, idx) => (
            <div key={idx} className="chat-bubble" style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 16px',
              borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
              background: msg.role === 'user' ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'rgba(255,255,255,0.04)',
              color: 'white',
              fontSize: '0.875rem',
              lineHeight: 1.45,
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
              marginBottom: 8
            }}>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ 
          padding: '16px 16px 20px', 
          borderTop: '1px solid var(--border-color)', 
          background: 'rgba(10, 14, 26, 0.8)', 
          backdropFilter: 'blur(16px)',
          position: 'relative'
        }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Ask about finances..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, height: 44, fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ width: 44, height: 44, padding: 0 }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
