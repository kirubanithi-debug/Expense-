import { useCallback } from 'react';
import { useExpensesContext } from '../context/ExpensesContext';

export const useExpenses = () => {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    setExpenses
  } = useExpensesContext();

  const getMonthlyTotal = useCallback((month, year) => {
    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const getCategoryTotals = useCallback((month, year) => {
    const filtered = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    const totals = {};
    filtered.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  }, [expenses]);

  const getDailyTotals = useCallback((month, year) => {
    const filtered = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    const totals = {};
    filtered.forEach(e => {
      totals[e.date] = (totals[e.date] || 0) + e.amount;
    });
    return totals;
  }, [expenses]);

  const getDailyCategoryBreakdown = useCallback(() => {
    const groups = {};
    expenses.forEach(exp => {
      const date = exp.date;
      if (!groups[date]) groups[date] = {};
      groups[date][exp.category] = (groups[date][exp.category] || 0) + exp.amount;
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [expenses]);

  const getMonthlyTrend = useCallback((monthsBack = 6) => {
    const trend = [];
    const now = new Date();
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const total = getMonthlyTotal(d.getMonth(), d.getFullYear());
      trend.push({ month: d.toLocaleDateString('default', { month: 'short' }), total });
    }
    return trend;
  }, [getMonthlyTotal]);

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getMonthlyTotal,
    getCategoryTotals,
    getDailyTotals,
    getDailyCategoryBreakdown,
    getMonthlyTrend,
    setExpenses
  };
};

export default useExpenses;
