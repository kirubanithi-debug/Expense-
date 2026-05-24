import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useAuth } from './AuthContext';
import { detectCategory } from '../data/categories';

const ExpensesContext = createContext();

const API_URL = 'http://localhost:5000/api/expenses';

export const ExpensesProvider = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load expenses when user changes or component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      if (user) {
        try {
          const response = await fetch(API_URL);
          const data = await response.json();
          // For now, filtering is done on the client if multi-user is needed on one server
          // In a real app, the API would handle user-specific queries
          if (Array.isArray(data)) {
            setExpenses(data);
          } else {
            console.error('Invalid data format received from API:', data);
            setExpenses([]);
          }
        } catch (error) {
          console.error('Failed to connect to ExpenseAI Backend:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setExpenses([]);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  const addExpense = useCallback(async (expense) => {
    try {
      const newExpenseData = {
        amount: parseFloat(expense.amount),
        category: expense.category || detectCategory(expense.description || ''),
        description: expense.description || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        time: expense.time || new Date().toTimeString().slice(0, 5),
        source: expense.source || 'manual',
        userId: user?.id // Reference for future multi-user DB
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpenseData)
      });
      
      const savedExpense = await response.json();
      setExpenses(prev => [savedExpense, ...prev]);
      return savedExpense;
    } catch (error) {
      console.error('Transaction Recording Failed:', error);
      throw error;
    }
  }, [user]);

  const updateExpense = useCallback(async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const updatedExpense = await response.json();
      setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
    } catch (error) {
      console.error('Transaction Update Failed:', error);
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Transaction Purge Failed:', error);
    }
  }, []);

  const value = {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    loading
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useExpensesContext = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpensesContext must be used within an ExpensesProvider');
  }
  return context;
};
