import { useEffect, useState, useCallback } from 'react';
import { STOCK_CATALOG, getSectors } from '../data/stockCatalog';
import { fetchBatchPrices } from '../services/liveData';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { Star, TrendingUp, TrendingDown, RefreshCw, Loader2, Wifi, WifiOff } from 'lucide-react';

export default function Home() {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeSector, setActiveSector] = useState(null);
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite, loadFavorites } = useStore();

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
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => loadAllStocks(true), 60000);
    return () => clearInterval(interval);
  }, [loadAllStocks]);

  useEffect(() => {
    if (user) loadFavorites(user.uid);
  }, [user, loadFavorites]);

  const toggleFavorite = (symbol) => {
    if (!user) return alert("Please sign in to save favorites.");
    if (favorites.includes(symbol)) removeFavorite(user.uid, symbol);
    else addFavorite(user.uid, symbol);
  };

  const displaySectors = activeSector ? [activeSector] : sectors;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 size={48} className="animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Fetching live market data from Google Finance...</p>
        <p className="text-xs text-gray-400">Loading {Object.values(STOCK_CATALOG).flat().length} stocks across {sectors.length} sectors</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Market Overview</h1>
          <p className="text-gray-500 mt-1">Live prices from Google Finance across all sectors</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-400 font-medium">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => loadAllStocks(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Sector Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSector(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!activeSector ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All Sectors
        </button>
        {sectors.map(sector => (
          <button
            key={sector}
            onClick={() => setActiveSector(activeSector === sector ? null : sector)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeSector === sector ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Sector Grids */}
      {displaySectors.map(sector => (
        <div key={sector} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-2 h-7 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              {sector}
              <span className="ml-auto text-sm font-medium text-gray-400">{stockData[sector]?.length || 0} stocks</span>
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
                    className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-white to-gray-50/50 relative overflow-hidden"
                  >
                    {/* Live indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {stock.isLive ? (
                        <Wifi size={12} className="text-green-500" />
                      ) : (
                        <WifiOff size={12} className="text-amber-400" />
                      )}
                    </div>

                    <div className="flex items-start justify-between pr-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg tracking-tight">{stock.symbol}</h3>
                          <button onClick={() => toggleFavorite(stock.symbol)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                            <Star size={16} className={isFav ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 font-medium truncate max-w-[160px]">{stock.name}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-end">
                      {hasPrice ? (
                        <>
                          <span className="text-2xl font-black text-gray-800">${stock.price.toFixed(2)}</span>
                          <span className={`flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-md ${
                            isUp ? 'text-green-700 bg-green-50' : stock.change < 0 ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-50'
                          }`}>
                            {isUp ? <TrendingUp size={14} /> : stock.change < 0 ? <TrendingDown size={14} /> : null}
                            {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}%
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Loading price...</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
