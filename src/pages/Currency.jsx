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
    const interval = setInterval(() => loadRates(true), 45000);
    return () => clearInterval(interval);
  }, [loadRates]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-400" />
        <p className="text-slate-400 font-medium tracking-wide">Syncing Forex Rates...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50">
          <ArrowRightLeft size={28} />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">FX Cross Rates</h1>
        <p className="text-slate-400 mt-2 tracking-wide">Real-time ECB exchange rates against USD base currency</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          {lastUpdated && (
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">UPDATED: {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button
            onClick={() => loadRates(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 disabled:opacity-50 transition-all uppercase tracking-wider"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin text-emerald-400' : 'text-emerald-400'} />
            {refreshing ? 'SYNCING...' : 'SYNC'}
          </button>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] pointer-events-none"></div>
        <div className="mb-10 relative z-10">
          <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Base Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-900/80 text-3xl font-black text-white px-12 py-5 border-2 border-slate-700/50 rounded-2xl focus:border-cyan-500/70 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder-slate-600 shadow-inner"
              placeholder="100.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          {rates.map(rate => (
            <div key={rate.to} className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all duration-300 group shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-lg font-black text-white tracking-widest">{rate.to}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{rate.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl text-slate-500">{rate.symbol}</span>
                  {rate.isLive ? (
                    <Wifi size={10} className="text-emerald-500 opacity-80" />
                  ) : (
                    <WifiOff size={10} className="text-rose-500 opacity-80" />
                  )}
                </div>
              </div>
              {rate.rate ? (
                <>
                  <p className="text-3xl font-black text-cyan-400 group-hover:text-cyan-300 transition-colors tracking-tight">
                    {(amount * rate.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 font-bold tracking-widest">1 USD = <span className="text-slate-200">{rate.rate.toFixed(4)}</span></p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500 italic mt-4">Offline</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
