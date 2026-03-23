import { useEffect, useState, useCallback } from 'react';
import { STOCK_CATALOG, getSectors } from '../data/stockCatalog';
import { fetchBatchPrices } from '../services/liveData';
import { useStore } from '../store/useStore';
import { Star, TrendingUp, TrendingDown, RefreshCw, Loader2, Wifi, WifiOff } from 'lucide-react';
import StockModal from '../components/StockModal';

export default function Home() {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeSector, setActiveSector] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const { favorites, addFavorite, removeFavorite } = useStore();

  const sectors = getSectors();

  const loadAllStocks = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const results = {};
    for (const sector of sectors) {
      const stocks = STOCK_CATALOG[sector];
      const enriched = await fetchBatchPrices(stocks);
      results[sector] = enriched;
    }
    setStockData(results);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  }, [sectors]);

  useEffect(() => {
    loadAllStocks();
    const interval = setInterval(() => loadAllStocks(true), 60000);
    return () => clearInterval(interval);
  }, [loadAllStocks]);

  const toggleFavorite = (symbol) => {
    if (favorites.includes(symbol)) removeFavorite(symbol);
    else addFavorite(symbol);
  };

  const displaySectors = activeSector ? [activeSector] : sectors;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 size={48} className="animate-spin text-emerald-400" />
        <p className="text-slate-400 font-medium">Connecting to market data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Market Overview</h1>
          <p className="text-slate-400 mt-1">Real-time quotes aggregated via Yahoo Finance</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-slate-500 font-medium">
              UPDATED {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => loadAllStocks(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-bold shadow-lg disabled:opacity-50 transition-all"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin text-emerald-400' : 'text-emerald-400'} />
            {refreshing ? 'SYNCING...' : 'SYNC'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSector(null)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${!activeSector ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-white'}`}
        >
          All Segments
        </button>
        {sectors.map(sector => (
          <button
            key={sector}
            onClick={() => setActiveSector(activeSector === sector ? null : sector)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${activeSector === sector ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-white'}`}
          >
            {sector.toUpperCase()}
          </button>
        ))}
      </div>

      {displaySectors.map(sector => (
        <div key={sector} className="rounded-2xl border border-slate-800 overflow-hidden glass-panel">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-3 tracking-wide">
              <div className="w-1.5 h-5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              {sector.toUpperCase()}
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(stockData[sector] || []).map(stock => {
                const isFav = favorites.includes(stock.symbol);
                const isUp = stock.change > 0;
                const hasPrice = stock.price !== null;

                return (
                  <div
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className="cursor-pointer p-5 rounded-xl border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 group bg-slate-800/30 relative overflow-hidden shadow-lg"
                  >
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {stock.isLive ? (
                        <Wifi size={12} className="text-emerald-500 opacity-60" />
                      ) : (
                        <WifiOff size={12} className="text-rose-400 opacity-60" />
                      )}
                    </div>

                    <div className="flex items-start justify-between pr-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-xl tracking-tight">{stock.symbol}</h3>
                          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(stock.symbol); }} className="p-1.5 rounded-md hover:bg-slate-700 transition-colors">
                            <Star size={16} className={isFav ? "fill-yellow-400 text-yellow-400" : "text-slate-600"} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 font-medium truncate max-w-[160px] tracking-wide mt-1">{stock.name}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-between items-end">
                      {hasPrice ? (
                        <>
                          <span className="text-2xl font-black text-white">${stock.price.toFixed(2)}</span>
                          <span className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-md ${
                            isUp ? 'text-emerald-400 bg-emerald-500/10' : stock.change < 0 ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 bg-slate-700'
                          }`}>
                            {isUp ? <TrendingUp size={14} /> : stock.change < 0 ? <TrendingDown size={14} /> : null}
                            {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}%
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-slate-500 italic">No Data</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      {selectedStock && <StockModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
