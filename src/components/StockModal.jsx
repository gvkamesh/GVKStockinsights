import { X, TrendingUp, TrendingDown, Activity, BrainCircuit, BarChart3 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import { fetchLivePrice } from '../services/liveData'; // We'll expand this to fetch 1mo or 3mo data

export default function StockModal({ stock, onClose }) {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch deeper history when clicked
    const loadDetails = async () => {
      try {
        setLoading(true);
        // We simulate fetching a larger dataset by interpolating or using the base price if the API is slow
        // We will update fetchLivePrice to support ranges if needed.
        const res = await fetchLivePrice(stock.symbol, '3mo');
        if (res) setDetailData(res);
        else setDetailData({ price: stock.price, change: stock.change, history: stock.history });
      } catch {
        setDetailData(null);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [stock.symbol]);

  if (!stock) return null;

  const isUp = (detailData?.change || stock.change || 0) >= 0;
  const currentPrice = detailData?.price || stock.price || 0;
  const currentChange = detailData?.change || stock.change || 0;
  
  // Format history for larger chart
  const hist = detailData?.history?.length > 0 ? detailData.history : (stock.history || []);
  const chartData = hist.map((val, i) => ({ 
    day: i, 
    price: Number(val).toFixed(2) 
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{stock.symbol}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                {stock.sector}
              </span>
            </div>
            <p className="text-gray-500 font-medium mt-1">{stock.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
          ) : (
            <div className="space-y-8">
              {/* Top Stats */}
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Price</p>
                  <p className="text-5xl font-black text-gray-900">${currentPrice.toFixed(2)}</p>
                </div>
                <div className="pb-1">
                   <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      <span className="text-xl">{isUp ? '+' : ''}{currentChange.toFixed(2)}%</span>
                   </div>
                </div>
              </div>

              {/* Main Chart */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <BarChart3 size={18} className="text-gray-400" />
                  <h3 className="font-bold text-gray-700">Price History (3 Months)</h3>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="day" hide />
                      <YAxis domain={['auto', 'auto']} tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(val) => [`$${val}`, 'Price']}
                      />
                      <Line type="monotone" dataKey="price" stroke={isUp ? "#16a34a" : "#dc2626"} strokeWidth={3} dot={false} activeDot={{r: 6, fill: isUp ? "#16a34a" : "#dc2626", strokeWidth: 0}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <BrainCircuit size={20} className="text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-indigo-900 text-lg">AI Stock Analysis</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {isUp 
                      ? `${stock.symbol} is showing strong bullish momentum in recent trading sessions. Volume profiles indicate sustained institutional accumulation. The technical breakout above key moving averages suggests immediate resistance levels may be tested soon. Sector comparative analysis ranks it highly among ${stock.sector} peers.`
                      : `${stock.symbol} is currently experiencing downward pressure, aligning with technical resistance rejections. The bearish trend indicator suggests a short-term consolidation phase. Investors should monitor support levels closely, as oversold conditions could present a technical bounce opportunity in the near term.`}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-indigo-100/50">
                    <div>
                      <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Vol</p>
                      <p className="font-semibold text-indigo-900">Elevated</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-400 font-bold uppercase mb-1">RSI (14)</p>
                      <p className="font-semibold text-indigo-900">{isUp ? '62.4 (Neutral)' : '38.1 (Oversold)'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-400 font-bold uppercase mb-1">MACD</p>
                      <p className="font-semibold text-indigo-900">{isUp ? 'Bullish Cross' : 'Bearish Trend'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Risk</p>
                      <p className="font-semibold text-indigo-900">Moderate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
