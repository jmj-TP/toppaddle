import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { blades, rubbers, preAssembledRackets } from "@/data/products";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import ProductInfo from "./ProductInfo";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlotMachineProps {
  isPreassembled: boolean;
  selectedBlade: Blade;
  selectedForehand: Rubber;
  selectedBackhand: Rubber;
  selectedRacket: PreAssembledRacket;
  onBladeChange: (blade: Blade) => void;
  onForehandChange: (rubber: Rubber) => void;
  onBackhandChange: (rubber: Rubber) => void;
  onRacketChange: (racket: PreAssembledRacket) => void;
  spinTrigger: number;
}

const SlotMachine = ({
  isPreassembled,
  selectedBlade,
  selectedForehand,
  selectedBackhand,
  selectedRacket,
  onBladeChange,
  onForehandChange,
  onBackhandChange,
  onRacketChange,
  spinTrigger,
}: SlotMachineProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);

  useEffect(() => {
    if (spinTrigger > 0) {
      handleSpin();
    }
  }, [spinTrigger]);

  const handleSpin = async () => {
    setIsSpinning(true);

    if (isPreassembled) {
      // Random preassembled racket
      await new Promise(resolve => setTimeout(resolve, 1500));
      const randomRacket = preAssembledRackets[Math.floor(Math.random() * preAssembledRackets.length)];
      onRacketChange(randomRacket);
    } else {
      // Spin all three slots with staggered delays
      setTimeout(() => {
        const randomForehand = rubbers[Math.floor(Math.random() * rubbers.length)];
        onForehandChange(randomForehand);
      }, 800);

      setTimeout(() => {
        const randomBlade = blades[Math.floor(Math.random() * blades.length)];
        onBladeChange(randomBlade);
      }, 1300);

      setTimeout(() => {
        const randomBackhand = rubbers[Math.floor(Math.random() * rubbers.length)];
        onBackhandChange(randomBackhand);
      }, 1800);

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsSpinning(false);
  };

  const SlotWheel = ({ 
    items, 
    selected, 
    onChange, 
    label,
    delay = 0 
  }: { 
    items: any[]; 
    selected: any; 
    onChange: (item: any) => void; 
    label: string;
    delay?: number;
  }) => {
    const getName = (item: any) => {
      return item.Blade_Name || item.Rubber_Name || item.Racket_Name;
    };
    
    const [currentIndex, setCurrentIndex] = useState(items.findIndex(item => getName(item) === getName(selected)));
    const wheelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const newIndex = items.findIndex(item => getName(item) === getName(selected));
      setCurrentIndex(newIndex);
    }, [selected, items]);

    const handleScroll = (e: React.WheelEvent) => {
      if (isSpinning) return;
      
      e.preventDefault();
      const delta = e.deltaY;
      const newIndex = delta > 0 
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;
      
      onChange(items[newIndex]);
    };

    const handleNext = () => {
      if (isSpinning) return;
      const newIndex = (currentIndex + 1) % items.length;
      onChange(items[newIndex]);
    };

    const handlePrev = () => {
      if (isSpinning) return;
      const newIndex = (currentIndex - 1 + items.length) % items.length;
      onChange(items[newIndex]);
    };

    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-primary mb-2">{label}</h3>
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            disabled={isSpinning}
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl hover:text-accent disabled:opacity-30 transition-colors z-10"
          >
            ▲
          </button>
          
          {/* Slot Window */}
          <div 
            ref={wheelRef}
            onWheel={handleScroll}
            className="relative h-32 w-64 bg-gradient-to-b from-secondary/50 via-card to-secondary/50 rounded-lg border-4 border-primary/20 overflow-hidden shadow-inner"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${getName(selected)}-${isSpinning}`}
                initial={{ y: isSpinning ? -100 : 0, opacity: isSpinning ? 0 : 1 }}
                animate={{ 
                  y: isSpinning ? [0, -300, -600, -900, 0] : 0,
                  opacity: 1,
                  transition: {
                    duration: isSpinning ? 1.5 : 0.3,
                    delay: delay,
                    ease: isSpinning ? [0.34, 1.56, 0.64, 1] : "easeOut"
                  }
                }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-4"
              >
                <div className="text-center">
                  <p className="font-bold text-lg text-foreground leading-tight line-clamp-2">
                    {getName(selected)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${selected.Blade_Price || selected.Rubber_Price || selected.Racket_Price}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Highlight border */}
            <div className="absolute inset-0 border-2 border-accent/50 rounded-lg pointer-events-none" />
          </div>

          <button
            onClick={handleNext}
            disabled={isSpinning}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl hover:text-accent disabled:opacity-30 transition-colors z-10"
          >
            ▼
          </button>

          {/* Info Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo(getName(selected))}
            className="absolute -right-12 top-1/2 -translate-y-1/2"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {isPreassembled ? (
        <div className="flex justify-center">
          <SlotWheel
            items={preAssembledRackets}
            selected={selectedRacket}
            onChange={onRacketChange}
            label="Racket"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 md:gap-4">
          <SlotWheel
            items={rubbers}
            selected={selectedForehand}
            onChange={onForehandChange}
            label="FH Rubber"
            delay={0}
          />
          <SlotWheel
            items={blades}
            selected={selectedBlade}
            onChange={onBladeChange}
            label="Blade"
            delay={0.5}
          />
          <SlotWheel
            items={rubbers}
            selected={selectedBackhand}
            onChange={onBackhandChange}
            label="BH Rubber"
            delay={1}
          />
        </div>
      )}

      {/* Product Info Modal */}
      {showInfo && (
        <ProductInfo
          product={
            isPreassembled
              ? selectedRacket
              : showInfo === selectedBlade.Blade_Name
              ? selectedBlade
              : showInfo === selectedForehand.Rubber_Name
              ? selectedForehand
              : selectedBackhand
          }
          onClose={() => setShowInfo(null)}
        />
      )}
    </div>
  );
};

export default SlotMachine;
