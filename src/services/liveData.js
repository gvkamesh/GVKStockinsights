// ══════════════════════════════════════════════════════════════════════
//  Multi-Source Live Data Pipeline
//  Priority: TradingView → Yahoo Finance → Google Finance
//  Currency: Frankfurter.app (European Central Bank, always accurate)
// ══════════════════════════════════════════════════════════════════════

const TRADINGVIEW_URL = 'https://scanner.tradingview.com/america/scan';
const YAHOO_CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const CORS_PROXY = 'https://api.allorigins.win/get?url=';
const CURRENCY_API = 'https://api.frankfurter.app/latest';
const TIINGO_IEX_API = 'https://api.tiingo.com/iex/';

// Exchange lookup for TradingView symbol format
const EXCHANGE_MAP = {
  // ETFs
  SPY: 'AMEX', QQQ: 'NASDAQ', TQQQ: 'NASDAQ', VOO: 'AMEX', VTI: 'AMEX', VGT: 'AMEX',
  GLD: 'AMEX', SLV: 'AMEX',
  // Tech
  AAPL: 'NASDAQ', MSFT: 'NASDAQ', NVDA: 'NASDAQ', TSLA: 'NASDAQ', AMZN: 'NASDAQ',
  META: 'NASDAQ', NFLX: 'NASDAQ', PLTR: 'NASDAQ', CRWD: 'NASDAQ', UBER: 'NYSE',
  // Broad
  JPM: 'NYSE', UNH: 'NYSE', CVX: 'NYSE', NKE: 'NYSE', DAL: 'NYSE', M: 'NYSE',
};

// ─── Source 1: Tiingo Real-Time IEX (Requires API Key) ──────────────
async function fetchFromTiingo(symbols) {
  try {
    // Read the key directly from local storage since it's a frontend app
    const storageObj = JSON.parse(localStorage.getItem('gvk-stock-storage') || '{}');
    const token = storageObj?.state?.tiingoKey;
    if (!token) return null; // No key configured, silently fallback

    // Tiingo can't do BTC-USD through IEX
    const cleanSymbols = symbols.filter(s => s !== 'BTC-USD');
    if (cleanSymbols.length === 0) return null;

    const res = await fetch(`${TIINGO_IEX_API}?tickers=${cleanSymbols.join(',')}&token=${token}`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
       if (res.status === 401) console.warn('Tiingo Key Invalid');
       throw new Error(`Tiingo HTTP ${res.status}`);
    }
    
    const json = await res.json();
    const results = {};
    
    for (const item of json) {
      const sym = item.ticker;
      const last = item.last || item.tngoLast || item.prevClose; // Fallbacks if market closed
      
      // Calculate % change since yesterday's close
      let changePct = 0;
      if (item.prevClose && last) {
         changePct = ((last - item.prevClose) / item.prevClose) * 100;
      }

      results[sym] = {
        price: last,
        change: changePct,
        high: item.high,
        low: item.low,
        open: item.open,
        volume: item.volume,
        source: 'Tiingo IEX',
      };
    }
    return results;
  } catch (err) {
    console.warn('Tiingo source failed:', err.message);
    return null;
  }
}

// ─── Source 2: TradingView Scanner API (no CORS, no key) ──────────
async function fetchFromTradingView(symbols) {
  try {
    const tickers = symbols.map(sym => {
      if (sym === 'BTC-USD') return 'CRYPTO:BTCUSD';
      const exchange = EXCHANGE_MAP[sym] || 'NASDAQ';
      return `${exchange}:${sym}`;
    });

    const res = await fetch(TRADINGVIEW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbols: { tickers, query: { types: [] } },
        columns: ['close', 'change', 'change_abs', 'name', 'description', 'high', 'low', 'open', 'volume'],
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) throw new Error(`TradingView HTTP ${res.status}`);
    const json = await res.json();

    const results = {};
    for (const item of json.data || []) {
      const rawSymbol = item.s; // e.g. "NASDAQ:AAPL"
      const [, ticker] = rawSymbol.split(':');
      const [close, changePct, changeAbs, name, description, high, low, open, volume] = item.d;
      
      // Map back to our symbol format
      const ourSymbol = ticker === 'BTCUSD' ? 'BTC-USD' : ticker;
      results[ourSymbol] = {
        price: close,
        change: changePct,
        changeAbs,
        high,
        low,
        open,
        volume,
        source: 'TradingView',
      };
    }
    return results;
  } catch (err) {
    console.warn('TradingView source failed:', err.message);
    return null;
  }
}

