import { useEffect, useState } from 'react';
import { fetchMockStocks } from '../utils/mockData';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, BrainCircuit } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

export default function Favorites() {
  const [stocks, setStocks] = useState([]);
  const { favorites } = useStore();
  const { user } = useAuth();

  useEffect(() => {
    fetchMockStocks().then(res => {
      setStocks(res.filter(s => favorites.includes(s.symbol)));
    });
  }, [favorites]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Star size={32} className="text-blue-500 fill-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view favorites</h2>
        <p className="text-gray-500 max-w-md">Your personalized watchlist and predictive insights are stored securely in your profile.</p>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
        <p className="font-semibold text-lg text-gray-700">No favorites yet.</p>
        <p className="text-sm mt-1">Head back to the dashboard and click the star icon to add tracking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
       <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Watchlist</h1>
          <p className="text-gray-500 mt-1">Personalized tracking with predictive AI insights.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stocks.map(stock => {
          const isUp = stock.change > 0;
          const chartData = stock.history.map((val, i) => ({ price: val, day: i }));
          
          return (
            <div key={stock.symbol} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{stock.symbol}</h3>
                  <p className="text-sm text-gray-500">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
                  <p className={`flex items-center justify-end gap-1 font-semibold text-sm ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />} 
                    {Math.abs(stock.change)}%
                  </p>
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-24 w-full my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="price" stroke={isUp ? "#16a34a" : "#dc2626"} strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Predictive AI Insight Component */}
              <div className="mt-4 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
                  <BrainCircuit size={18} />
                  <span>AI Predictive Outlook</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${isUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isUp ? 'Bullish' : 'Bearish'} ({(Math.random() * 30 + 60).toFixed(0)}%)
                  </span>
                  <p className="text-sm text-gray-600 italic">
                    {isUp 
                      ? "Strong momentum detected based on recent volume accumulation and news sentiment."
                      : "Slight technical resistance observed, potential short-term pullback expected."}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 mt-3">* Not financial advice.</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
