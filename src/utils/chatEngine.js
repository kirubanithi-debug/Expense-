
export const processQuery = (message, expenses) => {
  const lower = message.toLowerCase();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  const totalThisMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalLastMonth = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const categoryTotals = {};
  thisMonthExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // Most spent
  if (lower.includes('most') || lower.includes('highest') || lower.includes('top') || lower.includes('maximum')) {
    if (sortedCategories.length === 0) {
      return "You haven't logged any history this month yet. Start by adding some records! 📝";
    }
    const [topCat, topAmt] = sortedCategories[0];
    const top3 = sortedCategories.slice(0, 3).map(([c, a], i) => `${i + 1}. **${c}**: ₹${a.toLocaleString()}`).join('\n');
    return `Your top spending categories this month:\n\n${top3}\n\n🎯 **${topCat}** takes the lead with ₹${topAmt.toLocaleString()}!`;
  }

  // Total spent
  if (lower.includes('total') || lower.includes('how much') && (lower.includes('spent') || lower.includes('spend'))) {
    if (lower.includes('last month')) {
      return `You spent a total of **₹${totalLastMonth.toLocaleString()}** last month.`;
    }
    return `You've spent **₹${totalThisMonth.toLocaleString()}** this month so far.\n\n${totalLastMonth > 0 ?
      (totalThisMonth > totalLastMonth
        ? `⚠️ That's ₹${(totalThisMonth - totalLastMonth).toLocaleString()} more than last month.`
        : `✅ That's ₹${(totalLastMonth - totalThisMonth).toLocaleString()} less than last month. Great job!`)
      : ''}`;
  }

  // Category specific
  const categories = ['food', 'transport', 'shopping', 'bills', 'health', 'education', 'entertainment', 'groceries', 'personal', 'work', 'subscriptions'];
  for (const cat of categories) {
    if (lower.includes(cat)) {
      const catTotal = categoryTotals[cat] || 0;
      const catExpenses = thisMonthExpenses.filter(e => e.category === cat);
      const displayName = cat.charAt(0).toUpperCase() + cat.slice(1).replace('&', ' & ');
      return `You've spent **₹${catTotal.toLocaleString()}** on **${displayName}** this month across ${catExpenses.length} transaction(s).\n\n${catTotal > 0 ? `Average per transaction: ₹${Math.round(catTotal / catExpenses.length).toLocaleString()}` : 'No history in this category yet.'}`;
    }
  }

  // Save more
  if (lower.includes('save') || lower.includes('saving') || lower.includes('reduce') || lower.includes('cut')) {
    const tips = [];
    if (sortedCategories.length > 0) {
      const [topCat, topAmt] = sortedCategories[0];
      tips.push(`💡 Your biggest expense is **${topCat}** (₹${topAmt.toLocaleString()}). Try setting a weekly budget for this category.`);
    }
    tips.push('📊 Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.');
    tips.push('🔔 Enable budget alerts to get notified before overspending.');
    tips.push('📝 Track every small expense - they add up quickly!');
    tips.push('🍳 Cook at home more often to reduce food expenses.');
    tips.push('🚶 Walk or cycle for short distances to save on transport.');
    return `Here are some tips to save more:\n\n${tips.join('\n\n')}`;
  }

  // Budget
  if (lower.includes('budget') || lower.includes('forecast') || lower.includes('predict')) {
    const dailyAvg = totalThisMonth / Math.max(now.getDate(), 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const predicted = Math.round(dailyAvg * daysInMonth);
    return `📊 **Budget Forecast**\n\n• Daily average: ₹${Math.round(dailyAvg).toLocaleString()}\n• Predicted total this month: **₹${predicted.toLocaleString()}**\n• Days remaining: ${daysInMonth - now.getDate()}\n\n${predicted > totalLastMonth && totalLastMonth > 0 ? '⚠️ You\'re on track to spend more than last month.' : '✅ Looking good! You\'re within your usual range.'}`;
  }

  // Compare
  if (lower.includes('compare') || lower.includes('vs') || lower.includes('versus') || lower.includes('difference')) {
    return `📊 **Month Comparison**\n\n• This month: ₹${totalThisMonth.toLocaleString()}\n• Last month: ₹${totalLastMonth.toLocaleString()}\n• Difference: ${totalThisMonth >= totalLastMonth ? '📈' : '📉'} ₹${Math.abs(totalThisMonth - totalLastMonth).toLocaleString()}\n\n${totalThisMonth > totalLastMonth ? '⚠️ Spending has increased. Review your history!' : '✅ Great! You\'re spending less than last month!'}`;
  }

  // Greeting
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello! 👋 I'm your AI Expense Assistant. Here's what I can help with:\n\n• **"Where did I spend most?"** - Top spending categories\n• **"How much spent on food?"** - Category breakdown\n• **"How to save more?"** - Savings tips\n• **"Budget forecast"** - Monthly prediction\n• **"Compare months"** - Month-over-month comparison\n• **"Total spent"** - Monthly total\n\nJust ask me anything about your expenses! 💰`;
  }

  // Default
  return `I can help you with:\n\n• 📊 **Spending analysis** - "Where did I spend most?"\n• 💰 **Category totals** - "How much on food?"\n• 💡 **Savings tips** - "How to save more?"\n• 🔮 **Forecasts** - "Budget forecast"\n• 📈 **Comparisons** - "Compare this month vs last"\n\nTry asking one of these questions! 😊`;
};
