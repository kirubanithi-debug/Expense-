import React, { useState, useEffect } from 'react';
import { Mic, Loader, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useVoiceInput from '../hooks/useVoiceInput';
import { extractExpenseData } from '../utils/expenseParser';
import { getCategoryById } from '../data/categories';
import { useNotification } from '../context/NotificationContext';

const VoiceFAB = ({ onAdd, className }) => {
  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported } = useVoiceInput();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isListening && transcript && !isProcessing) {
      handleAutoProcess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript, isProcessing]);

  const handleAutoProcess = async () => {
    if (!transcript) return;
    
    setIsProcessing(true);
    setStatus('processing');
    
    try {
      const parsed = await extractExpenseData(transcript);
      if (parsed.amount > 0) {
        onAdd(parsed);
        const cat = getCategoryById(parsed.category);
        showNotification(`Logged as ${cat.name}`, { type: 'success' });
        
        // Voice Confirmation
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(`${cat.name} categorized`);
          utterance.rate = 1.1;
          utterance.pitch = 1;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        showNotification('Analysis Failed: Amount not detected', { type: 'error' });
      }
    } catch {
      showNotification('Transaction Attribution Error', { type: 'error' });
    } finally {
      setIsProcessing(false);
      setStatus('');
      resetTranscript();
    }
  };

  const handleClick = () => {
    if (!isSupported) {
      showNotification('Browser Incompatible (Use Chrome)', { type: 'error' });
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`voice-wrapper ${className || ''}`} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <button 
        className="fab-manual" 
        onClick={() => navigate('/expenses?autoAdd=true')}
        title="Add Manual Entry"
      >
        <Plus size={24} />
      </button>
      {/* Automated Transcription Display */}
      {(isListening || transcript || status === 'processing') && (
        <div className="voice-transcript animate-in" style={{ maxWidth: 280, boxShadow: 'var(--shadow-md)' }}>
          {status === 'processing' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <Loader size={16} className="animate-spin" /> Analyzing Expenditure...
            </div>
          ) : (
            transcript || "Listening to your request..."
          )}
        </div>
      )}

      {/* THE CRIMSON FLOATING MIC */}
      <button 
        className={`fab-voice ${isListening ? 'listening' : ''}`}
        onClick={handleClick}
        title="Tap to speak"
      >
        {isListening ? (
          <div style={{ position: 'relative' }}>
            <Mic size={32} />
            <div className="wave-ring"></div>
          </div>
        ) : (
          <Mic size={32} />
        )}

        <style>{`
          .wave-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            border: 2px solid white;
            border-radius: 50%;
            animation: ring-out 1.5s infinite;
          }
          @keyframes ring-out {
            from { width: 40px; height: 40px; opacity: 1; }
            to { width: 100px; height: 100px; opacity: 0; }
          }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin { animation: spin 1s linear infinite; }
        `}</style>
      </button>
    </div>
  );
};

export default VoiceFAB;
