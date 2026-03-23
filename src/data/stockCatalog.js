// Comprehensive stock catalog organized by sector based on user request
export const STOCK_CATALOG = {
  'Market ETFs': [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
    { symbol: 'TQQQ', name: 'ProShares UltraPro QQQ' },
    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market' },
    { symbol: 'VGT', name: 'Vanguard Information Tech' },
  ],
  'Tech Giants': [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'META', name: 'Meta Platforms' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'PLTR', name: 'Palantir Technologies' },
    { symbol: 'CRWD', name: 'CrowdStrike Holdings' },
    { symbol: 'UBER', name: 'Uber Technologies' },
  ],
  'Broad Equities': [
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { symbol: 'UNH', name: 'UnitedHealth Group' },
    { symbol: 'CVX', name: 'Chevron Corp.' },
    { symbol: 'NKE', name: 'NIKE Inc.' },
    { symbol: 'DAL', name: 'Delta Air Lines' },
    { symbol: 'M', name: 'Macy\'s Inc.' },
  ],
  'Commodities & Crypto': [
    { symbol: 'GLD', name: 'SPDR Gold Shares' },
    { symbol: 'SLV', name: 'iShares Silver Trust' },
    { symbol: 'BTC-USD', name: 'Bitcoin (USD)' },
  ],
};

// All currency pairs we need
export const CURRENCY_PAIRS = [
  { from: 'USD', to: 'EUR', symbol: '€', name: 'Euro' },
  { from: 'USD', to: 'GBP', symbol: '£', name: 'British Pound' },
  { from: 'USD', to: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { from: 'USD', to: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { from: 'USD', to: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { from: 'USD', to: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { from: 'USD', to: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { from: 'USD', to: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

// Expanded news catalog with full story content
export const NEWS_CATALOG = [
  {
    id: 1,
    title: "Tech Stocks Rally as AI Chip Demand Surges",
    source: "Bloomberg",
    time: "2 hours ago",
    sentiment: "Positive",
    summary: "NVIDIA and AMD lead a broad technology rally as enterprise AI adoption accelerates worldwide.",
    content: "Technology stocks posted significant gains on Monday as investors responded to new data showing accelerating enterprise adoption of artificial intelligence. NVIDIA surged over 5% after multiple Wall Street analysts raised their price targets, citing unprecedented demand for the company's H100 and upcoming B200 GPU chips. AMD also rallied sharply after announcing new AI-focused data center processors.\n\nThe broader NASDAQ Composite rose 2.1%, with semiconductor stocks leading the charge. Industry analysts note that cloud computing providers including Amazon Web Services, Microsoft Azure, and Google Cloud have dramatically increased their capital expenditure plans for AI infrastructure, creating a sustained tailwind for chip makers.\n\n\"We're seeing a structural shift in computing demand that will persist for years,\" said Morgan Stanley's semiconductor analyst. \"The companies building AI infrastructure are just getting started.\"\n\nSmaller AI-focused companies also benefited from the rally, with the AI ETF (BOTZ) gaining 3.2% on heavy volume.",
  },
  {
    id: 2,
    title: "Bitcoin Surges Past Institutional Resistance Levels",
    source: "Financial Times",
    time: "4 hours ago",
    sentiment: "Positive",
    summary: "Crypto markets rally strongly as ETF inflows hit new records for the quarter.",
    content: "Bitcoin prices surged rapidly past major technical resistance levels, bringing the broader crypto market along with it. ETF inflow monitors reported record-breaking volume across major US spot ETFs, signaling sustained institutional appetite.\n\nMicroStrategy and other major corporate holders saw corresponding stock rallies, reflecting the interconnectedness of traditional equities and digital asset markets. Analysts note that reduced selling pressure from miners following the recent supply halving event is finally manifesting in price action.\n\n\"The institutionalization of digital assets is no longer a future concept—it's the present reality,\" noted a lead analyst at Fidelity Digital Assets.",
  },
  {
    id: 3,
    title: "Oil Prices Drop as OPEC+ Signals Production Increase",
    source: "Reuters",
    time: "5 hours ago",
    sentiment: "Negative",
    summary: "Crude oil falls 3% as major producers hint at unwinding production cuts sooner than expected.",
    content: "Crude oil prices fell sharply on Tuesday after several OPEC+ member nations indicated willingness to increase production quotas in the coming months. West Texas Intermediate (WTI) crude dropped 3.2% to $72.45 per barrel, while Brent crude fell 2.8% to $77.10.\n\nThe decline came after Saudi Arabia's energy minister suggested the group could begin unwinding voluntary production cuts as early as next quarter, citing concerns about market share losses to non-OPEC producers. Russia and the UAE echoed similar sentiments.\n\nEnergy stocks broadly declined on the news. Exxon Mobil fell 2.1%, Chevron dropped 1.9%, and ConocoPhillips lost 2.5%. The Energy Select Sector SPDR Fund (XLE) was the worst-performing sector ETF of the day.\n\n\"If OPEC+ follows through with production increases, we could see WTI trading in the $65-70 range by year-end,\" predicted Citigroup's commodity strategist. However, some analysts argue that strong global demand growth could absorb additional supply without significant price declines.",
  },
  {
    id: 4,
    title: "Federal Reserve Holds Rates Steady, Signals Patience",
    source: "Wall Street Journal",
    time: "1 day ago",
    sentiment: "Neutral",
    summary: "The Fed maintains its benchmark rate while emphasizing data-dependent approach to future decisions.",
    content: "The Federal Reserve voted unanimously to hold the federal funds rate unchanged at its current range, as widely expected by market participants. In its post-meeting statement, the Fed noted that economic activity continues to expand at a \"solid pace\" while inflation has shown \"modest further progress\" toward the 2% target.\n\nFed Chair Jerome Powell emphasized during the press conference that the committee remains \"data-dependent\" and is in no hurry to adjust policy. \"We want to see more evidence that inflation is moving sustainably toward 2% before we consider rate changes,\" Powell stated.\n\nBond markets reacted calmly to the decision, with the 10-year Treasury yield ticking down slightly to 4.25%. Stock markets showed modest gains, with the S&P 500 rising 0.3% as investors interpreted the statement as neither hawkish nor dovish.\n\nMarket participants are now pricing in approximately two rate cuts by year-end, down from three cuts expected a month ago. The next FOMC meeting is scheduled for six weeks from now.",
  },
];

// Get all sectors
export const getSectors = () => Object.keys(STOCK_CATALOG);

// Get stocks for a sector
export const getStocksBySector = (sector) => STOCK_CATALOG[sector] || [];

// Get all stocks flat
export const getAllStocks = () => {
  return Object.entries(STOCK_CATALOG).flatMap(([sector, stocks]) =>
    stocks.map(s => ({ ...s, sector }))
  );
};
