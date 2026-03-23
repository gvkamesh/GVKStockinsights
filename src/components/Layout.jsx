import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Star, DollarSign, Newspaper, TrendingUp, Menu, X, Database, PieChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getActiveSource } from '../services/liveData';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [source, setSource] = useState('Connecting...');

  useEffect(() => {
    const interval = setInterval(() => setSource(getActiveSource()), 2000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: PieChart, label: 'Portfolio', path: '/portfolio' },
    { icon: Star, label: 'Watchlist', path: '/favorites' },
    { icon: DollarSign, label: 'Currency', path: '/currency' },
    { icon: Newspaper, label: 'News', path: '/news' },
  ];

  return (
    <div className="flex bg-[#0b0f19] min-h-screen text-slate-200 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/60 bg-[#0f172a] shadow-xl z-20 sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingUp size={24} className="text-[#0f172a]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">GVK<span className="text-emerald-400">Insights</span></h1>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Terminal v2.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-slate-800/80 text-emerald-400 shadow-md ring-1 ring-slate-700/50' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`
              }
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/60 mb-4 space-y-3">
           <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                 <Database size={12} className="text-cyan-400" />
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Data Source</p>
              </div>
              <p className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                 <span className={`w-2 h-2 rounded-full ${source === 'Connecting...' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
                 {source}
              </p>
           </div>
           <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                 Fallback: TradingView → Yahoo → Google
              </p>
           </div>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f172a] border-b border-slate-800/60 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
             <TrendingUp size={18} className="text-[#0f172a]" />
           </div>
           <h1 className="text-lg font-black text-white tracking-tight">GVK<span className="text-emerald-400">Insights</span></h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-[#0b0f19]/95 backdrop-blur-sm pt-20 px-4">
          <nav className="space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 p-4 rounded-xl font-bold text-lg ${
                    isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-800/50'
                  }`
                }
              >
                <item.icon size={24} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 lg:ml-0 mt-16 lg:mt-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="h-[calc(100vh-4rem)] lg:h-screen overflow-y-auto custom-scrollbar p-4 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
