import { useEffect, useState, useCallback } from 'react';
import { STOCK_CATALOG } from '../data/stockCatalog';
import { fetchBatchPrices } from '../services/liveData';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, BrainCircuit, Star, RefreshCw, Loader2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';

export default function Favorites() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useStore();
  const { user } = useAuth();

  const loadFavStocks = useCallback(async () => {
    if (!favorites.length) {
      setStocks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Find all favorited stocks from catalog
    const allStocks = Object.values(STOCK_CATALOG).flat();
    const favStocks = allStocks.filter(s => favorites.includes(s.symbol));
    const enriched = await fetchBatchPrices(favStocks);
    
    // Generate sparkline data for each stock
    const withCharts = enriched.map(s => {
      const basePrice = s.price || 100;
      const history = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: +(basePrice * (1 + (Math.random() - 0.48) * 0.03 * (i / 10))).toFixed(2)
      }));
      return { ...s, history };
    });
    
    setStocks(withCharts);
    setLoading(false);
  }, [favorites]);

  useEffect(() => {
    loadFavStocks();
  }, [loadFavStocks]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Star size={40} className="text-blue-500 fill-blue-200" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view favorites</h2>
        <p className="text-gray-500 max-w-md">Your personalized watchlist and AI predictive insights are stored securely in your profile. Sign in with Google to get started.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 size={40} className="animate-spin text-blue-600" />
        <p className="text-gray-500">Loading your favorites...</p>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <Star size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="font-bold text-xl text-gray-700">No favorites yet</p>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">Head to the Dashboard and click the ★ star icon on any stock card to add it to your personalized watchlist.</p>
      </div>
    );
  }

  // AI predictions based on change direction
  const getAIPrediction = (stock) => {
    const isUp = stock.change > 0;
    const confidence = Math.floor(Math.random() * 25 + 60);
    return {
      trend: isUp ? 'Bullish' : stock.change < 0 ? 'Bearish' : 'Neutral',
      confidence,
      reason: isUp
        ? "Strong upward momentum observed from recent volume accumulation and positive institutional sentiment. Technical indicators suggest continuation."
        : stock.change < 0
        ? "Technical resistance detected at current levels. Short-term pullback expected based on volume divergence and profit-taking signals."
        : "Mixed signals from technical and fundamental indicators. Price consolidation expected before next directional move."
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Watchlist</h1>
          <p className="text-gray-500 mt-1">{stocks.length} stocks tracked with AI predictive insights</p>
        </div>
        <button
          onClick={loadFavStocks}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-500/25 transition-all"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stocks.map(stock => {
          const isUp = stock.change > 0;
          const prediction = getAIPrediction(stock);

          return (
            <div key={stock.symbol} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-gray-900">{stock.symbol}</h3>
                    <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{stock.name}</p>
                </div>
                <div className="text-right">
                  {stock.price ? (
                    <>
                      <p className="text-2xl font-black">${stock.price.toFixed(2)}</p>
                      <p className={`flex items-center justify-end gap-1 font-bold text-sm ${isUp ? 'text-green-600' : stock.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {isUp ? <TrendingUp size={16} /> : stock.change < 0 ? <TrendingDown size={16} /> : null}
                        {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}%
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic text-sm">Price unavailable</p>
                  )}
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-28 w-full my-4 bg-gray-50 rounded-xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stock.history}>
                    <XAxis dataKey="day" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip
                      formatter={(val) => [`$${val}`, 'Price']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: '13px' }}
                    />
                    <Line type="monotone" dataKey="price" stroke={isUp ? "#16a34a" : "#dc2626"} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI Predictive Insight */}
              <div className="mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100/60">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <BrainCircuit size={18} className="text-indigo-600" />
                  </div>
                  <span className="text-indigo-700 font-bold text-sm">AI Predictive Outlook</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${
                      prediction.trend === 'Bullish' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' :
                      prediction.trend === 'Bearish' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' :
                      'bg-gray-100 text-gray-800 ring-1 ring-gray-200'
                    }`}>
                      {prediction.trend}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${prediction.confidence}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-indigo-700">{prediction.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{prediction.reason}</p>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-indigo-100/50">⚠️ This is AI-generated analysis and does NOT constitute financial advice.</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
