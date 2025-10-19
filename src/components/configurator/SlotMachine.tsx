import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { blades, rubbers, preAssembledRackets } from "@/data/products";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";

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
  selectedGrip: string;
  selectedThickness: string;
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
  selectedGrip,
  selectedThickness,
}: SlotMachineProps) => {
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (spinTrigger > 0) {
      handleSpin();
    }
  }, [spinTrigger]);

  const handleSpin = async () => {
    setIsSpinning(true);

    if (isPreassembled) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const randomRacket = preAssembledRackets[Math.floor(Math.random() * preAssembledRackets.length)];
      onRacketChange(randomRacket);
    } else {
      // Staggered spin completion
      setTimeout(() => {
        const randomForehand = rubbers[Math.floor(Math.random() * rubbers.length)];
        onForehandChange(randomForehand);
      }, 1200);

      setTimeout(() => {
        const randomBlade = blades[Math.floor(Math.random() * blades.length)];
        onBladeChange(randomBlade);
      }, 1800);

      setTimeout(() => {
        const randomBackhand = rubbers[Math.floor(Math.random() * rubbers.length)];
        onBackhandChange(randomBackhand);
      }, 2400);

      await new Promise(resolve => setTimeout(resolve, 2600));
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
    const [localSpinning, setLocalSpinning] = useState(false);
    const wheelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const newIndex = items.findIndex(item => getName(item) === getName(selected));
      setCurrentIndex(newIndex);
    }, [selected, items]);

    useEffect(() => {
      if (isSpinning) {
        setLocalSpinning(true);
        setTimeout(() => {
          setLocalSpinning(false);
        }, delay);
      }
    }, [isSpinning, delay]);

    const handleWheel = (e: React.WheelEvent) => {
      if (isSpinning) return;
      e.preventDefault();
      
      const delta = e.deltaY;
      const newIndex = delta > 0 
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;
      
      onChange(items[newIndex]);
    };

    const handleSwipe = (direction: 'up' | 'down') => {
      if (isSpinning) return;
      
      const newIndex = direction === 'down'
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;
      
      onChange(items[newIndex]);
    };

    // Get visible items (current, prev, next with wrapping)
    const getVisibleItems = () => {
      const visible = [];
      for (let i = -2; i <= 2; i++) {
        const index = (currentIndex + i + items.length) % items.length;
        visible.push({ item: items[index], offset: i });
      }
      return visible;
    };

    return (
      <div className="flex flex-col items-center">
        <div className="mb-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        </div>
        
        <div 
          ref={wheelRef}
          onWheel={handleWheel}
          className="relative w-64 h-96 bg-card rounded-2xl overflow-hidden shadow-xl border-2 border-border"
          style={{ perspective: '1000px' }}
        >
          {/* Gradient overlays for fade effect */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
          
          {/* Center highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-24 border-y-2 border-primary/30 bg-primary/5 z-0 pointer-events-none" />

          {/* Items container */}
          <div className="relative h-full flex flex-col items-center justify-center py-8">
            <AnimatePresence mode="wait">
              {localSpinning ? (
                <motion.div
                  key="spinning"
                  className="absolute inset-0 flex flex-col items-center justify-start overflow-hidden"
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -100 }}
                      animate={{ y: 2000 }}
                      transition={{
                        duration: 2,
                        ease: [0.22, 1, 0.36, 1],
                        delay: delay / 1000,
                      }}
                      className="h-20 w-full flex items-center justify-center px-6"
                    >
                      <p className="text-sm font-medium text-foreground text-center line-clamp-2">
                        {getName(items[i % items.length])}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="static"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {getVisibleItems().map(({ item, offset }, idx) => {
                    const distance = Math.abs(offset);
                    const opacity = offset === 0 ? 1 : Math.max(0.2, 1 - distance * 0.3);
                    const scale = offset === 0 ? 1 : Math.max(0.8, 1 - distance * 0.1);
                    const yPos = offset * 80; // 80px spacing between items

                    return (
                      <motion.div
                        key={`${getName(item)}-${idx}`}
                        initial={{ y: yPos, opacity, scale }}
                        animate={{ y: yPos, opacity, scale }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="absolute top-1/2 left-0 right-0 h-20 flex items-center justify-center px-6"
                        style={{
                          transform: `translateY(calc(-50% + ${yPos}px)) scale(${scale})`,
                          opacity,
                        }}
                        onClick={() => offset !== 0 && onChange(item)}
                      >
                        <p 
                          className={`text-sm font-medium text-center line-clamp-2 transition-colors cursor-pointer ${
                            offset === 0 ? 'text-foreground text-base font-semibold' : 'text-muted-foreground'
                          }`}
                        >
                          {getName(item)}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Swipe buttons for mobile */}
          <button
            onClick={() => handleSwipe('up')}
            disabled={isSpinning}
            className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors z-20 bg-card/80 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
            aria-label="Previous item"
          >
            ▲
          </button>
          
          <button
            onClick={() => handleSwipe('down')}
            disabled={isSpinning}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors z-20 bg-card/80 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
            aria-label="Next item"
          >
            ▼
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {isPreassembled ? (
        <div className="flex justify-center py-8">
          <SlotWheel
            items={preAssembledRackets}
            selected={selectedRacket}
            onChange={onRacketChange}
            label="Preassembled Racket"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 justify-items-center py-8 max-w-6xl mx-auto">
          <SlotWheel
            items={rubbers}
            selected={selectedForehand}
            onChange={onForehandChange}
            label="Forehand Rubber"
            delay={0}
          />
          <SlotWheel
            items={blades}
            selected={selectedBlade}
            onChange={onBladeChange}
            label="Blade"
            delay={600}
          />
          <SlotWheel
            items={rubbers}
            selected={selectedBackhand}
            onChange={onBackhandChange}
            label="Backhand Rubber"
            delay={1200}
          />
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
