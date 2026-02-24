import React, { useState, useEffect } from "react";
import { Market } from "../services/marketService";
import { generateMarketVisual } from "../services/visualService";
import { TrendingUp, Info, Check, X } from "lucide-react";
import { motion, useMotionValue, useTransform } from "motion/react";

interface MarketCardProps {
  market: Market;
  isActive: boolean;
}

/**
 * Individual market card for the vertical feed
 * Handles swipe gestures and background visual loading
 */
export const MarketCard: React.FC<MarketCardProps> = ({ market, isActive }) => {
  const [visual, setVisual] = useState<string | null>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  useEffect(() => {
    if (isActive && !visual) {
      const loadVisual = async () => {
        const url = await generateMarketVisual(market.question, market.description);
        setVisual(url || null);
      };
      loadVisual();
    }
  }, [isActive, market, visual]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      // Swipe Right
      console.log("YES SWIPE");
    } else if (info.offset.x < -100) {
      // Swipe Left
      console.log("NO SWIPE");
    }
  };

  const yesPrice = Math.round(parseFloat(market.outcomePrices[0]) * 100);
  const noPrice = 100 - yesPrice;

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, opacity, rotate }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full flex flex-col justify-end p-6 overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {/* Background Visual */}
      <div className="absolute inset-0 z-0">
        {visual ? (
          <img
            src={visual}
            alt="Market Visual"
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-degen-black via-zinc-900 to-degen-black animate-pulse" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-degen-black via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 space-y-6 mb-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-degen-blue text-xs font-mono uppercase tracking-widest">
            <TrendingUp size={14} />
            <span>Trending Market</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tighter uppercase italic">
            {market.question}
          </h1>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-white/50 uppercase">Current Odds</span>
            <div className="flex items-baseline gap-4">
              <div className="flex flex-col">
                <span className="text-5xl font-display font-black text-degen-green neon-glow-green">
                  {yesPrice}%
                </span>
                <span className="text-[10px] font-mono text-degen-green uppercase">Yes</span>
              </div>
              <div className="flex flex-col">
                <span className="text-5xl font-display font-black text-degen-pink neon-glow-pink">
                  {noPrice}%
                </span>
                <span className="text-[10px] font-mono text-degen-pink uppercase">No</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="glass-panel px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-degen-green animate-pulse" />
              <span className="text-[10px] font-mono uppercase">Live Data</span>
            </div>
            <button className="p-3 rounded-full glass-panel hover:bg-white/10 transition-colors">
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Indicators */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-20 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-2 border-degen-pink flex items-center justify-center">
            <X className="text-degen-pink" />
          </div>
          <span className="text-[10px] font-mono uppercase text-degen-pink">Swipe Left</span>
        </div>
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-20 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-2 border-degen-green flex items-center justify-center">
            <Check className="text-degen-green" />
          </div>
          <span className="text-[10px] font-mono uppercase text-degen-green">Swipe Right</span>
        </div>
      </div>
    </motion.div>
  );
};
