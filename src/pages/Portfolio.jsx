import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { fetchBatchPrices } from '../services/liveData';
import { KeyRound, Plus, Trash2, PieChart, TrendingUp, TrendingDown, DollarSign, BrainCircuit, Activity } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StockModal from '../components/StockModal';

const COLORS = ['#34d399', '#06b6d4', '#60a5fa', '#818cf8', '#a78bfa', '#f472b6', '#fb7185', '#fb923c', '#fbbf24', '#a3e635'];

export default function Portfolio() {
  const { tiingoKey, setTiingoKey, portfolio, addTransaction, removeTransaction } = useStore();
  
  // UI States
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [tempKey, setTempKey] = useState('');
  
  // Transaction Form States
  const [txSymbol, setTxSymbol] = useState('');
  const [txType, setTxType] = useState('BUY');
  const [txShares, setTxShares] = useState('');
  const [txPrice, setTxPrice] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  // Live Pricing State
  const [livePrices, setLivePrices] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);

  // Compute Holdings
  const holdings = useMemo(() => {
    const summary = {};
    for (const tx of portfolio) {
      if (!summary[tx.symbol]) {
        summary[tx.symbol] = { symbol: tx.symbol, shares: 0, totalCost: 0 };
      }
      const amt = parseFloat(tx.shares);
      const price = parseFloat(tx.price);
      
      if (tx.type === 'BUY') {
        summary[tx.symbol].shares += amt;
        summary[tx.symbol].totalCost += amt * price;
      } else if (tx.type === 'SELL') {
        summary[tx.symbol].shares -= amt;
        summary[tx.symbol].totalCost -= amt * price; // Note: simplified LIFO/FIFO ignorance for brevity
      }
    }
    
    return Object.values(summary).filter(h => h.shares > 0).map(h => ({
      ...h,
      avgCost: h.totalCost / h.shares
    }));
  }, [portfolio]);

  // Fetch Live Prices recursively for holdings
  useEffect(() => {
    const fetchPrices = async () => {
      const symbols = holdings.map(h => ({ symbol: h.symbol }));
      if (symbols.length === 0) return;
      const res = await fetchBatchPrices(symbols);
      const priceMap = {};
      res.forEach(item => priceMap[item.symbol] = item);
      setLivePrices(priceMap);
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [holdings.length]); // re-run if distinct holdings change

  // Analytics Computation
  const portfolioAnalytics = useMemo(() => {
    let totalValue = 0;
    let totalCostBasis = 0;
    let dailyChangeTotal = 0;

    const enrichedHoldings = holdings.map(h => {
      const live = livePrices[h.symbol];
      const currentPrice = live?.price || h.avgCost; // fallback to cost if offline
      const val = h.shares * currentPrice;
      const totalReturn = val - h.totalCost;
      const totalReturnPct = (totalReturn / h.totalCost) * 100;
      
      // Daily math based on % change from liveData
      const prevClose = live?.change ? currentPrice / (1 + (live.change/100)) : currentPrice;
      const dailyGain = val - (h.shares * prevClose);

      totalValue += val;
      totalCostBasis += h.totalCost;
      dailyChangeTotal += dailyGain;

      return {
        ...h,
        currentPrice,
        value: val,
        totalReturn,
        totalReturnPct,
        dailyGain,
        dailyPct: live?.change || 0,
        name: live?.name || ''
      };
    }).sort((a,b) => b.value - a.value);

    const totalReturnAmt = totalValue - totalCostBasis;
    const totalReturnPct = totalCostBasis > 0 ? (totalReturnAmt / totalCostBasis) * 100 : 0;
    const dailyChangePct = totalValue > 0 ? (dailyChangeTotal / (totalValue - dailyChangeTotal)) * 100 : 0;

    // Chart Data
    const chartData = enrichedHoldings.map(h => ({
      name: h.symbol,
      value: h.value
    }));

    return { totalValue, totalCostBasis, totalReturnAmt, totalReturnPct, dailyChangeTotal, dailyChangePct, enrichedHoldings, chartData };
  }, [holdings, livePrices]);

  const handleSaveKey = () => {
    setTiingoKey(tempKey.trim() || null);
    setShowKeyModal(false);
  };

  const handleAddTx = (e) => {
    e.preventDefault();
    if (!txSymbol || !txShares || !txPrice || !txDate) return;
    
    addTransaction({
      symbol: txSymbol.toUpperCase().trim(),
      type: txType,
      shares: parseFloat(txShares),
      price: parseFloat(txPrice),
      date: txDate
    });
    
    setShowTxModal(false);
    setTxSymbol('');
    setTxShares('');
    setTxPrice('');
  };

  const { totalValue, totalReturnAmt, totalReturnPct, dailyChangeTotal, dailyChangePct, enrichedHoldings, chartData } = portfolioAnalytics;
  const isTotalUp = totalReturnAmt >= 0;
  const isDailyUp = dailyChangeTotal >= 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative">
      {/* Header & Authentication Banner */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <PieChart size={32} className="text-emerald-400" /> Executive Portfolio
          </h1>
          <p className="text-slate-400 mt-2 tracking-wide text-sm font-medium">Real-time valuation based on aggregate ledger logs.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setShowTxModal(true)} className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg">
            <Plus size={16} /> Log Ledger Entry
          </button>
          <button onClick={() => { setTempKey(tiingoKey || ''); setShowKeyModal(true); }} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg">
            <KeyRound size={16} className={tiingoKey ? 'text-amber-400' : 'text-slate-500'} /> 
            {tiingoKey ? 'Tiingo Active' : 'Configure API Key'}
          </button>
        </div>
      </div>

      {!tiingoKey && (
         <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-4">
            <Activity size={24} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
               <h3 className="text-amber-400 font-bold tracking-tight">System Notice: Real-Time API Disconnected</h3>
               <p className="text-sm text-amber-500/80 mt-1 font-medium leading-relaxed">
                 You are currently operating on fallback data paths. To unlock institutional-grade real-time market data directly from the IEX, enter a free <a href="https://api.tiingo.com/" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-300">Tiingo API Token</a>. Keys are encrypted directly into your browser's local memory and never transmitted to our servers.
               </p>
            </div>
         </div>
      )}

      {/* Aggregate Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px]"></div>
           <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2"><DollarSign size={14}/> Total Equity Value</p>
           <p className="text-4xl font-black text-white tracking-tighter">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden relative">
           <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2"><TrendingUp size={14} className={isDailyUp ? 'text-emerald-400' : 'text-rose-400'}/> Daily P&L</p>
           <p className={`text-3xl font-black tracking-tight ${isDailyUp ? 'text-emerald-400' : 'text-rose-400'}`}>
             {isDailyUp ? '+' : ''}${dailyChangeTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
           </p>
           <div className={`inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded mt-2 ${isDailyUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {isDailyUp ? '+' : ''}{dailyChangePct.toFixed(2)}%
           </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden relative">
           <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2"><BrainCircuit size={14} className={isTotalUp ? 'text-emerald-400' : 'text-rose-400'}/> Total Return (Unrealized)</p>
           <p className={`text-3xl font-black tracking-tight ${isTotalUp ? 'text-emerald-400' : 'text-rose-400'}`}>
             {isTotalUp ? '+' : ''}${totalReturnAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
           </p>
           <div className={`inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded mt-2 ${isTotalUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {isTotalUp ? '+' : ''}{totalReturnPct.toFixed(2)}%
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Holdings Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/50">
            <h2 className="text-lg font-black text-white tracking-tight">Active Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/30 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="p-4 border-b border-slate-800/80">Asset</th>
                  <th className="p-4 border-b border-slate-800/80 text-right">Shares</th>
                  <th className="p-4 border-b border-slate-800/80 text-right">Avg Cost</th>
                  <th className="p-4 border-b border-slate-800/80 text-right">Last Price</th>
                  <th className="p-4 border-b border-slate-800/80 text-right">Valuation</th>
                  <th className="p-4 border-b border-slate-800/80 text-right">Total P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {enrichedHoldings.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-500 font-medium">No ledger entries found. Log a transaction to begin tracking.</td></tr>
                ) : (
                  enrichedHoldings.map(h => {
                    const isUp = h.totalReturn >= 0;
                    return (
                      <tr key={h.symbol} className="hover:bg-slate-800/40 transition-colors group cursor-pointer" onClick={() => setSelectedStock({symbol: h.symbol})}>
                        <td className="p-4">
                          <div className="font-black text-white text-lg tracking-tight group-hover:text-cyan-400 transition-colors">{h.symbol}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[120px]">{h.name || 'EQUITY'}</div>
                        </td>
                        <td className="p-4 text-right font-bold text-slate-300">{h.shares.toLocaleString()}</td>
                        <td className="p-4 text-right font-medium text-slate-400">${h.avgCost.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <div className="font-bold text-slate-200">${h.currentPrice.toFixed(2)}</div>
                          <div className={`text-[10px] font-black mt-0.5 ${h.dailyPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {h.dailyPct >= 0 ? '+' : ''}{h.dailyPct.toFixed(2)}%
                          </div>
                        </td>
                        <td className="p-4 text-right font-black text-white tracking-tight">${h.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="p-4 text-right">
                          <div className={`font-black ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {isUp ? '+' : ''}${h.totalReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </div>
                          <div className={`text-[10px] font-black mt-0.5 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                             {isUp ? '+' : ''}{h.totalReturnPct.toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation Donut */}
        <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/50">
            <h2 className="text-lg font-black text-white tracking-tight">Allocation Overview</h2>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[300px]">
             {chartData.length > 0 ? (
                <div className="w-full h-64 relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <RechartsPie>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={4} dataKey="value">
                           {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                           ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 'Value']}
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc', fontWeight: 'bold' }}
                          itemStyle={{ color: '#06b6d4' }}
                        />
                     </RechartsPie>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Equities</span>
                      <span className="text-2xl font-black text-white">{chartData.length}</span>
                   </div>
                </div>
             ) : (
                <div className="text-center">
                   <PieChart size={48} className="text-slate-700 mx-auto mb-3" />
                   <p className="text-slate-500 font-bold text-sm">Insufficient Data</p>
                </div>
             )}
          </div>
        </div>

      </div>

      {/* Transactions Ledger (Slide Down) */}
      <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden mt-6 relative z-10">
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-center">
            <h2 className="text-lg font-black text-white tracking-tight">Raw Transaction Ledger</h2>
          </div>
           <div className="overflow-x-auto max-h-64 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/40 text-[10px] font-black uppercase tracking-widest text-slate-500 sticky top-0">
                  <th className="p-3 pl-6">Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Asset</th>
                  <th className="p-3 text-right">Shares</th>
                  <th className="p-3 text-right">Exec Price</th>
                  <th className="p-3 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm font-medium">
                 {portfolio.length === 0 ? (
                    <tr><td colSpan="6" className="p-4 pl-6 text-slate-500 italic">No exact executions logged.</td></tr>
                 ) : (
                   portfolio.slice().reverse().map(tx => (
                     <tr key={tx.id} className="hover:bg-slate-800/30">
                        <td className="p-3 pl-6 text-slate-400">{tx.date}</td>
                        <td className="p-3">
                           <span className={`text-[10px] px-2 py-0.5 rounded font-black tracking-widest ${tx.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                             {tx.type}
                           </span>
                        </td>
                        <td className="p-3 font-bold text-white">{tx.symbol}</td>
                        <td className="p-3 text-right text-slate-300">{tx.shares}</td>
                        <td className="p-3 text-right text-slate-300">${tx.price.toFixed(2)}</td>
                        <td className="p-3 text-right pr-6">
                           <button onClick={() => removeTransaction(tx.id)} className="text-slate-600 hover:text-rose-400 transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </td>
                     </tr>
                   ))
                 )}
              </tbody>
            </table>
          </div>
      </div>

      {/* Modals placed outside flow */}
      {selectedStock && <StockModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}

      {/* Transaction Modal */}
      {showTxModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md animate-fade-in" onClick={() => setShowTxModal(false)}>
            <div className="glass-panel rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-700/60 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
               <h2 className="text-2xl font-black text-white mb-6">Log Execution</h2>
               <form onSubmit={handleAddTx} className="space-y-4">
                  <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5 tracking-widest">Symbol</label>
                        <input required value={txSymbol} onChange={e=>setTxSymbol(e.target.value)} type="text" placeholder="AAPL" className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl font-bold uppercase focus:ring-2 ring-emerald-500/50 outline-none transition-all" />
                     </div>
                     <div className="w-1/3">
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5 tracking-widest">Action</label>
                        <select value={txType} onChange={e=>setTxType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl font-bold focus:ring-2 ring-emerald-500/50 outline-none transition-all">
                           <option value="BUY">BUY</option>
                           <option value="SELL">SELL</option>
                        </select>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5 tracking-widest">Shares</label>
                        <input required value={txShares} onChange={e=>setTxShares(e.target.value)} type="number" step="any" min="0.000001" placeholder="10" className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl font-bold focus:ring-2 ring-emerald-500/50 outline-none transition-all" />
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5 tracking-widest">Exec Price</label>
                        <input required value={txPrice} onChange={e=>setTxPrice(e.target.value)} type="number" step="any" min="0.01" placeholder="150.00" className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl font-bold focus:ring-2 ring-emerald-500/50 outline-none transition-all" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5 tracking-widest">Date</label>
                     <input required value={txDate} onChange={e=>setTxDate(e.target.value)} type="date" className="w-full bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-medium focus:ring-2 ring-emerald-500/50 outline-none transition-all" />
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={() => setShowTxModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors">Cancel</button>
                     <button type="submit" className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl font-black transition-colors">Save Entry</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Tiingo Key Modal */}
      {showKeyModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md animate-fade-in" onClick={() => setShowKeyModal(false)}>
            <div className="glass-panel rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-700/60 p-8 flex flex-col" onClick={e => e.stopPropagation()}>
               <div className="flex items-center gap-3 mb-2">
                  <KeyRound size={28} className="text-amber-400" />
                  <h2 className="text-2xl font-black text-white tracking-tight">System Configuration</h2>
               </div>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                 Configure your Tiingo API Token below to permanently unlock real-time IEX streaming. This key is written strictly to your local device memory.
               </p>
               
               <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5 tracking-widest">Tiingo Access Token</label>
               <input 
                 value={tempKey} 
                 onChange={e=>setTempKey(e.target.value)} 
                 type="password" 
                 placeholder="Paste your 40-character token here..." 
                 className="w-full bg-slate-900 border-2 border-slate-700 text-white px-5 py-4 rounded-xl font-mono text-sm focus:border-amber-500/50 focus:ring-4 ring-amber-500/10 outline-none transition-all my-2" 
               />
               
               <div className="mt-8 flex gap-3">
                  <button onClick={() => setShowKeyModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors">Cancel</button>
                  <button onClick={handleSaveKey} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl font-black transition-colors">Initialize Link</button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}