// ─── Source 2: Yahoo Finance (via CORS proxy) ─────────────────────
async function fetchFromYahoo(symbol, range = '5d') {
  try {
    const url = `${CORS_PROXY}${encodeURIComponent(
      `${YAHOO_CHART_URL}${symbol}?interval=1d&range=${range}`
    )}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);

    const wrapper = await res.json();
    if (!wrapper.contents) throw new Error('No contents in proxy response');
    const json = JSON.parse(wrapper.contents);

    const result = json?.chart?.result?.[0];
    if (!result) throw new Error('No chart result');

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose;
    const change = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
    const closes = result.indicators?.quote?.[0]?.close?.filter(Boolean) || [];

    return { price, change, history: closes, source: 'Yahoo Finance' };
  } catch (err) {
    console.warn(`Yahoo source failed for ${symbol}:`, err.message);
    return null;
  }
}

// ─── Source 3: Google Finance Scraping (via CORS proxy) ───────────
async function fetchFromGoogle(symbol) {
  try {
    const googleSymbol = symbol === 'BTC-USD' ? 'BTC-USD' : symbol;
    const exchanges = ['NASDAQ', 'NYSE', 'NYSEARCA'];
    
    for (const exchange of exchanges) {
      try {
        const url = `${CORS_PROXY}${encodeURIComponent(
          `https://www.google.com/finance/quote/${googleSymbol}:${exchange}`
        )}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) continue;

        const wrapper = await res.json();
        const html = wrapper?.contents || '';
        if (!html || html.length < 1000) continue;

        // Parse price from Google Finance HTML
        const priceMatch = html.match(/data-last-price="([^"]+)"/);
        const changeMatch = html.match(/data-last-normal-market-change-percent="([^"]+)"/);

        if (priceMatch) {
          return {
            price: parseFloat(priceMatch[1]),
            change: changeMatch ? parseFloat(changeMatch[1]) : 0,
            source: 'Google Finance',
          };
        }
      } catch {
        continue;
      }
    }
    return null;
  } catch (err) {
    console.warn(`Google source failed for ${symbol}:`, err.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  PUBLIC API: Batch fetch with cascading fallback
// ═══════════════════════════════════════════════════════════════════

let _activeSource = 'Connecting...';

export function getActiveSource() {
  return _activeSource;
}

/**
 * Fetch a single stock with optional range (for modal deep-dive)
 */
export async function fetchLivePrice(symbol, range = '5d') {
  // Try Tiingo First
  const tiingo = await fetchFromTiingo([symbol]);
  if (tiingo && tiingo[symbol]) {
    _activeSource = 'Tiingo IEX Server';
    // If we need historical charts for Tiingo later we can add their daily endpoint
    return { ...tiingo[symbol], isLive: true };
  }

  // Fallback: TradingView
  const tvResults = await fetchFromTradingView([symbol]);
  if (tvResults && tvResults[symbol]) {
    _activeSource = 'TradingView';
    return { ...tvResults[symbol], isLive: true };
  }

  // Fallback: Yahoo
  const yahoo = await fetchFromYahoo(symbol, range);
  if (yahoo) {
    _activeSource = 'Yahoo Finance';
    return { ...yahoo, isLive: true };
  }

  // Fallback: Google
  const google = await fetchFromGoogle(symbol);
  if (google) {
    _activeSource = 'Google Finance';
    return { ...google, isLive: true };
  }

  return null;
}

/**
 * Batch fetch stock prices for an array of stock objects.
 * Tries TradingView batch first (most efficient), then falls back per-stock.
 */
export async function fetchBatchPrices(stocks) {
  const symbols = stocks.map(s => s.symbol);

  // ── Attempt 1: Tiingo IEX (Premium Real-Time) ──
  const tiingoResults = await fetchFromTiingo(symbols);
  if (tiingoResults && Object.keys(tiingoResults).length > 0) {
    _activeSource = 'Tiingo IEX Server';
    const enriched = stocks.map(stock => {
      const t = tiingoResults[stock.symbol];
      if (t) {
        return {
          ...stock,
          price: t.price,
          change: t.change,
          high: t.high,
          low: t.low,
          open: t.open,
          volume: t.volume,
          source: 'Tiingo IEX Server',
          isLive: true,
        };
      }
      return { ...stock, price: null, change: null, source: 'Offline', isLive: false };
    });
    // For BTC-USD, Tiingo IEX doesn't handle crypto, so we will quickly patch it via TV
    if (symbols.includes('BTC-USD') && !tiingoResults['BTC-USD']) {
       const tvResults = await fetchFromTradingView(['BTC-USD']);
       if (tvResults && tvResults['BTC-USD']) {
          const btcIdx = enriched.findIndex(s => s.symbol === 'BTC-USD');
          if (btcIdx !== -1) {
             enriched[btcIdx] = { ...enriched[btcIdx], ...tvResults['BTC-USD'], isLive: true, source: 'TradingView' };
          }
       }
    }
    return enriched;
  }
  
  // ── Attempt 2: TradingView batch (single request for ALL stocks) ──
  const tvResults = await fetchFromTradingView(symbols);
  
  if (tvResults && Object.keys(tvResults).length > 0) {
    _activeSource = 'TradingView';
    const enriched = stocks.map(stock => {
      const tv = tvResults[stock.symbol];
      if (tv) {
        return {
          ...stock,
          price: tv.price,
          change: tv.change,
          high: tv.high,
          low: tv.low,
          open: tv.open,
          volume: tv.volume,
          source: 'TradingView',
          isLive: true,
        };
      }
      return { ...stock, price: null, change: null, source: 'Offline', isLive: false };
    });
    return enriched;
  }

  // ── Attempt 2: Yahoo Finance per-stock (with small batches) ──
  console.log('TradingView unavailable, falling back to Yahoo Finance...');
  let anyYahooWorked = false;
  const BATCH = 4;
  const enriched = [];

  for (let i = 0; i < stocks.length; i += BATCH) {
    const batch = stocks.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map(async (stock) => {
        const data = await fetchFromYahoo(stock.symbol);
        if (data) {
          anyYahooWorked = true;
          return { ...stock, ...data, isLive: true };
        }
        return { ...stock, price: null, change: null, source: 'Offline', isLive: false };
      })
    );
    for (const r of results) {
      enriched.push(r.status === 'fulfilled' ? r.value : { ...stocks[enriched.length], price: null, change: null, source: 'Offline', isLive: false });
    }
  }

  if (anyYahooWorked) {
    _activeSource = 'Yahoo Finance';
    return enriched;
  }

  // ── Attempt 3: Google Finance per-stock ──
  console.log('Yahoo unavailable, falling back to Google Finance...');
  const googleEnriched = [];
  for (const stock of stocks) {
    const data = await fetchFromGoogle(stock.symbol);
    if (data) {
      _activeSource = 'Google Finance';
      googleEnriched.push({ ...stock, ...data, isLive: true });
    } else {
      googleEnriched.push({ ...stock, price: null, change: null, source: 'Offline', isLive: false });
    }
  }
  return googleEnriched;
}

// ═══════════════════════════════════════════════════════════════════
//  Currency Rates (Frankfurter.app — always works, ECB data)
// ═══════════════════════════════════════════════════════════════════

export async function fetchAllCurrencyRates(pairs) {
  try {
    const currencies = pairs.map(p => p.to).join(',');
    const res = await fetch(`${CURRENCY_API}?from=USD&to=${currencies}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return pairs.map(pair => ({
      ...pair,
      rate: data.rates?.[pair.to] ?? null,
      isLive: data.rates?.[pair.to] != null,
      source: 'Frankfurter (ECB)',
      date: data.date,
    }));
  } catch (err) {
    console.warn('Currency fetch failed:', err.message);
    return pairs.map(p => ({ ...p, rate: null, isLive: false, source: 'Offline' }));
  }
}
