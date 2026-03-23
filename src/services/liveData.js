// Live data fetching using FREE public APIs (no API keys required)
//
// Stocks:  Yahoo Finance public quote endpoint
// Currency: Frankfurter.app (European Central Bank rates, free & open-source)

const YAHOO_QUOTE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const CORS_PROXY = 'https://api.allorigins.win/get?url=';
const CURRENCY_API = 'https://api.frankfurter.app/latest';

/**
 * Fetch live stock price from Yahoo Finance (via CORS proxy)
 */
export async function fetchLivePrice(symbol, range = '5d') {
  try {
    const url = `${CORS_PROXY}${encodeURIComponent(
      `${YAHOO_QUOTE_URL}${symbol}?interval=1d&range=${range}`
    )}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const wrapper = await res.json();
    if (!wrapper.contents) return null;
    const json = JSON.parse(wrapper.contents);
    
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose;
    const change = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;

    // Get last 5 closes for sparkline
    const closes = result.indicators?.quote?.[0]?.close?.filter(Boolean) || [];

    return { price, change, history: closes };
  } catch (err) {
    console.warn(`Yahoo fetch failed for ${symbol}:`, err.message);
    return null;
  }
}

/**
 * Batch fetch stock prices for an array of stock objects
 * Processes in small parallel batches to avoid overload
 */
export async function fetchBatchPrices(stocks) {
  const BATCH_SIZE = 6;
  const enriched = [];

  for (let i = 0; i < stocks.length; i += BATCH_SIZE) {
    const batch = stocks.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (stock) => {
        const liveData = await fetchLivePrice(stock.symbol);
        if (liveData) {
          return {
            ...stock,
            price: liveData.price,
            change: liveData.change,
            history: liveData.history,
            isLive: true,
          };
        }
        return { ...stock, price: null, change: null, history: [], isLive: false };
      })
    );

    for (const r of results) {
      enriched.push(r.status === 'fulfilled' ? r.value : { ...stocks[enriched.length], price: null, change: null, history: [], isLive: false });
    }
  }

  return enriched;
}

/**
 * Fetch ALL currency rates from Frankfurter.app in a single call
 * This API uses European Central Bank data — highly accurate, updated daily
 */
export async function fetchAllCurrencyRates(pairs) {
  try {
    const currencies = pairs.map((p) => p.to).join(',');
    const res = await fetch(`${CURRENCY_API}?from=USD&to=${currencies}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    // data.rates = { EUR: 0.92, GBP: 0.79, ... }

    return pairs.map((pair) => ({
      ...pair,
      rate: data.rates?.[pair.to] ?? null,
      isLive: data.rates?.[pair.to] != null,
      date: data.date, // the ECB reference date
    }));
  } catch (err) {
    console.warn('Currency fetch failed:', err.message);
    return pairs.map((p) => ({ ...p, rate: null, isLive: false }));
  }
}
