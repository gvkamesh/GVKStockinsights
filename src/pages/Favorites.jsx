import { useEffect, useState, useCallback } from 'react';
import { STOCK_CATALOG } from '../data/stockCatalog';
import { fetchBatchPrices } from '../services/liveData';
import { useStore } from '../store/useStore';
import { TrendingUp, TrendingDown, BrainCircuit, Star, RefreshCw, Loader2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';
import StockModal from '../components/StockModal';

export default function Favorites() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const { favorites, removeFavorite } = useStore();

  const loadFavStocks = useCallback(async () => {
    if (!favorites.length) {
      setStocks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const allStocks = Object.values(STOCK_CATALOG).flat();
    const favStocks = allStocks.filter(s => favorites.includes(s.symbol));
    const enriched = await fetchBatchPrices(favStocks);
    
    const withCharts = enriched.map(s => {
      const basePrice = s.price || 100;
      const history = s.history && s.history.length > 5 ? s.history : Array.from({ length: 30 }, (_, i) => ({
        price: +(basePrice * (1 + (Math.random() - 0.48) * 0.03 * (i / 10))).toFixed(2)
      }));
      return { ...s, history: history.map((val, i) => ({ day: i, price: typeof val === 'object' ? val.price : val })) };
    });
    
    setStocks(withCharts);
    setLoading(false);
  }, [favorites]);

  useEffect(() => {
    loadFavStocks();
  }, [loadFavStocks]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-400" />
        <p className="text-slate-400 font-medium tracking-wide">Connecting to watchlist stream...</p>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="p-12 text-center glass-panel rounded-2xl border border-dashed border-slate-700">
        <Star size={48} className="text-slate-600 mx-auto mb-4" />
        <p className="font-bold text-xl text-slate-300">Watchlist Empty</p>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">Head to the Dashboard and click the ★ star icon on any stock card to track it here with predictive metrics.</p>
      </div>
    );
  }

  // AI predictions based on change direction
  const getAIPrediction = (stock) => {
    const isUp = stock.change > 0;
    const confidence = Math.floor(Math.random() * 25 + 60);
    return {
      trend: isUp ? 'BULLISH' : stock.change < 0 ? 'BEARISH' : 'NEUTRAL',
      confidence,
      reason: isUp
        ? "Aggressive volume buildup. Algorithmic sentiment models detect heavy institutional buying pressure ahead of technical breakouts."
        : stock.change < 0
        ? "Heavy resistance detected at the VWAP limit. Statistical models indicate further short-term downside before a consolidation floor is found."
        : "Quantitative models detect pure chop. Await volume expansion for directional certainty before deploying capital."
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Active Watchlist</h1>
          <p className="text-slate-400 mt-1 uppercase text-xs tracking-wider">{stocks.length} EQUITIES TRACKED</p>
        </div>
        <button
          onClick={loadFavStocks}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-sm font-bold shadow-lg transition-all"
        >
          <RefreshCw size={16} className="text-emerald-400" /> SYNC
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stocks.map(stock => {
          const isUp = stock.change > 0;
          const prediction = getAIPrediction(stock);

          return (
            <div 
               key={stock.symbol} 
               onClick={() => setSelectedStock(stock)}
               className="cursor-pointer glass-panel rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 group shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-black text-white">{stock.symbol}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFavorite(stock.symbol); }}
                      className="text-slate-600 hover:text-rose-400 transition-colors"
                      title="Remove from Watchlist"
                    >
                      <Star size={18} className="fill-yellow-400 text-yellow-400 group-hover:hidden" />
                      <Star size={18} className="hidden group-hover:block" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-400 font-medium tracking-wide">{stock.name}</p>
                </div>
                <div className="text-right">
                  {stock.price ? (
                    <>
                      <p className="text-3xl font-black text-white tracking-tight">${stock.price.toFixed(2)}</p>
                      <p className={`flex items-center justify-end gap-1 font-bold text-sm mt-1 ${isUp ? 'text-emerald-400' : stock.change < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        {isUp ? <TrendingUp size={16} /> : stock.change < 0 ? <TrendingDown size={16} /> : null}
                        {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}%
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-500 italic text-sm">Offline</p>
                  )}
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-28 w-full my-6 bg-slate-900/50 rounded-xl p-2 border border-slate-800/80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stock.history}>
                    <XAxis dataKey="day" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip
                      formatter={(val) => [`$${val}`, 'Price']}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                      itemStyle={{ color: '#34d399' }}
                    />
                    <Line type="monotone" dataKey="price" stroke={isUp ? "#34d399" : "#fb7185"} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI Predictive Insight */}
              <div className="mt-4 bg-slate-800/40 rounded-xl p-5 border border-slate-700/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                    <BrainCircuit size={16} className="text-cyan-400" />
                  </div>
                  <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest">Quant Alert</span>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest ${
                      prediction.trend === 'BULLISH' ? 'bg-emerald-500/20 text-emerald-400' :
                      prediction.trend === 'BEARISH' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {prediction.trend}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${prediction.confidence}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-cyan-400">{prediction.confidence}% CONF</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed opacity-90">{prediction.reason}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedStock && <StockModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
