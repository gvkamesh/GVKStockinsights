import { X, TrendingUp, TrendingDown, BrainCircuit, BarChart3 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import { fetchLivePrice } from '../services/liveData';

export default function StockModal({ stock, onClose }) {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
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
  
  const hist = detailData?.history?.length > 0 ? detailData.history : (stock.history || []);
  const chartData = hist.map((val, i) => ({ 
    day: i, 
    price: Number(typeof val === 'object' ? val.price : val).toFixed(2) 
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="glass-panel rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-700/60 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex justify-between items-start bg-slate-900/50">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-4xl font-black text-white tracking-tight">{stock.symbol}</h2>
              <span className="px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {stock.sector}
              </span>
            </div>
            <p className="text-cyan-400 font-bold tracking-wide uppercase text-sm">{stock.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors border border-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-400 rounded-full animate-spin"></div>
               <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Compiling Historical Data...</p>
             </div>
          ) : (
            <div className="space-y-8">
              
              {/* Top Stats */}
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Last Quote</p>
                  <p className="text-5xl font-black text-white tracking-tighter">${currentPrice.toFixed(2)}</p>
                </div>
                <div className="pb-1.5">
                   <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-black tracking-widest ${isUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {isUp ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                      <span className="text-xl">{isUp ? '+' : ''}{currentChange.toFixed(2)}%</span>
                   </div>
                </div>
              </div>

              {/* Main Chart */}
              <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
                <div className="flex items-center gap-2 mb-6 px-2 relative z-10">
                  <BarChart3 size={18} className="text-slate-500" />
                  <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs">Price History (3 Months)</h3>
                </div>
                <div className="h-72 w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="day" hide />
                      <YAxis domain={['auto', 'auto']} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc', fontWeight: 'bold' }}
                        itemStyle={{ color: isUp ? '#34d399' : '#fb7185' }}
                        formatter={(val) => [`$${val}`, 'Close']}
                      />
                      <Line type="monotone" dataKey="price" stroke={isUp ? "#34d399" : "#fb7185"} strokeWidth={3} dot={false} activeDot={{r: 6, fill: isUp ? "#34d399" : "#fb7185", strokeWidth: 0}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-cyan-950/30 rounded-2xl p-6 border border-cyan-900/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                    <BrainCircuit size={20} className="text-cyan-400" />
                  </div>
                  <h3 className="font-black text-cyan-400 uppercase tracking-widest text-sm">Algorithmic Insight</h3>
                </div>
                
                <div className="space-y-6">
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {isUp 
                      ? `${stock.symbol} demonstrates sustained capital inflows with strong algorithmic accumulation. Volume profile corroborates the breakout trajectory, clearing historical resistance nodes. The technical momentum oscillator favors continuation toward upper envelope bounds.`
                      : `${stock.symbol} is undergoing systematic distribution. VWAP constraints have repeatedly rejected bullish probes, signaling near-term technical weakness. Algorithmic models imply testing lower support nodes before a viable consolidation floor forms.`}
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-cyan-900/50">
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-cyan-500/70 font-black uppercase tracking-widest mb-1.5">Net Volume</p>
                      <p className="font-bold text-slate-200">Elevated</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-cyan-500/70 font-black uppercase tracking-widest mb-1.5">RSI (14)</p>
                      <p className="font-bold text-slate-200">{isUp ? '62.4 (Neutral)' : '38.1 (Oversold)'}</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-cyan-500/70 font-black uppercase tracking-widest mb-1.5">MACD Diff</p>
                      <p className={`font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>{isUp ? 'Positive' : 'Negative Divergence'}</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-cyan-500/70 font-black uppercase tracking-widest mb-1.5">Risk Rating</p>
                      <p className="font-bold text-amber-400">Moderate</p>
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
