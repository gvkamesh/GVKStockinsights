export const fetchMockStocks = async () => {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 1.2, sector: 'Technology', history: [150, 160, 155, 170, 175] },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 338.11, change: -0.5, sector: 'Technology', history: [320, 315, 330, 340, 338] },
    { symbol: 'AMZN', name: 'Amazon.com', price: 128.50, change: 2.1, sector: 'Retail', history: [110, 115, 120, 125, 128] },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 155.10, change: 0.8, sector: 'Retail', history: [145, 150, 152, 153, 155] },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.20, change: 0.1, sector: 'Healthcare', history: [160, 161, 161.5, 162, 162.2] },
    { symbol: 'NEM', name: 'Newmont Corp', price: 41.20, change: -1.2, sector: 'Precious Metals', history: [45, 44, 42, 43, 41.2] },
    { symbol: 'XOM', name: 'Exxon Mobil', price: 110.30, change: 1.5, sector: 'Energy', history: [100, 105, 108, 109, 110.3] },
    { symbol: 'O', name: 'Realty Income', price: 60.15, change: 0.4, sector: 'Real Estate', history: [58, 59, 60, 61, 60.15] },
  ];
};

export const fetchMockNews = async () => {
  return [
    { title: "Tech Stocks Rally on AI Optimism", source: "CNBC", time: "2 hours ago", sentiment: "Positive" },
    { title: "Retail Sales Beat Expectations", source: "Yahoo Finance", time: "4 hours ago", sentiment: "Positive" },
    { title: "Oil Prices Dip Amid Global Concerns", source: "NYT", time: "5 hours ago", sentiment: "Negative" },
    { title: "Fed Leaves Rates Unchanged", source: "Reuters", time: "1 day ago", sentiment: "Neutral" },
  ];
};

export const fetchMockRates = async () => {
  return [
    { currency: 'EUR', rate: 0.92, symbol: '€' },
    { currency: 'GBP', rate: 0.79, symbol: '£' },
    { currency: 'INR', rate: 83.15, symbol: '₹' },
    { currency: 'JPY', rate: 148.20, symbol: '¥' },
    { currency: 'AUD', rate: 1.55, symbol: 'A$' },
  ];
};
