import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { blades, rubbers, preAssembledRackets } from "@/data/products";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import { ProductFilter, type ProductFilters } from "./ProductFilter";
import { Info, BarChart3, ChevronUp, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ComponentStatsCard from "./ComponentStatsCard";

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
  selectedForehandThickness: string;
  selectedBackhandThickness: string;
  onGripChange: (grip: string) => void;
  onForehandThicknessChange: (thickness: string) => void;
  onBackhandThicknessChange: (thickness: string) => void;
  forehandFilters: ProductFilters;
  bladeFilters: ProductFilters;
  backhandFilters: ProductFilters;
  onForehandFiltersChange: (filters: ProductFilters) => void;
  onBladeFiltersChange: (filters: ProductFilters) => void;
  onBackhandFiltersChange: (filters: ProductFilters) => void;
  forehandFilterOpen: boolean;
  bladeFilterOpen: boolean;
  backhandFilterOpen: boolean;
  onForehandFilterOpenChange: (open: boolean) => void;
  onBladeFilterOpenChange: (open: boolean) => void;
  onBackhandFilterOpenChange: (open: boolean) => void;
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
  selectedForehandThickness,
  selectedBackhandThickness,
  onGripChange,
  onForehandThicknessChange,
  onBackhandThicknessChange,
  forehandFilters,
  bladeFilters,
  backhandFilters,
  onForehandFiltersChange,
  onBladeFiltersChange,
  onBackhandFiltersChange,
  forehandFilterOpen,
  bladeFilterOpen,
  backhandFilterOpen,
  onForehandFilterOpenChange,
  onBladeFilterOpenChange,
  onBackhandFilterOpenChange,
}: SlotMachineProps) => {
  const [forehandSpinKey, setForehandSpinKey] = useState(0);
  const [bladeSpinKey, setBladeSpinKey] = useState(0);
  const [backhandSpinKey, setBackhandSpinKey] = useState(0);
  const [showForehandStats, setShowForehandStats] = useState(false);
  const [showBladeStats, setShowBladeStats] = useState(false);
  const [showBackhandStats, setShowBackhandStats] = useState(false);

  // Helper function to extract brand from product name
  const extractBrand = (productName: string): string => {
    const name = productName.toUpperCase();
    if (name.startsWith('BUTTERFLY')) return 'Butterfly';
    if (name.startsWith('JOOLA')) return 'JOOLA';
    if (name.startsWith('ANDRO')) return 'ANDRO';
    if (name.startsWith('DHS')) return 'DHS';
    return 'Other';
  };

  // Filter products based on filters
  const filterBlades = (filters: ProductFilters) => {
    return blades.filter(blade => {
      if (blade.Blade_Price > filters.maxPrice) return false;
      if (!filters.level.includes("All") && !filters.level.includes(blade.Blade_Level)) return false;
      if (!filters.style.includes("All") && !filters.style.includes(blade.Blade_Style)) return false;
      if (filters.gripType && filters.gripType !== "All") {
        if (!blade.Blade_Grip || !blade.Blade_Grip.includes(filters.gripType)) return false;
      }
      if (filters.brand && !filters.brand.includes("All")) {
        if (!filters.brand.includes(extractBrand(blade.Blade_Name))) return false;
      }
      return true;
    });
  };

  const filterRubbers = (filters: ProductFilters) => {
    return rubbers.filter(rubber => {
      if (rubber.Rubber_Price > filters.maxPrice) return false;
      if (!filters.level.includes("All") && !filters.level.includes(rubber.Rubber_Level)) return false;
      if (!filters.style.includes("All") && !filters.style.includes(rubber.Rubber_Style)) return false;
      if (filters.spongeSize && filters.spongeSize !== "All") {
        if (!rubber.Rubber_Sponge_Sizes || !rubber.Rubber_Sponge_Sizes.includes(filters.spongeSize)) return false;
      }
      if (filters.brand && !filters.brand.includes("All")) {
        if (!filters.brand.includes(extractBrand(rubber.Rubber_Name))) return false;
      }
      return true;
    });
  };

  const filteredBlades = filterBlades(bladeFilters);
  const filteredForehandRubbers = filterRubbers(forehandFilters);
  const filteredBackhandRubbers = filterRubbers(backhandFilters);

  // Ensure we always have at least one item in each array to prevent crashes
  const safeFilteredBlades = filteredBlades.length > 0 ? filteredBlades : blades;
  const safeFilteredForehandRubbers = filteredForehandRubbers.length > 0 ? filteredForehandRubbers : rubbers;
  const safeFilteredBackhandRubbers = filteredBackhandRubbers.length > 0 ? filteredBackhandRubbers : rubbers;

  useEffect(() => {
    if (spinTrigger > 0) {
      handleSpin();
    }
  }, [spinTrigger]);

  const handleSpin = async () => {
    if (isPreassembled) {
      setForehandSpinKey(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const randomRacket = preAssembledRackets[Math.floor(Math.random() * preAssembledRackets.length)];
      onRacketChange(randomRacket);
    } else {
      // Trigger all wheels to start spinning with their animation keys
      setForehandSpinKey(prev => prev + 1);
      setTimeout(() => setBladeSpinKey(prev => prev + 1), 1500);
      setTimeout(() => setBackhandSpinKey(prev => prev + 1), 3500);

      // Update products at the end of each wheel's spin
      setTimeout(() => {
        if (safeFilteredForehandRubbers.length > 0) {
          const randomForehand = safeFilteredForehandRubbers[Math.floor(Math.random() * safeFilteredForehandRubbers.length)];
          onForehandChange(randomForehand);
          if (randomForehand.Rubber_Sponge_Sizes && randomForehand.Rubber_Sponge_Sizes.length > 0) {
            const randomThickness = randomForehand.Rubber_Sponge_Sizes[Math.floor(Math.random() * randomForehand.Rubber_Sponge_Sizes.length)];
            onForehandThicknessChange(randomThickness);
          }
        }
      }, 1500);

      setTimeout(() => {
        if (safeFilteredBlades.length > 0) {
          const randomBlade = safeFilteredBlades[Math.floor(Math.random() * safeFilteredBlades.length)];
          onBladeChange(randomBlade);
          if (randomBlade.Blade_Grip && randomBlade.Blade_Grip.length > 0) {
            const randomGrip = randomBlade.Blade_Grip[Math.floor(Math.random() * randomBlade.Blade_Grip.length)];
            onGripChange(randomGrip);
          }
        }
      }, 3500);

      setTimeout(() => {
        if (safeFilteredBackhandRubbers.length > 0) {
          const randomBackhand = safeFilteredBackhandRubbers[Math.floor(Math.random() * safeFilteredBackhandRubbers.length)];
          onBackhandChange(randomBackhand);
          if (randomBackhand.Rubber_Sponge_Sizes && randomBackhand.Rubber_Sponge_Sizes.length > 0) {
            const randomThickness = randomBackhand.Rubber_Sponge_Sizes[Math.floor(Math.random() * randomBackhand.Rubber_Sponge_Sizes.length)];
            onBackhandThicknessChange(randomThickness);
          }
        }
      }, 6000);

      await new Promise(resolve => setTimeout(resolve, 6000));
    }
  };

  const SlotWheel = ({ 
    items, 
    selected, 
    onChange, 
    label,
    delay = 0,
    selectorComponent,
    filterComponent,
    filters,
    allItems
  }: { 
    items: any[]; 
    selected: any; 
    onChange: (item: any) => void; 
    label: string;
    delay?: number;
    selectorComponent?: React.ReactNode;
    filterComponent?: React.ReactNode;
    filters?: ProductFilters;
    allItems?: any[];
  }) => {
    const getName = (item: any) => {
      return item.Blade_Name || item.Rubber_Name || item.Racket_Name;
    };

    // Check if selected item matches current filters
    const isSelectedAvailable = () => {
      if (!filters || !allItems) return true;
      return items.some(item => getName(item) === getName(selected));
    };

    // Generate explanation for unavailable item
    const getUnavailabilityReason = () => {
      if (!filters || !selected) return "";
      const reasons = [];
      
      if (selected.Blade_Price > filters.maxPrice || selected.Rubber_Price > filters.maxPrice) {
        reasons.push(`Price exceeds your max budget of $${filters.maxPrice === 999999 ? 'unlimited' : filters.maxPrice}`);
      }
      if (!filters.level.includes("All") && (!filters.level.includes(selected.Blade_Level || '') && !filters.level.includes(selected.Rubber_Level || ''))) {
        reasons.push(`Level doesn't match your filter (${filters.level.join(', ')})`);
      }
      if (!filters.style.includes("All") && (!filters.style.includes(selected.Blade_Style || '') && !filters.style.includes(selected.Rubber_Style || ''))) {
        reasons.push(`Style doesn't match your filter (${filters.style.join(', ')})`);
      }

      if (reasons.length === 0) return "";
      
      return `This product is currently filtered out:\n• ${reasons.join('\n• ')}\n\nTo make it available again, adjust the filters above.`;
    };
    
    const [currentIndex, setCurrentIndex] = useState(items.findIndex(item => getName(item) === getName(selected)));
    const [localSpinning, setLocalSpinning] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const wheelRef = useRef<HTMLDivElement>(null);
    const hasSpun = useRef(false);
    const timers = useRef<{ start?: NodeJS.Timeout; stop?: NodeJS.Timeout }>({});
    const isAnimating = useRef(false);
    const selectedAvailable = isSelectedAvailable();
    const unavailabilityReason = getUnavailabilityReason();

    // Update current index only when not spinning
    useEffect(() => {
      if (!isSpinning) {
        const newIndex = items.findIndex(item => getName(item) === getName(selected));
        setCurrentIndex(newIndex);
      }
    }, [selected, items, isSpinning]);

    // Trigger spin when spinKey changes
    useEffect(() => {
      if (spinKey !== prevSpinKey.current && spinKey > 0) {
        prevSpinKey.current = spinKey;
        setIsSpinning(true);
        
        const timer = setTimeout(() => {
          setIsSpinning(false);
        }, duration * 1000);
        
        return () => clearTimeout(timer);
      }
    }, [spinKey, duration]);

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
      {/* Header with title and filter button */}
        <div className="relative w-full max-w-[280px] md:max-w-[180px] lg:max-w-[240px] xl:max-w-[320px] mb-2 md:mb-3">
          <h3 className="text-base md:text-sm lg:text-base xl:text-lg font-semibold text-foreground tracking-tight text-center">{label}</h3>
          {filterComponent && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {!selectedAvailable && unavailabilityReason && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-destructive hover:text-destructive/80 transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 bg-card border-2 border-destructive/50" align="start">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-destructive flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Product Unavailable
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {unavailabilityReason}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              {filterComponent}
            </div>
          )}
        </div>
        <div
          ref={wheelRef}
          onWheel={handleWheel}
          className={`relative w-full max-w-[280px] md:max-w-[180px] lg:max-w-[240px] xl:max-w-[320px] h-[240px] md:h-[180px] lg:h-[240px] xl:h-[280px] bg-card rounded-xl overflow-hidden shadow-2xl border-2 md:border-3 lg:border-4 ${
            !selectedAvailable ? 'border-destructive/50' : 'border-border'
          } ${!selectedAvailable ? 'opacity-60' : ''}`}
          style={{ perspective: '1000px' }}
        >
          {/* Center highlight */}
          <div className={`absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-20 md:h-16 lg:h-20 xl:h-24 border-y-2 md:border-y-3 lg:border-y-4 ${
            !selectedAvailable ? 'border-destructive/30' : 'border-primary/40'
          } bg-primary/5 z-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]`} />
          
          {/* Top and bottom gradients for depth */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />

          {/* Items container */}
          <div className="relative h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {isSpinning ? (
                <motion.div
                  key={spinKey}
                  className="absolute inset-0 overflow-hidden"
                  style={{ willChange: 'transform' }}
                >
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ y: 140 }}
                    animate={{ 
                      y: -3600,
                    }}
                    transition={{
                      duration: duration,
                      ease: [0.33, 1, 0.68, 1],
                      type: "tween"
                    }}
                    style={{ 
                      willChange: 'transform'
                    }}
                  >
                    {/* Generate enough items for smooth scrolling */}
                    {Array.from({ length: 50 }).map((_, i) => {
                      const itemIndex = i % items.length;
                      
                      return (
                        <motion.div
                          key={`spin-${i}`}
                          className="h-20 md:h-16 lg:h-20 xl:h-24 w-full flex items-center justify-center px-4 md:px-3 lg:px-6 xl:px-8 flex-shrink-0 border-b border-border/20"
                          style={{ 
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'hidden',
                          }}
                        >
                          <p className="text-sm md:text-xs lg:text-sm xl:text-base font-semibold text-foreground text-center line-clamp-3">
                            {getName(items[itemIndex])}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
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
                    const yPos = offset * 64 - 40; // 64px spacing between items for smaller wheels, shifted up 40px
                    const rotateX = offset === 0 ? 0 : offset * 8; // 3D tilt effect

                    return (
                      <motion.div
                        key={`${getName(item)}-${idx}`}
                        initial={{ y: yPos, opacity, scale }}
                        animate={{ y: yPos, opacity, scale }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                          mass: 0.8,
                        }}
                        className="absolute left-0 right-0 h-20 md:h-16 lg:h-20 xl:h-24 flex items-center justify-center px-4 md:px-3 lg:px-6 xl:px-8"
                        style={{
                          top: '50%',
                          transform: `translateY(calc(-50% + ${yPos}px)) scale(${scale}) rotateX(${rotateX}deg)`,
                          opacity,
                          transformStyle: 'preserve-3d',
                          backfaceVisibility: 'hidden',
                          willChange: 'transform, opacity',
                        }}
                        onClick={() => offset !== 0 && onChange(item)}
                      >
                        <div className="flex items-center gap-2">
                          <p 
                            className={`text-center line-clamp-3 transition-colors cursor-pointer ${
                              offset === 0 
                                ? !selectedAvailable 
                                  ? 'text-destructive text-base md:text-sm lg:text-base xl:text-lg font-bold line-through opacity-70' 
                                  : 'text-foreground text-base md:text-sm lg:text-base xl:text-lg font-bold'
                                : 'text-muted-foreground text-xs md:text-[10px] lg:text-xs xl:text-sm font-medium'
                            }`}
                          >
                            {getName(item)}
                          </p>
                          {offset === 0 && (
                            <Popover>
                              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <button className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                                  <Info className="w-4 h-4" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="max-w-xs bg-card border-2 border-border p-4 z-[9999]" side="right" sideOffset={10} align="center">
                                <div className="space-y-2 text-xs">
                                  <h4 className="font-semibold text-sm text-foreground">{getName(item)}</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {item.Blade_Speed !== undefined && (
                                      <>
                                        <div><span className="text-muted-foreground">Speed:</span> <span className="font-medium">{item.Blade_Speed}</span></div>
                                        <div><span className="text-muted-foreground">Spin:</span> <span className="font-medium">{item.Blade_Spin}</span></div>
                                        <div><span className="text-muted-foreground">Control:</span> <span className="font-medium">{item.Blade_Control}</span></div>
                                        <div><span className="text-muted-foreground">Power:</span> <span className="font-medium">{item.Blade_Power}</span></div>
                                        <div><span className="text-muted-foreground">Price:</span> <span className="font-medium">${item.Blade_Price}</span></div>
                                        <div><span className="text-muted-foreground">Level:</span> <span className="font-medium">{item.Blade_Level}</span></div>
                                        {item.Blade_Style && <div className="col-span-2"><span className="text-muted-foreground">Style:</span> <span className="font-medium">{item.Blade_Style}</span></div>}
                                        {item.Blade_Weight && <div className="col-span-2"><span className="text-muted-foreground">Weight:</span> <span className="font-medium">{item.Blade_Weight}g</span></div>}
                                      </>
                                    )}
                                    {item.Rubber_Speed !== undefined && (
                                      <>
                                        <div><span className="text-muted-foreground">Speed:</span> <span className="font-medium">{item.Rubber_Speed}</span></div>
                                        <div><span className="text-muted-foreground">Spin:</span> <span className="font-medium">{item.Rubber_Spin}</span></div>
                                        <div><span className="text-muted-foreground">Control:</span> <span className="font-medium">{item.Rubber_Control}</span></div>
                                        <div><span className="text-muted-foreground">Power:</span> <span className="font-medium">{item.Rubber_Power}</span></div>
                                        <div><span className="text-muted-foreground">Price:</span> <span className="font-medium">${item.Rubber_Price}</span></div>
                                        <div><span className="text-muted-foreground">Level:</span> <span className="font-medium">{item.Rubber_Level}</span></div>
                                        <div className="col-span-2"><span className="text-muted-foreground">Style:</span> <span className="font-medium">{item.Rubber_Style}</span></div>
                                        {item.Rubber_Weight && <div className="col-span-2"><span className="text-muted-foreground">Weight:</span> <span className="font-medium">{item.Rubber_Weight}g</span></div>}
                                        {item.Rubber_Sponge_Sizes && <div className="col-span-2"><span className="text-muted-foreground">Sponge:</span> <span className="font-medium">{item.Rubber_Sponge_Sizes.join(", ")}</span></div>}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Swipe buttons */}
          <button
            onClick={() => handleSwipe('up')}
            disabled={isSpinning}
            className="absolute top-4 left-1/2 -translate-x-1/2 text-foreground hover:text-primary disabled:opacity-30 transition-colors z-20 bg-card/90 backdrop-blur-sm border-2 border-border rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110"
            aria-label="Previous item"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => handleSwipe('down')}
            disabled={isSpinning}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground hover:text-primary disabled:opacity-30 transition-colors z-20 bg-card/90 backdrop-blur-sm border-2 border-border rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110"
            aria-label="Next item"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
        
        {/* Selector below wheel */}
        {selectorComponent && (
          <div className="mt-4">
            {selectorComponent}
          </div>
        )}
      </div>
    );
  };

  // Selector components
  const GripSelector = () => {
    const availableGrips = selectedBlade.Blade_Grip || [];
    return (
      <div className="bg-card p-2 rounded-lg border border-border">
        <p className="text-xs font-medium mb-1.5 text-center text-muted-foreground">Grip Type</p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {availableGrips.map((gripType) => (
            <button
              key={gripType}
              onClick={() => onGripChange(gripType)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedGrip === gripType
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {gripType}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const SpongeSelector = ({ rubber, selectedThickness, onChange }: { rubber: Rubber; selectedThickness: string; onChange: (thickness: string) => void }) => {
    const availableSponges = rubber.Rubber_Sponge_Sizes || [];
    return (
      <div className="bg-card p-2 rounded-lg border border-border">
        <p className="text-xs font-medium mb-1.5 text-center text-muted-foreground">Sponge Size</p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {availableSponges.map((size) => (
            <button
              key={size}
              onClick={() => onChange(size)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedThickness === size
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {isPreassembled ? (
        <div className="flex justify-center py-8">
          <div className="w-full max-w-[1000px]">
            <SlotWheel
              items={preAssembledRackets}
              selected={selectedRacket}
              onChange={onRacketChange}
              label="Preassembled Racket"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 lg:gap-6 justify-items-center py-8 max-w-7xl mx-auto px-2">
          <div className="w-full max-w-[280px] md:max-w-[180px] lg:max-w-[240px] xl:max-w-md">
            <SlotWheel
              items={safeFilteredForehandRubbers}
              selected={selectedForehand}
              onChange={onForehandChange}
              label="Forehand Rubber"
              delay={0}
              filters={forehandFilters}
              allItems={rubbers}
              filterComponent={
                <ProductFilter
                  filters={forehandFilters}
                  onFiltersChange={onForehandFiltersChange}
                  type="rubber"
                  title="Forehand Rubber"
                  open={forehandFilterOpen}
                  onOpenChange={onForehandFilterOpenChange}
                />
              }
            />
            <div className="mt-2">
              <Button
                onClick={() => setShowForehandStats(!showForehandStats)}
                size="sm"
                variant="outline"
                className="w-full border-2 border-border hover:bg-secondary"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showForehandStats ? "Hide Stats" : "View Stats"}
              </Button>
              {showForehandStats && (
                <ComponentStatsCard component={selectedForehand} type="rubber" />
              )}
            </div>
            <div className="mt-2">
              <SpongeSelector 
                rubber={selectedForehand} 
                selectedThickness={selectedForehandThickness} 
                onChange={onForehandThicknessChange}
              />
            </div>
          </div>
          
          <div className="w-full max-w-[280px] md:max-w-[180px] lg:max-w-[240px] xl:max-w-md">
            <SlotWheel
              items={safeFilteredBlades}
              selected={selectedBlade}
              onChange={onBladeChange}
              label="Blade"
              delay={1500}
              filters={bladeFilters}
              allItems={blades}
              filterComponent={
                <ProductFilter
                  filters={bladeFilters}
                  onFiltersChange={onBladeFiltersChange}
                  type="blade"
                  title="Blade"
                  open={bladeFilterOpen}
                  onOpenChange={onBladeFilterOpenChange}
                />
              }
            />
            <div className="mt-2">
              <Button
                onClick={() => setShowBladeStats(!showBladeStats)}
                size="sm"
                variant="outline"
                className="w-full border-2 border-border hover:bg-secondary"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showBladeStats ? "Hide Stats" : "View Stats"}
              </Button>
              {showBladeStats && (
                <ComponentStatsCard component={selectedBlade} type="blade" />
              )}
            </div>
            <div className="mt-2">
              <GripSelector />
            </div>
          </div>
          
          <div className="w-full max-w-[280px] md:max-w-[180px] lg:max-w-[240px] xl:max-w-md">
            <SlotWheel
              items={safeFilteredBackhandRubbers}
              selected={selectedBackhand}
              onChange={onBackhandChange}
              label="Backhand Rubber"
              delay={3500}
              filters={backhandFilters}
              allItems={rubbers}
              filterComponent={
                <ProductFilter
                  filters={backhandFilters}
                  onFiltersChange={onBackhandFiltersChange}
                  type="rubber"
                  title="Backhand Rubber"
                  open={backhandFilterOpen}
                  onOpenChange={onBackhandFilterOpenChange}
                />
              }
            />
            <div className="mt-2">
              <Button
                onClick={() => setShowBackhandStats(!showBackhandStats)}
                size="sm"
                variant="outline"
                className="w-full border-2 border-border hover:bg-secondary"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showBackhandStats ? "Hide Stats" : "View Stats"}
              </Button>
              {showBackhandStats && (
                <ComponentStatsCard component={selectedBackhand} type="rubber" />
              )}
            </div>
            <div className="mt-2">
              <SpongeSelector 
                rubber={selectedBackhand} 
                selectedThickness={selectedBackhandThickness} 
                onChange={onBackhandThicknessChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
