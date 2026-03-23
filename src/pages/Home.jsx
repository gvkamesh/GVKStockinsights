import { useEffect, useState } from 'react';
import { fetchMockStocks } from '../utils/mockData';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite, loadFavorites } = useStore();

  useEffect(() => {
    fetchMockStocks().then(setStocks);
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites(user.uid);
    }
  }, [user, loadFavorites]);

  const toggleFavorite = (symbol) => {
    if (!user) {
      alert("Please sign in to save favorites.");
      return;
    }
    if (favorites.includes(symbol)) removeFavorite(user.uid, symbol);
    else addFavorite(user.uid, symbol);
  };

  const grouped = stocks.reduce((acc, stock) => {
    if (!acc[stock.sector]) acc[stock.sector] = [];
    acc[stock.sector].push(stock);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Market Overview</h1>
          <p className="text-gray-500 mt-1">Live updates across all sectors.</p>
        </div>
      </div>
      
      {Object.entries(grouped).map(([sector, sectorStocks]) => (
        <div key={sector} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-900 border-b border-gray-100 pb-2 flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
            {sector}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectorStocks.map(stock => {
              const isFav = favorites.includes(stock.symbol);
              const isUp = stock.change > 0;
              return (
                <div key={stock.symbol} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/50 to-transparent rounded-bl-full pointer-events-none"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{stock.symbol}</h3>
                      <p className="text-xs font-medium text-gray-500 truncate w-32">{stock.name}</p>
                    </div>
                    <button onClick={() => toggleFavorite(stock.symbol)} className="p-1 hover:bg-white rounded-full transition-colors z-10">
                      <Star size={20} className={isFav ? "fill-yellow-400 text-yellow-400" : "text-gray-300 group-hover:text-gray-400"} />
                    </button>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                    <span className="text-2xl font-black text-gray-800">${stock.price.toFixed(2)}</span>
                    <span className={`flex items-center gap-1 text-sm font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                      {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {Math.abs(stock.change)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
