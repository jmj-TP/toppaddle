import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Gauge, Target, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";

interface WheelCardProps {
  type: "forehand" | "blade" | "backhand" | "racket";
  item: Blade | Rubber | PreAssembledRacket | null;
  options: Array<{ label: string; value: string }>;
  onScroll?: (ref: HTMLDivElement) => void;
}

const WheelCard = ({ type, item, options, onScroll }: WheelCardProps) => {
  const [statsExpanded, setStatsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getStats = () => {
    if (!item) return null;
    
    if ('Blade_Speed' in item) {
      return {
        speed: item.Blade_Speed,
        spin: item.Blade_Spin,
        control: item.Blade_Control,
        power: item.Blade_Power,
      };
    } else if ('Rubber_Speed' in item) {
      return {
        speed: item.Rubber_Speed,
        spin: item.Rubber_Spin,
        control: item.Rubber_Control,
        power: item.Rubber_Power,
      };
    } else if ('Racket_Speed' in item) {
      return {
        speed: item.Racket_Speed,
        spin: item.Racket_Spin,
        control: item.Racket_Control,
        power: item.Racket_Power,
      };
    }
    return null;
  };

  const stats = getStats();
  
  const getBrandAndModel = () => {
    if (!item) return { brand: "", model: "" };
    const name = 'Blade_Name' in item ? item.Blade_Name : 
                 'Rubber_Name' in item ? item.Rubber_Name : 
                 'Racket_Name' in item ? item.Racket_Name : "";
    const parts = name.split(" ");
    return { brand: parts[0] || "", model: parts.slice(1).join(" ") };
  };

  const { brand, model } = getBrandAndModel();

  const getLabel = () => {
    switch(type) {
      case "forehand": return "Forehand";
      case "blade": return "Blade";
      case "backhand": return "Backhand";
      case "racket": return "Racket";
    }
  };

  const getTypeLabel = () => {
    switch(type) {
      case "forehand": return "Rubber";
      case "blade": return "Blade";
      case "backhand": return "Rubber";
      case "racket": return "Pre-Assembled";
    }
  };

  useEffect(() => {
    if (onScroll && cardRef.current) {
      onScroll(cardRef.current);
    }
  }, [onScroll]);

  const StatBar = ({ label, value, Icon }: { label: string; value: number; Icon: any }) => (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <span className="text-xs font-medium min-w-[45px] text-foreground">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-1.5">
        <div 
          className="bg-accent rounded-full h-1.5 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold min-w-[22px] text-foreground">{value}</span>
    </div>
  );

  const getStrengthsAndTradeoffs = () => {
    if (!stats) return { strengths: [], tradeoffs: [] };
    
    const entries = Object.entries(stats);
    const sorted = [...entries].sort((a, b) => b[1] - a[1]);
    
    const strengths = sorted.slice(0, 2).map(([key]) => key);
    const tradeoffs = sorted.slice(-1).filter(([_, val]) => val < 70).map(([key]) => key);
    
    return { strengths, tradeoffs };
  };

  const { strengths, tradeoffs } = getStrengthsAndTradeoffs();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Card 
      ref={cardRef}
      id={`wheel-card-${type}`}
      className="relative overflow-hidden bg-card border-2 border-border hover:border-accent/50 transition-all duration-300"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {getLabel()}
            </div>
            <div className="text-sm font-bold text-foreground mt-0.5">
              {getTypeLabel()}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStatsExpanded(!statsExpanded)}
            className="text-xs h-7 px-2 text-accent hover:text-accent/80 hover:bg-accent/10"
            aria-expanded={statsExpanded}
            aria-controls={`stats-${type}`}
          >
            View stats
            {statsExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
          </Button>
        </div>

        {/* Image */}
        <div className="relative aspect-square bg-background rounded-lg overflow-hidden mb-3 border border-border">
          {item && (
            <img 
              src={'Blade_Image' in item ? item.Blade_Image : 
                   'Rubber_Image' in item ? item.Rubber_Image : 
                   'Racket_Image' in item ? item.Racket_Image : 
                   "https://placehold.co/400x400/0D1B2A/FF7A1A?text=Item"}
              alt={brand + " " + model}
              className="w-full h-full object-contain p-4"
            />
          )}
        </div>

        {/* Stats Panel */}
        <AnimatePresence>
          {statsExpanded && stats && (
            <motion.div
              id={`stats-${type}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.25,
                ease: "easeInOut" 
              }}
              className="overflow-hidden mb-3"
            >
              <div className="space-y-2 py-3 px-2 bg-background rounded-lg border border-border">
                <StatBar label="Speed" value={stats.speed} Icon={Gauge} />
                <StatBar label="Spin" value={stats.spin} Icon={Target} />
                <StatBar label="Control" value={stats.control} Icon={Shield} />
                <StatBar label="Power" value={stats.power} Icon={Zap} />
                
                {(strengths.length > 0 || tradeoffs.length > 0) && (
                  <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                    {strengths.length > 0 && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent border-accent/20">
                        Strengths: {strengths.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                      </Badge>
                    )}
                    {tradeoffs.length > 0 && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-muted-foreground/30 text-muted-foreground">
                        Trade-offs: {tradeoffs.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand & Model */}
        <div className="mb-3">
          <div className="text-xs text-muted-foreground">{brand}</div>
          <div className="text-sm font-semibold text-foreground line-clamp-2">{model}</div>
        </div>

        {/* Options Chips */}
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <Badge 
              key={opt.label} 
              variant="outline" 
              className="text-xs px-2 py-0.5 bg-background border-border"
            >
              {opt.value}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WheelCard;
