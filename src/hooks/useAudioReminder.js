import { useCallback } from 'react';

const useAudioReminder = () => {
  const playChime = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a clean "ping" sound using two oscillators
      const playNote = (freq, startTime, duration, volume) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      // High-pitched cheerful "ping-ping" - Increased volume to 0.15
      playNote(880, now, 0.4, 0.15); // A5
      playNote(1174.66, now + 0.15, 0.5, 0.12); // D6
      
    } catch (e) {
      console.warn('Audio feedback failed', e);
    }
  }, []);

  const checkAndNotify = useCallback((lastExpenseDate) => {
    const stored = localStorage.getItem('expense_user');
    if (!stored) return false;
    const user = JSON.parse(stored);
    const settings = user?.settings || {};
    
    if (settings.reminders === false) return false;

    const now = new Date();
    const [hour, minute] = (settings.reminderTime || '20:00').split(':').map(Number);
    
    if (now.getHours() === hour && now.getMinutes() === minute) {
      const today = now.toISOString().split('T')[0];
      if (lastExpenseDate !== today) {
        if (settings.audioEnabled !== false) playChime();
        return true;
      }
    }
    return false;
  }, [playChime]);

  const checkHourly = useCallback(() => {
    const stored = localStorage.getItem('expense_user');
    if (!stored) return false;
    const user = JSON.parse(stored);
    const settings = user?.settings || {};
    
    // Explicitly enable by default as per user request for "one hour onces"
    const hourlyEnabled = settings.hourlyEnabled !== false;
    if (!hourlyEnabled) return false;
    
    const now = new Date();
    if (now.getMinutes() === 0) {
      const lastHour = localStorage.getItem('last_notified_hour');
      if (lastHour !== now.getHours().toString()) {
        localStorage.setItem('last_notified_hour', now.getHours().toString());
        if (settings.audioEnabled !== false) playChime();
        return true;
      }
    }
    return false;
  }, [playChime]);

  return { playChime, checkAndNotify, checkHourly };
};

export default useAudioReminder;
