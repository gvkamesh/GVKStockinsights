import { useState } from 'react';
import { NEWS_CATALOG } from '../data/stockCatalog';
import { Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export default function News() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative">
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Market News</h1>
        <p className="text-slate-400 mt-2 tracking-wide">Financial stories aggregated from verified institutional sources.</p>
      </div>

      <div className="space-y-4 relative z-10">
        {NEWS_CATALOG.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`glass-panel rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                isExpanded ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] bg-slate-800/80' : 'border-slate-800 hover:border-slate-600 hover:bg-slate-800/40'
              }`}
              onClick={() => toggleExpand(item.id)}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                    item.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' :
                    item.sentiment === 'Negative' ? 'bg-rose-500/20 text-rose-400' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {item.sentiment}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{item.source}</span>
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <Clock size={12} />
                    {item.time}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className={`text-xl font-black tracking-tight leading-snug transition-colors ${isExpanded ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-3 leading-relaxed">{item.summary}</p>
                  </div>
                  <div className={`p-2 rounded-xl transition-all flex-shrink-0 ${isExpanded ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6">
                  <div className="pt-5 border-t border-slate-700/50">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <ExternalLink size={16} className="text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Full Transmission</span>
                      </div>
                      {item.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-slate-300 leading-relaxed text-[15px] mb-5 last:mb-0">
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
