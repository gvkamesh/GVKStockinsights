// Live data fetching via Google Finance (no API key required)
// Uses a CORS proxy to scrape Google Finance pages

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

/**
 * Fetch live stock price from Google Finance
 * Falls back to estimated data if scraping fails
 */
export async function fetchLivePrice(symbol) {
  try {
    const url = `${CORS_PROXY}${encodeURIComponent(`https://www.google.com/finance/quote/${symbol}:NASDAQ`)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) {
      // Try NYSE
      const url2 = `${CORS_PROXY}${encodeURIComponent(`https://www.google.com/finance/quote/${symbol}:NYSE`)}`;
      const response2 = await fetch(url2, { signal: AbortSignal.timeout(8000) });
      if (!response2.ok) throw new Error('Failed');
      return parseGoogleFinancePage(await response2.text(), symbol);
    }

    return parseGoogleFinancePage(await response.text(), symbol);
  } catch (err) {
    // Try NYSEARCA for ETFs
    try {
      const url3 = `${CORS_PROXY}${encodeURIComponent(`https://www.google.com/finance/quote/${symbol}:NYSEARCA`)}`;
      const response3 = await fetch(url3, { signal: AbortSignal.timeout(8000) });
      if (response3.ok) {
        return parseGoogleFinancePage(await response3.text(), symbol);
      }
    } catch (_) {}

    console.warn(`Could not fetch live price for ${symbol}, using fallback`);
    return null;
  }
}

/**
 * Parse Google Finance HTML to extract price and change
 */
function parseGoogleFinancePage(html, symbol) {
  try {
    // Extract price - Google Finance puts price in a specific data attribute pattern
    // The price appears in the page in various formats, we'll try multiple patterns

    // Pattern 1: Look for the main price display
    let priceMatch = html.match(/data-last-price="([^"]+)"/);
    let price = priceMatch ? parseFloat(priceMatch[1]) : null;

    // Pattern 2: Alternative price pattern
    if (!price) {
      priceMatch = html.match(/class="YMlKec fxKbKc"[^>]*>([^<]+)</);
      if (priceMatch) {
        price = parseFloat(priceMatch[1].replace(/[$,]/g, ''));
      }
    }

    // Pattern 3: Try data-value
    if (!price) {
      priceMatch = html.match(/data-value="([^"]+)"/);
      if (priceMatch) {
        price = parseFloat(priceMatch[1]);
      }
    }

    // Extract change percentage
    let changeMatch = html.match(/data-last-normal-market-change-percent="([^"]+)"/);
    let change = changeMatch ? parseFloat(changeMatch[1]) : null;

    // Alternative change pattern
    if (change === null) {
      changeMatch = html.match(/class="[^"]*P2Luy[^"]*"[^>]*>([^<]+)%/);
      if (changeMatch) {
        change = parseFloat(changeMatch[1]);
      }
    }

    // If we still don't have change, try to find it
    if (change === null) {
      changeMatch = html.match(/([-+]?\d+\.?\d*)%/);
      if (changeMatch) {
        change = parseFloat(changeMatch[1]);
      }
    }

    if (price) {
      return { price, change: change || 0 };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch live currency exchange rate from Google Finance
 */
export async function fetchLiveCurrencyRate(from, to) {
  try {
    const url = `${CORS_PROXY}${encodeURIComponent(`https://www.google.com/finance/quote/${from}-${to}`)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Failed');

    const html = await response.text();

    // Extract the exchange rate
    let rateMatch = html.match(/data-last-price="([^"]+)"/);
    if (rateMatch) {
      return parseFloat(rateMatch[1]);
    }

    // Alternative pattern
    rateMatch = html.match(/class="YMlKec fxKbKc"[^>]*>([^<]+)</);
    if (rateMatch) {
      return parseFloat(rateMatch[1].replace(/[,]/g, ''));
    }

    return null;
  } catch {
    console.warn(`Could not fetch live rate for ${from}-${to}`);
    return null;
  }
}

/**
 * Batch fetch stock prices for an array of stock objects
 * Returns enriched stock objects with live price data
 */
export async function fetchBatchPrices(stocks) {
  const results = await Promise.allSettled(
    stocks.map(async (stock) => {
      const liveData = await fetchLivePrice(stock.symbol);
      if (liveData) {
        return { ...stock, price: liveData.price, change: liveData.change, isLive: true };
      }
      return { ...stock, price: null, change: null, isLive: false };
    })
  );

  return results.map((result, i) => {
    if (result.status === 'fulfilled') return result.value;
    return { ...stocks[i], price: null, change: null, isLive: false };
  });
}

/**
 * Batch fetch currency rates
 */
export async function fetchAllCurrencyRates(pairs) {
  const results = await Promise.allSettled(
    pairs.map(async (pair) => {
      const rate = await fetchLiveCurrencyRate(pair.from, pair.to);
      return { ...pair, rate, isLive: rate !== null };
    })
  );

  return results.map((result, i) => {
    if (result.status === 'fulfilled') return result.value;
    return { ...pairs[i], rate: null, isLive: false };
  });
}
