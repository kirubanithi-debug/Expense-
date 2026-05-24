import { detectCategory } from '../data/categories';

const convertWordsToNumbers = (text) => {
  const smalls = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
    ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90
  };
  const magnitudes = {
    hundred: 100, thousand: 1000, lakh: 100000, crore: 10000000
  };

  let processedText = text.replace(/-/g, ' ');
  const words = processedText.split(/\s+/);
  let resultWords = [];
  let currentNumber = 0;
  let tempNumber = 0;
  let isParsingNumber = false;

  for (let word of words) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    
    if (smalls[cleanWord] !== undefined) {
      tempNumber += smalls[cleanWord];
      isParsingNumber = true;
    } else if (magnitudes[cleanWord] !== undefined) {
      if (tempNumber === 0) tempNumber = 1;
      tempNumber *= magnitudes[cleanWord];
      if (cleanWord === 'thousand' || cleanWord === 'lakh' || cleanWord === 'crore') {
        currentNumber += tempNumber;
        tempNumber = 0;
      }
      isParsingNumber = true;
    } else if (cleanWord === 'and' && isParsingNumber) {
      // ignore 'and' inside numbers
    } else {
      if (isParsingNumber) {
        currentNumber += tempNumber;
        resultWords.push(currentNumber.toString());
        currentNumber = 0;
        tempNumber = 0;
        isParsingNumber = false;
      }
      resultWords.push(word); // Keep original casing/punctuation for non-numbers
    }
  }

  if (isParsingNumber) {
    currentNumber += tempNumber;
    resultWords.push(currentNumber.toString());
  }

  return resultWords.join(' ');
};

export const extractExpenseData = (text) => {
  const normalizedText = convertWordsToNumbers(text);
  
  const result = {
    amount: null,
    category: null,
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    raw: text
  };

  // Amount patterns (English)
  const amountPatternsEN = [
    /(?:spent|paid|gave|cost|charged|bought for|worth)\s*(?:rs\.?|₹|rupees?|inr)?\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i,
    /(?:rs\.?|₹|rupees?|inr)\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i,
    /(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:rs\.?|₹|rupees?|inr|bucks)/i,
    /(?:spent|paid|gave|cost|added)\s+(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i,
    /(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:for|on)\s/i,
  ];

  // Amount patterns (Tamil)
  const amountPatternsTamil = [
    /(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:ரூபாய்|ரூ|ரூபா)/i,
    /(?:ரூபாய்|ரூ|ரூபா)\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i,
    /(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:செலவு|காசு)/i,
  ];

  const allPatterns = [...amountPatternsEN, ...amountPatternsTamil];
  for (const pattern of allPatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      result.amount = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }

  // If no amount matched, try to find any standalone number
  if (!result.amount) {
    const numMatch = normalizedText.match(/\b(\d+(?:\.\d{1,2})?)\b/);
    if (numMatch) {
      result.amount = parseFloat(numMatch[1]);
    }
  }

  // Date/Time context
  const lower = normalizedText.toLowerCase();
  const today = new Date();

  if (lower.includes('yesterday') || lower.includes('நேற்று')) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    result.date = yesterday.toISOString().split('T')[0];
  } else if (lower.includes('last week') || lower.includes('கடந்த வாரம்')) {
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    result.date = lastWeek.toISOString().split('T')[0];
  } else if (lower.includes('day before yesterday') || lower.includes('முந்தாநாள்')) {
    const dby = new Date(today);
    dby.setDate(dby.getDate() - 2);
    result.date = dby.toISOString().split('T')[0];
  }

  if (lower.includes('morning') || lower.includes('காலை')) {
    result.time = '09:00';
  } else if (lower.includes('afternoon') || lower.includes('மதியம்')) {
    result.time = '13:00';
  } else if (lower.includes('evening') || lower.includes('மாலை')) {
    result.time = '18:00';
  } else if (lower.includes('night') || lower.includes('இரவு')) {
    result.time = '21:00';
  }

  result.category = detectCategory(normalizedText);

  // Clean description
  let desc = normalizedText
    .replace(/(?:i\s+)?(?:spent|paid|gave|cost|bought)\s*/i, '')
    .replace(/(?:rs\.?|₹|rupees?|inr)\s*\d+(?:,\d{3})*(?:\.\d{1,2})?/gi, '')
    .replace(/\d+(?:,\d{3})*(?:\.\d{1,2})?\s*(?:rs\.?|₹|rupees?|inr|bucks|ரூபாய்|ரூ|ரூபா|காசு)/gi, '')
    .replace(/\b\d+(?:,\d{3})*(?:\.\d{1,2})?\b/g, '') // Remove remaining digits
    .replace(/(?:today|yesterday|day before yesterday|this morning|this evening|tonight|last week|இன்று|நேற்று|முந்தாநாள்|காலை|மதியம்|மாலை|இரவு)/gi, '')
    .replace(/(?:on|for|at|in|to|க்காக|க்கு)\s*$/i, '') // Trailing prepositions
    .replace(/^\s*(?:on|for|at|in|to)\s+/i, '') // Leading prepositions
    .trim();
  
  // Remove multiple spaces
  desc = desc.replace(/\s{2,}/g, ' ');

  if (desc.length > 2) {
    result.description = desc.charAt(0).toUpperCase() + desc.slice(1);
  } else {
    // Fallback description based on category if description is empty or too short
    result.description = result.category.charAt(0).toUpperCase() + result.category.slice(1) + ' Expense';
  }

  return result;
};

export default extractExpenseData;

