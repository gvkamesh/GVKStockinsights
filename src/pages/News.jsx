import { useState } from 'react';
import { NEWS_CATALOG } from '../data/stockCatalog';
import { Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export default function News() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Market News</h1>
        <p className="text-gray-500 mt-2">Aggregated financial stories from top sources. Click any article to read the full story.</p>
      </div>

      <div className="space-y-4">
        {NEWS_CATALOG.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden cursor-pointer ${
                isExpanded ? 'border-blue-200 shadow-lg ring-1 ring-blue-100' : 'border-gray-100 hover:shadow-md hover:border-gray-200'
              }`}
              onClick={() => toggleExpand(item.id)}
            >
              {/* Header - Always Visible */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    item.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                    item.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.sentiment}
                  </span>
                  <span className="text-sm font-semibold text-indigo-600">{item.source}</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    {item.time}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold transition-colors ${isExpanded ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-600'}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.summary}</p>
                  </div>
                  <div className={`p-2 rounded-full transition-all flex-shrink-0 ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-100">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <ExternalLink size={16} className="text-blue-600" />
                        <span className="text-sm font-bold text-blue-700">Full Article</span>
                      </div>
                      {item.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-gray-700 leading-relaxed text-[15px] mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
