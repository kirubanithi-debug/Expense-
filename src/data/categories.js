export const CATEGORIES = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍕',
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
    keywords: {
      en: ['food', 'lunch', 'dinner', 'breakfast', 'snack', 'snacks', 'restaurant', 'hotel', 'biryani', 'pizza', 'burger', 'coffee', 'tea', 'juice', 'milk', 'chicken', 'rice', 'dosa', 'idli', 'meal', 'meals', 'eat', 'eating', 'sweets', 'cake', 'bakery', 'canteen', 'mess', 'tiffin', 'brunch', 'supper', 'starbucks', 'zomato', 'swiggy', 'kfc', 'mcdonalds'],
      ta: ['உணவு', 'சாப்பாடு', 'காலை', 'மதியம்', 'இரவு', 'டீ', 'காபி', 'பிரியாணி', 'தோசை', 'இட்லி', 'சிக்கன்', 'மீன்', 'பால்', 'ஜூஸ்']
    }
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚗',
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4, #44B09E)',
    keywords: {
      en: ['petrol', 'diesel', 'fuel', 'gas', 'uber', 'ola', 'cab', 'taxi', 'bus', 'train', 'metro', 'auto', 'rickshaw', 'parking', 'toll', 'travel', 'transport', 'commute', 'bike', 'car', 'vehicle', 'mechanic', 'repair', 'tyre', 'fastag'],
      ta: ['பெட்ரோல்', 'டீசல்', 'பஸ்', 'ரயில்', 'ஆட்டோ', 'டாக்சி', 'பயணம்', 'வண்டி', 'கார்']
    }
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#A78BFA',
    gradient: 'linear-gradient(135deg, #A78BFA, #818CF8)',
    keywords: {
      en: ['shopping', 'clothes', 'dress', 'shirt', 'pant', 'pants', 'shoes', 'saree', 'amazon', 'flipkart', 'online', 'buy', 'purchase', 'mall', 'store', 'shop', 'market', 'accessories', 'jewellery', 'watch', 'bag', 'bags', 'cosmetics', 'gift', 'gifts', 'myntra', 'meesho', 'ajio'],
      ta: ['கடை', 'துணி', 'சேலை', 'ஷாப்பிங்', 'வாங்கு', 'சட்டை', 'செருப்பு', 'நகை']
    }
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: '💳',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #34d399, #10b981)',
    keywords: {
      en: ['subscription', 'subscriptions', 'subscribe', 'netflix', 'spotify', 'prime video', 'amazon prime', 'disney', 'hotstar', 'hulu', 'youtube premium', 'gym membership', 'ott', 'membership', 'premium', 'youtube', 'adobe', 'canva', 'icloud', 'google one'],
      ta: ['சந்தா', 'மெம்பர்ஷிப்']
    }
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
    keywords: {
      en: ['movie', 'movies', 'cinema', 'theatre', 'game', 'gaming', 'concert', 'party', 'pub', 'bar', 'entertainment', 'fun', 'outing', 'picnic', 'trip', 'vacation', 'holiday', 'ticket', 'tickets', 'show', 'event', 'club', 'resort'],
      ta: ['படம்', 'சினிமா', 'விளையாட்டு', 'கொண்டாட்டம்', 'பார்ட்டி', 'பிக்னிக்']
    }
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    keywords: {
      en: ['school', 'college', 'tuition', 'fees', 'book', 'books', 'course', 'courses', 'class', 'classes', 'study', 'exam', 'exams', 'coaching', 'training', 'udemy', 'education', 'stationery', 'pen', 'notebook', 'notebooks', 'workshop', 'seminar', 'certification', 'learning'],
      ta: ['பள்ளி', 'கல்லூரி', 'புத்தகம்', 'கல்வி', 'ட்யூஷன்', 'வகுப்பு', 'சான்றிதழ்']
    }
  },
  {
    id: 'work',
    name: 'Work & Business',
    icon: '💼',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    keywords: {
      en: ['work', 'office', 'freelance', 'project', 'client', 'salary', 'business', 'laptop', 'software', 'hardware', 'meeting', 'zoom', 'startup', 'coworking', 'license', 'professional', 'service', 'gig', 'consulting'],
      ta: ['வேலை', 'ஆபீஸ்', 'சம்பளம்', 'தொழில்', 'மீட்டிங்']
    }
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: '📱',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    keywords: {
      en: ['bill', 'bills', 'electricity', 'water', 'gas', 'internet', 'wifi', 'phone', 'mobile', 'recharge', 'dth', 'cable', 'rent', 'emi', 'insurance', 'postpaid', 'prepaid', 'maintenance', 'policy', 'tax', 'corporation'],
      ta: ['பில்', 'மின்சாரம்', 'தண்ணீர்', 'வாடகை', 'போன்', 'ரீசார்ஜ்', 'இன்டர்நெட்']
    }
  },
  {
    id: 'health',
    name: 'Health & Medical',
    icon: '🏥',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    keywords: {
      en: ['doctor', 'hospital', 'medicine', 'medicines', 'medical', 'pharmacy', 'clinic', 'health', 'tablet', 'tablets', 'injection', 'scan', 'test', 'lab', 'dental', 'eye', 'gym', 'fitness', 'yoga', 'protein', 'supplement', 'checkup'],
      ta: ['மருத்துவர்', 'மருந்து', 'மருத்துவமனை', 'ஆரோக்கியம்', 'மாத்திரை']
    }
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: '🛒',
    color: '#84CC16',
    gradient: 'linear-gradient(135deg, #84CC16, #65A30D)',
    keywords: {
      en: ['grocery', 'groceries', 'vegetables', 'fruits', 'provisions', 'rice', 'oil', 'sugar', 'dal', 'wheat', 'flour', 'supermarket', 'kirana', 'ration', 'spices', 'masala', 'milk', 'egg', 'meat', 'glossary'],
      ta: ['காய்கறி', 'பழம்', 'மளிகை', 'அரிசி', 'எண்ணெய்', 'சர்க்கரை', 'மசாலா', 'பருப்பு']
    }
  },
  {
    id: 'women',
    name: 'Women Expense',
    icon: '💃',
    color: '#F472B6',
    gradient: 'linear-gradient(135deg, #F472B6, #DB2777)',
    keywords: {
      en: ['women', 'woman', 'ladies', 'beauty', 'parlour', 'makeup', 'cosmetics', 'saree', 'jewelry', 'jewellery', 'necklace', 'earrings', 'skincare', 'fashion', 'handbag', 'lipstick'],
      ta: ['பெண்கள்', 'சேலை', 'நகை', 'அழகு']
    }
  },
  {
    id: 'personal',
    name: 'Personal Care',
    icon: '💇',
    color: '#F472B6',
    gradient: 'linear-gradient(135deg, #F472B6, #E879A8)',
    keywords: {
      en: ['salon', 'haircut', 'spa', 'beauty', 'parlour', 'shampoo', 'soap', 'cream', 'lotion', 'perfume', 'grooming', 'barber', 'makeup', 'skincare'],
      ta: ['சலூன்', 'முடி', 'அழகு', 'சோப்', 'ஷாம்பு']
    }
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📦',
    color: '#6B7280',
    gradient: 'linear-gradient(135deg, #6B7280, #4B5563)',
    keywords: { en: [], ta: [] }
  }
];

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const detectCategory = (text) => {
  const lower = text.toLowerCase();
  for (const cat of CATEGORIES) {
    const allKeywords = [...cat.keywords.en, ...cat.keywords.ta];
    for (const keyword of allKeywords) {
      if (!keyword) continue;
      // Using word boundaries to avoid matching keywords inside other words
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      if (regex.test(lower)) {
        return cat.id;
      }
    }
  }
  return 'other';
};
