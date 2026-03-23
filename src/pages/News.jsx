import { useEffect, useState } from 'react';
import { fetchMockNews } from '../utils/mockData';
import { Clock } from 'lucide-react';

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchMockNews().then(setNews);
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Market News</h1>
        <p className="text-gray-500 mt-2">Aggregated latest stories from top financial sources.</p>
      </div>

      <div className="space-y-4">
        {news.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                item.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 
                item.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 
                'bg-gray-100 text-gray-700'
              }`}>
                {item.sentiment}
              </span>
              <span className="text-sm font-semibold text-indigo-600">{item.source}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400 font-medium">
              <Clock size={14} />
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
