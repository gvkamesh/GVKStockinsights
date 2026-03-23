import { useEffect, useState, useCallback } from 'react';
import { CURRENCY_PAIRS } from '../data/stockCatalog';
import { fetchAllCurrencyRates } from '../services/liveData';
import { ArrowRightLeft, RefreshCw, Loader2, Wifi, WifiOff } from 'lucide-react';

export default function Currency() {
  const [rates, setRates] = useState([]);
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadRates = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const liveRates = await fetchAllCurrencyRates(CURRENCY_PAIRS);
    setRates(liveRates);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadRates();
    // Auto-refresh every 45 seconds
    const interval = setInterval(() => loadRates(true), 45000);
    return () => clearInterval(interval);
  }, [loadRates]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-600" />
        <p className="text-gray-500 font-medium">Fetching live exchange rates from Google Finance...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white mb-6 shadow-lg shadow-emerald-500/30">
          <ArrowRightLeft size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Live Currency Exchange</h1>
        <p className="text-gray-500 mt-2">Real-time USD conversion rates from Google Finance • Auto-refreshes every 45s</p>
        <div className="flex items-center justify-center gap-3 mt-3">
          {lastUpdated && (
            <span className="text-xs text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button
            onClick={() => loadRates(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 disabled:opacity-50 transition-all"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Updating...' : 'Refresh Now'}
          </button>
        </div>
      </div>

      {/* Converter */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Amount in USD ($)</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full text-3xl font-black text-gray-900 pl-12 pr-4 py-5 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              placeholder="100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rates.map(rate => (
            <div key={rate.to} className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-emerald-50/30 border border-emerald-100/60 hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-lg font-bold text-gray-800">{rate.to}</span>
                  <p className="text-xs text-gray-500 font-medium">{rate.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl">{rate.symbol}</span>
                  {rate.isLive ? (
                    <Wifi size={10} className="text-green-500" />
                  ) : (
                    <WifiOff size={10} className="text-amber-400" />
                  )}
                </div>
              </div>
              {rate.rate ? (
                <>
                  <p className="text-3xl font-black text-emerald-900 group-hover:text-emerald-700 transition-colors">
                    {(amount * rate.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className="mt-3 pt-3 border-t border-emerald-100/70">
                    <p className="text-xs text-emerald-600 font-semibold">1 USD = {rate.rate.toFixed(4)} {rate.to}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-amber-500 italic">Rate unavailable</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
