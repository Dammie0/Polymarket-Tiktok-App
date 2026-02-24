import React, { useState, useEffect, useRef } from "react";
import { Market, fetchTrendingMarkets } from "./services/marketService";
import { MarketCard } from "./components/MarketCard";
import { Wallet, Zap, BarChart3, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMarkets = async () => {
      const data = await fetchTrendingMarkets();
      setMarkets(data);
      setLoading(false);
    };
    loadMarkets();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / height);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-degen-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-degen-blue border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-degen-blue animate-pulse uppercase tracking-widest">Initializing OracleStream</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-degen-black relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-10 h-10 bg-degen-blue rounded-lg flex items-center justify-center rotate-12">
            <Zap className="text-black fill-current" size={24} />
          </div>
          <span className="text-2xl font-display font-black italic tracking-tighter uppercase">
            Oracle<span className="text-degen-blue">Stream</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-degen-green animate-pulse" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Live Feed</span>
          </div>
        </div>
      </header>


      {/* Main Feed */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {markets.map((market, index) => (
          <div key={market.id} className="h-screen w-full snap-start relative">
            <MarketCard 
              market={market} 
              isActive={index === currentIndex} 
            />
          </div>
        ))}
      </div>

      {/* Navigation Rail */}
      <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full flex items-center gap-8">
        <button className="text-white hover:text-degen-blue transition-colors">
          <Zap size={24} />
        </button>
        <button className="text-white/40 hover:text-degen-blue transition-colors">
          <BarChart3 size={24} />
        </button>
        <button className="text-white/40 hover:text-degen-blue transition-colors">
          <Settings size={24} />
        </button>
      </nav>

      {/* Global Overlay Effects */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05)_0%,transparent_70%)]" />
      </div>
    </div>
  );
}
