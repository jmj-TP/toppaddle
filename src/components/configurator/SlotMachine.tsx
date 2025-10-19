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
      e.stopPropagation();
      
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
        <div 
          ref={wheelRef}
          onWheel={handleWheel}
          className="relative w-80 h-[500px] bg-gradient-to-br from-purple-200/60 to-purple-300/60 rounded-xl overflow-hidden shadow-2xl border-4 border-black"
          style={{ perspective: '1000px' }}
        >
          {/* Center highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 border-y-4 border-black/20 bg-white/10 z-0 pointer-events-none" />

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
                       className="h-24 w-full flex items-center justify-center px-8"
                    >
                      <p className="text-base font-semibold text-foreground text-center line-clamp-3">
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
                    const opacity = offset === 0 ? 1 : Math.max(0.3, 1 - distance * 0.35);
                    const scale = offset === 0 ? 1.1 : Math.max(0.75, 1 - distance * 0.15);
                    const yPos = offset * 100; // 100px spacing between items
                    const rotateX = offset === 0 ? 0 : offset * 8; // 3D tilt effect

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
                        className="absolute top-1/2 left-0 right-0 h-24 flex items-center justify-center px-8"
                        style={{
                          transform: `translateY(calc(-50% + ${yPos}px)) scale(${scale}) rotateX(${rotateX}deg)`,
                          opacity,
                          transformStyle: 'preserve-3d',
                        }}
                        onClick={() => offset !== 0 && onChange(item)}
                      >
                        <p 
                          className={`text-center line-clamp-3 transition-colors cursor-pointer ${
                            offset === 0 
                              ? 'text-foreground text-lg font-bold' 
                              : 'text-muted-foreground text-sm font-medium'
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
            className="absolute top-20 left-1/2 -translate-x-1/2 text-2xl text-white hover:text-gray-200 disabled:opacity-30 transition-colors z-20 bg-black/20 rounded-full w-12 h-12 flex items-center justify-center"
            aria-label="Previous item"
          >
            ▲
          </button>
          
          <button
            onClick={() => handleSwipe('down')}
            disabled={isSpinning}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 text-2xl text-white hover:text-gray-200 disabled:opacity-30 transition-colors z-20 bg-black/20 rounded-full w-12 h-12 flex items-center justify-center"
            aria-label="Next item"
          >
            ▼
          </button>
        </div>
        
        {/* Label below wheel */}
        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-foreground">
            {label === "Blade" ? `Grip: ${selectedGrip}` : `Sponge Size: ${selectedThickness}`}
          </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center py-8 max-w-7xl mx-auto">
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
