// Comprehensive stock catalog organized by sector
export const STOCK_CATALOG = {
  'Technology': [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'META', name: 'Meta Platforms' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AMD', name: 'Advanced Micro Devices' },
    { symbol: 'INTC', name: 'Intel Corp.' },
    { symbol: 'CRM', name: 'Salesforce Inc.' },
    { symbol: 'ORCL', name: 'Oracle Corp.' },
    { symbol: 'ADBE', name: 'Adobe Inc.' },
    { symbol: 'CSCO', name: 'Cisco Systems' },
  ],
  'Retail': [
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'WMT', name: 'Walmart Inc.' },
    { symbol: 'COST', name: 'Costco Wholesale' },
    { symbol: 'HD', name: 'Home Depot' },
    { symbol: 'TGT', name: 'Target Corp.' },
    { symbol: 'LOW', name: "Lowe's Companies" },
    { symbol: 'TJX', name: 'TJX Companies' },
    { symbol: 'ROST', name: 'Ross Stores' },
    { symbol: 'DG', name: 'Dollar General' },
    { symbol: 'DLTR', name: 'Dollar Tree' },
  ],
  'Healthcare': [
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'UNH', name: 'UnitedHealth Group' },
    { symbol: 'PFE', name: 'Pfizer Inc.' },
    { symbol: 'ABBV', name: 'AbbVie Inc.' },
    { symbol: 'LLY', name: 'Eli Lilly & Co.' },
    { symbol: 'MRK', name: 'Merck & Co.' },
    { symbol: 'TMO', name: 'Thermo Fisher Scientific' },
    { symbol: 'ABT', name: 'Abbott Laboratories' },
    { symbol: 'BMY', name: 'Bristol-Myers Squibb' },
    { symbol: 'AMGN', name: 'Amgen Inc.' },
  ],
  'Energy': [
    { symbol: 'XOM', name: 'Exxon Mobil Corp.' },
    { symbol: 'CVX', name: 'Chevron Corp.' },
    { symbol: 'COP', name: 'ConocoPhillips' },
    { symbol: 'SLB', name: 'Schlumberger Ltd.' },
    { symbol: 'EOG', name: 'EOG Resources' },
    { symbol: 'MPC', name: 'Marathon Petroleum' },
    { symbol: 'PSX', name: 'Phillips 66' },
    { symbol: 'VLO', name: 'Valero Energy' },
    { symbol: 'OXY', name: 'Occidental Petroleum' },
    { symbol: 'HAL', name: 'Halliburton Co.' },
  ],
  'Real Estate': [
    { symbol: 'AMT', name: 'American Tower Corp.' },
    { symbol: 'PLD', name: 'Prologis Inc.' },
    { symbol: 'CCI', name: 'Crown Castle Inc.' },
    { symbol: 'EQIX', name: 'Equinix Inc.' },
    { symbol: 'O', name: 'Realty Income Corp.' },
    { symbol: 'SPG', name: 'Simon Property Group' },
    { symbol: 'PSA', name: 'Public Storage' },
    { symbol: 'WELL', name: 'Welltower Inc.' },
    { symbol: 'DLR', name: 'Digital Realty Trust' },
    { symbol: 'AVB', name: 'AvalonBay Communities' },
  ],
  'Precious Metals': [
    { symbol: 'GLD', name: 'SPDR Gold Shares ETF' },
    { symbol: 'SLV', name: 'iShares Silver Trust' },
    { symbol: 'GDX', name: 'VanEck Gold Miners ETF' },
    { symbol: 'NEM', name: 'Newmont Corp.' },
    { symbol: 'GOLD', name: 'Barrick Gold Corp.' },
    { symbol: 'FNV', name: 'Franco-Nevada Corp.' },
    { symbol: 'WPM', name: 'Wheaton Precious Metals' },
    { symbol: 'AEM', name: 'Agnico Eagle Mines' },
    { symbol: 'RGLD', name: 'Royal Gold Inc.' },
    { symbol: 'PAAS', name: 'Pan American Silver' },
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
  { from: 'USD', to: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

// Expanded news catalog with full story content
export const NEWS_CATALOG = [
  {
    id: 1,
    title: "Tech Stocks Rally as AI Chip Demand Surges",
    source: "CNBC",
    time: "2 hours ago",
    sentiment: "Positive",
    summary: "NVIDIA and AMD lead a broad technology rally as enterprise AI adoption accelerates worldwide.",
    content: "Technology stocks posted significant gains on Monday as investors responded to new data showing accelerating enterprise adoption of artificial intelligence. NVIDIA surged over 5% after multiple Wall Street analysts raised their price targets, citing unprecedented demand for the company's H100 and upcoming B200 GPU chips. AMD also rallied sharply after announcing new AI-focused data center processors.\n\nThe broader NASDAQ Composite rose 2.1%, with semiconductor stocks leading the charge. Industry analysts note that cloud computing providers including Amazon Web Services, Microsoft Azure, and Google Cloud have dramatically increased their capital expenditure plans for AI infrastructure, creating a sustained tailwind for chip makers.\n\n\"We're seeing a structural shift in computing demand that will persist for years,\" said Morgan Stanley's semiconductor analyst. \"The companies building AI infrastructure are just getting started.\"\n\nSmaller AI-focused companies also benefited from the rally, with the AI ETF (BOTZ) gaining 3.2% on heavy volume.",
  },
  {
    id: 2,
    title: "Retail Sales Beat Expectations for Third Consecutive Month",
    source: "Yahoo Finance",
    time: "4 hours ago",
    sentiment: "Positive",
    summary: "Consumer spending remains resilient despite inflation concerns, boosting retail sector stocks.",
    content: "The Commerce Department reported retail sales rose 0.7% in the latest monthly reading, surpassing economist expectations of 0.4% growth. This marks the third consecutive month of better-than-expected retail activity.\n\nMajor retailers including Walmart, Amazon, and Costco all reported strong comparable sales growth. Walmart shares hit a new all-time high after the company raised its full-year guidance, citing particularly strong performance in its grocery and e-commerce divisions.\n\nConsumer confidence indicators suggest spending will remain robust through the holiday season. \"The American consumer continues to surprise to the upside,\" noted Goldman Sachs' chief economist. \"Employment remains strong, and wage growth is outpacing inflation for the first time in two years.\"\n\nDiscount retailers Dollar General and Dollar Tree also saw gains, as value-conscious consumers continue to seek deals. The retail sector ETF (XRT) rose 1.8% on the news.",
  },
  {
    id: 3,
    title: "Oil Prices Drop as OPEC+ Signals Production Increase",
    source: "New York Times",
    time: "5 hours ago",
    sentiment: "Negative",
    summary: "Crude oil falls 3% as major producers hint at unwinding production cuts sooner than expected.",
    content: "Crude oil prices fell sharply on Tuesday after several OPEC+ member nations indicated willingness to increase production quotas in the coming months. West Texas Intermediate (WTI) crude dropped 3.2% to $72.45 per barrel, while Brent crude fell 2.8% to $77.10.\n\nThe decline came after Saudi Arabia's energy minister suggested the group could begin unwinding voluntary production cuts as early as next quarter, citing concerns about market share losses to non-OPEC producers. Russia and the UAE echoed similar sentiments.\n\nEnergy stocks broadly declined on the news. Exxon Mobil fell 2.1%, Chevron dropped 1.9%, and ConocoPhillips lost 2.5%. The Energy Select Sector SPDR Fund (XLE) was the worst-performing sector ETF of the day.\n\n\"If OPEC+ follows through with production increases, we could see WTI trading in the $65-70 range by year-end,\" predicted Citigroup's commodity strategist. However, some analysts argue that strong global demand growth could absorb additional supply without significant price declines.",
  },
  {
    id: 4,
    title: "Federal Reserve Holds Rates Steady, Signals Patience",
    source: "Reuters",
    time: "1 day ago",
    sentiment: "Neutral",
    summary: "The Fed maintains its benchmark rate while emphasizing data-dependent approach to future decisions.",
    content: "The Federal Reserve voted unanimously to hold the federal funds rate unchanged at its current range, as widely expected by market participants. In its post-meeting statement, the Fed noted that economic activity continues to expand at a \"solid pace\" while inflation has shown \"modest further progress\" toward the 2% target.\n\nFed Chair Jerome Powell emphasized during the press conference that the committee remains \"data-dependent\" and is in no hurry to adjust policy. \"We want to see more evidence that inflation is moving sustainably toward 2% before we consider rate changes,\" Powell stated.\n\nBond markets reacted calmly to the decision, with the 10-year Treasury yield ticking down slightly to 4.25%. Stock markets showed modest gains, with the S&P 500 rising 0.3% as investors interpreted the statement as neither hawkish nor dovish.\n\nMarket participants are now pricing in approximately two rate cuts by year-end, down from three cuts expected a month ago. The next FOMC meeting is scheduled for six weeks from now.",
  },
  {
    id: 5,
    title: "Gold Prices Hit Record High Amid Geopolitical Tensions",
    source: "Washington Post",
    time: "6 hours ago",
    sentiment: "Positive",
    summary: "Safe-haven demand pushes gold above $2,400/oz as global uncertainties escalate.",
    content: "Gold prices surged to a new all-time high of $2,415 per ounce on Wednesday, driven by escalating geopolitical tensions and increasing central bank purchases. The precious metal has gained over 15% year-to-date, outperforming most major asset classes.\n\nCentral banks, particularly in China, India, and Turkey, have been aggressively adding to their gold reserves as part of diversification strategies. The World Gold Council reported that central bank gold purchases reached their highest level in over 50 years during the first quarter.\n\nGold mining stocks rallied sharply in sympathy. Newmont Corp. rose 4.2%, Barrick Gold gained 3.8%, and the VanEck Gold Miners ETF (GDX) advanced 5.1%. Silver also benefited from the precious metals rally, with the iShares Silver Trust (SLV) gaining 2.7%.\n\n\"Gold is being rerated as a strategic asset in a world of rising geopolitical risk and de-dollarization trends,\" said UBS's precious metals strategist. \"We see potential for gold to reach $2,600 within the next 12 months.\"",
  },
  {
    id: 6,
    title: "Healthcare Stocks Surge on Medicare Expansion Proposal",
    source: "CNBC",
    time: "8 hours ago",
    sentiment: "Positive",
    summary: "UnitedHealth and other managed care companies rally on new government healthcare spending plans.",
    content: "Healthcare stocks posted their strongest single-day gains in months after Congressional leaders unveiled a bipartisan proposal to expand Medicare coverage for prescription drugs. The proposal would increase government healthcare spending by an estimated $200 billion over the next decade.\n\nManaged care companies were among the biggest beneficiaries. UnitedHealth Group surged 4.5%, Humana rose 5.2%, and Cigna gained 3.8%. Pharmaceutical companies with significant Medicare exposure also rallied, with Pfizer up 2.1% and Merck gaining 1.7%.\n\nThe Health Care Select Sector SPDR Fund (XLV) rose 2.3%, its best performance in three months. Hospitals and medical device makers also advanced on expectations of increased patient volumes and procedure counts.\n\nAnalysts at JPMorgan noted that the proposal, if enacted, could add $15-20 per share in long-term value to the largest managed care companies. However, they cautioned that the legislative process is likely to take several months, and the final bill may differ significantly from the current proposal.",
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
