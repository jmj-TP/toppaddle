import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { blades, rubbers, preAssembledRackets } from "@/data/products";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import { ProductFilter, type ProductFilters } from "./ProductFilter";
import { Info, BarChart3, ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ComponentStatsCard from "./ComponentStatsCard";
import { getProductImage } from "@/utils/addProductImages";

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
  selectedForehandColor: string;
  selectedBackhandColor: string;
  onGripChange: (grip: string) => void;
  onForehandThicknessChange: (thickness: string) => void;
  onBackhandThicknessChange: (thickness: string) => void;
  onForehandColorChange: (color: string) => void;
  onBackhandColorChange: (color: string) => void;
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
  selectedForehandColor,
  selectedBackhandColor,
  onGripChange,
  onForehandThicknessChange,
  onBackhandThicknessChange,
  onForehandColorChange,
  onBackhandColorChange,
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
  const [isSpinning, setIsSpinning] = useState(false);
  const [showForehandStats, setShowForehandStats] = useState(false);
  const [showBladeStats, setShowBladeStats] = useState(false);
  const [showBackhandStats, setShowBackhandStats] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track window resize for responsive opacity
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setIsSpinning(true);

    if (isPreassembled) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const randomRacket = preAssembledRackets[Math.floor(Math.random() * preAssembledRackets.length)];
      onRacketChange(randomRacket);
    } else {
      // First wheel stops at 2000ms
      setTimeout(() => {
        if (safeFilteredForehandRubbers.length > 0) {
          const randomForehand = safeFilteredForehandRubbers[Math.floor(Math.random() * safeFilteredForehandRubbers.length)];
          onForehandChange(randomForehand);
          // Randomly select sponge size for forehand
          if (randomForehand.Rubber_Sponge_Sizes && randomForehand.Rubber_Sponge_Sizes.length > 0) {
            const randomThickness = randomForehand.Rubber_Sponge_Sizes[Math.floor(Math.random() * randomForehand.Rubber_Sponge_Sizes.length)];
            onForehandThicknessChange(randomThickness);
          }
        }
      }, 2000);

      // Second wheel stops at 3000ms (1 second after first)
      setTimeout(() => {
        if (safeFilteredBlades.length > 0) {
          const randomBlade = safeFilteredBlades[Math.floor(Math.random() * safeFilteredBlades.length)];
          onBladeChange(randomBlade);
          // Randomly select grip type for blade
          if (randomBlade.Blade_Grip && randomBlade.Blade_Grip.length > 0) {
            const randomGrip = randomBlade.Blade_Grip[Math.floor(Math.random() * randomBlade.Blade_Grip.length)];
            onGripChange(randomGrip);
          }
        }
      }, 3000);

      // Third wheel stops at 4000ms (1 second after second)
      setTimeout(() => {
        if (safeFilteredBackhandRubbers.length > 0) {
          const randomBackhand = safeFilteredBackhandRubbers[Math.floor(Math.random() * safeFilteredBackhandRubbers.length)];
          onBackhandChange(randomBackhand);
          // Randomly select sponge size for backhand
          if (randomBackhand.Rubber_Sponge_Sizes && randomBackhand.Rubber_Sponge_Sizes.length > 0) {
            const randomThickness = randomBackhand.Rubber_Sponge_Sizes[Math.floor(Math.random() * randomBackhand.Rubber_Sponge_Sizes.length)];
            onBackhandThicknessChange(randomThickness);
          }
        }
      }, 4000);

      await new Promise(resolve => setTimeout(resolve, 4200));
    }

    setIsSpinning(false);
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
    allItems: allItemsProp,
    rotationOffset = 0,
    wheelType = 'middle'
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
    rotationOffset?: number;
    wheelType?: 'side' | 'middle';
  }) => {
    const getName = (item: any) => {
      return item.Blade_Name || item.Rubber_Name || item.Racket_Name;
    };

    const getImage = (item: any) => {
      if (item.Blade_Name) return getProductImage(item, 'blade');
      if (item.Rubber_Name) return getProductImage(item, 'rubber');
      if (item.Racket_Name) return getProductImage(item, 'racket');
      return getProductImage(item, 'blade');
    };

    // Check if selected item matches current filters
    const isSelectedAvailable = () => {
      if (!filters || !allItemsProp) return true;
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
    
    const safeItems = items.length > 0 ? items : [selected];
    const [currentIndex, setCurrentIndex] = useState(() => {
      const idx = safeItems.findIndex(item => getName(item) === getName(selected));
      return idx >= 0 ? idx : 0;
    });
    const [localSpinning, setLocalSpinning] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const wheelRef = useRef<HTMLDivElement>(null);
    const hasSpun = useRef(false);
    const lastSelectedName = useRef(getName(selected));
    const selectedAvailable = isSelectedAvailable();
    const unavailabilityReason = getUnavailabilityReason();

    // Update current index only when selected actually changed for THIS wheel
    useEffect(() => {
      const currentName = getName(selected);
      if (!localSpinning && currentName !== lastSelectedName.current) {
        const newIndex = safeItems.findIndex(item => getName(item) === currentName);
        if (newIndex >= 0) {
          setCurrentIndex(newIndex);
          lastSelectedName.current = currentName;
        }
      }
    }, [selected, localSpinning]);

    // Start spinning only once when isSpinning becomes true
    useEffect(() => {
      if (isSpinning && !hasSpun.current) {
        hasSpun.current = true;
        setLocalSpinning(true);
        setAnimationKey(prev => prev + 1);
        
        // Stop spinning after animation completes (2000ms base + delay)
        const timer = setTimeout(() => {
          setLocalSpinning(false);
        }, 2000 + delay);
        
        return () => clearTimeout(timer);
      }
      
      // Reset ref when spinning stops
      if (!isSpinning) {
        hasSpun.current = false;
      }
    }, [isSpinning, delay]);

    const handleWheel = (e: React.WheelEvent) => {
      if (localSpinning) return;
      e.preventDefault();
      e.stopPropagation();
      
      const delta = e.deltaY;
      const newIndex = delta > 0 
        ? (currentIndex + 1) % safeItems.length
        : (currentIndex - 1 + safeItems.length) % safeItems.length;
      
      onChange(safeItems[newIndex]);
    };

    const handleSwipe = (direction: 'up' | 'down') => {
      if (localSpinning) return;
      
      const newIndex = direction === 'down'
        ? (currentIndex + 1) % safeItems.length
        : (currentIndex - 1 + safeItems.length) % safeItems.length;
      
      onChange(safeItems[newIndex]);
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

    // Wheel 3D parameters
    const radius = 800; // Large radius for subtle curve
    const itemHeight = 200; // Height of each item slot (including gap)
    const totalItems = safeItems.length * 3; // Replicate items for smooth infinite scroll
    const allItems = Array.from({ length: 3 }, () => safeItems).flat();

    // Calculate angle per item
    const anglePerItem = (itemHeight / radius) * (180 / Math.PI);

    return (
      <div className="flex flex-col items-center">
      {/* Header with title and filter button */}
        <div className="relative w-full max-w-[380px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[500px] mb-2 md:mb-3">
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
          className={`relative w-full max-w-[380px] md:max-w-[300px] lg:max-w-[320px] xl:max-w-[380px] h-[500px] md:h-[480px] lg:h-[520px] bg-card rounded-xl overflow-hidden shadow-2xl border-2 ${
            !selectedAvailable ? 'border-destructive/50' : 'border-border'
          } ${!selectedAvailable ? 'opacity-60' : ''}`}
          style={{ 
            perspective: '2400px',
            perspectiveOrigin: 'center center'
          }}
        >

          {/* Items container with 3D transforms */}
          <div className="relative h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {localSpinning ? (
                <motion.div
                  key={animationKey}
                  className="absolute inset-0"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    willChange: 'transform'
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ 
                      transformStyle: 'preserve-3d',
                    }}
                    initial={{ rotateX: 0 }}
                    animate={{ 
                      rotateX: 360 * 10 + rotationOffset, // Multiple full rotations
                    }}
                    transition={{
                      duration: (2000 + delay) / 1000,
                      ease: [0.22, 0.61, 0.36, 1],
                      type: "tween"
                    }}
                  >
                    {/* Generate items positioned on cylinder */}
                    {Array.from({ length: 50 }).map((_, i) => {
                      const itemIndex = i % safeItems.length;
                      const angle = i * anglePerItem;
                      const rotateX = angle;
                      const translateZ = radius;
                      
                      return (
                        <div
                          key={`spin-${i}`}
                          className="absolute left-0 right-0 flex flex-col items-center"
                          style={{
                            height: `${itemHeight}px`,
                            top: wheelType === 'side' ? 'calc(50% - 85px)' : 'calc(50% + 85px)',
                            transform: `translateY(-50%) rotateX(${rotateX}deg) translateZ(${translateZ}px)`,
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'hidden',
                          }}
                        >
                          <div className="w-full flex flex-col items-center justify-center px-3 py-3">
                            <div className="relative w-full mx-auto h-28 flex-shrink-0 rounded-lg overflow-hidden bg-background border border-border">
                              <img 
                                src={getImage(safeItems[itemIndex])} 
                                alt={getName(safeItems[itemIndex])}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs font-medium text-primary dark:text-accent truncate w-full text-center mt-2 px-2 block">
                              {getName(safeItems[itemIndex])}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              ) : (
                <div 
                  className="absolute inset-0" 
                  key="static"
                  style={{ 
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ 
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{ 
                      rotateX: -currentIndex * anglePerItem + rotationOffset
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    {/* Generate items positioned on cylinder */}
                    {allItems.map((item, i) => {
                      const angle = i * anglePerItem;
                      const rotateX = angle;
                      const translateZ = radius;
                      
                      // Determine if this is the centered item
                      const isCentered = i === currentIndex + safeItems.length;
                      const isAdjacent = Math.abs(i - (currentIndex + safeItems.length)) === 1;
                      const isAboveCenter = i < currentIndex + safeItems.length;
                      
                      return (
                        <div
                          key={`item-${i}`}
                          className="absolute left-0 right-0 flex flex-col items-center"
                          style={{
                            height: `${itemHeight}px`,
                            top: wheelType === 'side' ? 'calc(50% - 85px)' : 'calc(50% + 85px)',
                            transform: `translateY(-50%) rotateX(${rotateX}deg) translateZ(${translateZ}px)`,
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'hidden',
                            opacity: isCentered ? 1 : isAdjacent ? 0.3 : 0,
                            pointerEvents: isCentered ? 'auto' : 'none',
                          }}
                        >
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className={`relative mx-auto rounded-lg overflow-hidden bg-background ${
                              isCentered 
                                ? 'w-[calc(100%-24px)] h-[360px] md:h-[340px] lg:h-[380px] border-2 border-border shadow-lg' 
                                : 'w-[calc(100%-24px)] h-20 border border-border'
                            }`}>
                              <img 
                                src={getImage(item)} 
                                alt={getName(item)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {isCentered && (
                              <div className="flex items-center gap-2 mt-3 px-3 w-full justify-center">
                                <span className="text-sm md:text-base font-semibold text-primary dark:text-accent text-center line-clamp-2">
                                  {getName(item)}
                                </span>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                                      <Info className="w-4 h-4" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="max-w-[280px] sm:max-w-xs bg-card border-2 border-border p-4 z-[9999]" side="right" sideOffset={10} align="center">
...
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                            {!isCentered && (
                              <span className="text-xs font-medium text-primary dark:text-accent truncate w-full text-center mt-2 px-2 block">
                                {getName(item)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Scroll buttons - smaller and minimalistic */}
          <button
            onClick={() => handleSwipe('up')}
            disabled={localSpinning}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-card/80 hover:bg-card border border-border disabled:opacity-30 disabled:cursor-not-allowed text-foreground rounded-full shadow-md transition-all hover:scale-110 disabled:hover:scale-100 w-6 h-6 flex items-center justify-center backdrop-blur-sm"
            aria-label="Previous item"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          
          <button
            onClick={() => handleSwipe('down')}
            disabled={localSpinning}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 bg-card/80 hover:bg-card border border-border disabled:opacity-30 disabled:cursor-not-allowed text-foreground rounded-full shadow-md transition-all hover:scale-110 disabled:hover:scale-100 w-6 h-6 flex items-center justify-center backdrop-blur-sm"
            aria-label="Next item"
          >
            <ChevronDown className="w-3 h-3" />
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
    const [isOpen, setIsOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const availableGrips = selectedBlade.Blade_Grip || [];
    
    const gripDescriptions = {
      'FL': 'Flared (FL): The most popular grip. Widens at the end for a secure hold and comfortable control.',
      'ST': 'Straight (ST): Uniform thickness throughout. Allows quick grip changes and flexible wrist movement.',
      'AN': 'Anatomic (AN): Ergonomically shaped to fit your hand naturally. Maximum comfort for long sessions.',
      'CS': 'Chinese Penhold (CS): Traditional Asian style with thumb and index finger grip on one side.'
    };
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between border-border hover:bg-secondary"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">
                {isOpen ? 'Choose Grip Type' : `Grip: ${selectedGrip}`}
              </span>
              <Popover open={infoOpen} onOpenChange={setInfoOpen}>
                <PopoverTrigger asChild>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoOpen(!infoOpen);
                    }}
                    className="inline-flex p-1 hover:bg-secondary rounded-md transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="center"
                  className="w-[90vw] max-w-sm p-4 bg-card border-2 border-border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-foreground text-sm">Grip Types:</p>
                    {Object.entries(gripDescriptions).map(([key, desc]) => (
                      <p key={key} className="text-muted-foreground leading-relaxed">{desc}</p>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-card p-2 mt-2 rounded-lg border border-border">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {availableGrips.map((gripType) => (
                <button
                  key={gripType}
                  onClick={() => {
                    onGripChange(gripType);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedGrip === gripType
                      ? 'bg-primary text-primary-foreground shadow-lg border-2 border-primary/50'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70 border-2 border-transparent'
                  }`}
                >
                  {gripType}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const SpongeSelector = ({ rubber, selectedThickness, onChange }: { rubber: Rubber; selectedThickness: string; onChange: (thickness: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const availableSponges = rubber.Rubber_Sponge_Sizes || [];
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between border-border hover:bg-secondary"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">
                {isOpen ? 'Choose Sponge Size' : `Sponge: ${selectedThickness}`}
              </span>
              <Popover open={infoOpen} onOpenChange={setInfoOpen}>
                <PopoverTrigger asChild>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoOpen(!infoOpen);
                    }}
                    className="inline-flex p-1 hover:bg-secondary rounded-md transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="center"
                  className="w-[90vw] max-w-sm p-4 bg-card border-2 border-border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-foreground text-sm">Sponge Size Impact:</p>
                    <p className="text-muted-foreground leading-relaxed"><strong className="text-foreground">Thinner (&lt;1.8mm):</strong> More control, better feel. Less speed and power. Ideal for defensive play.</p>
                    <p className="text-muted-foreground leading-relaxed"><strong className="text-foreground">Medium (1.8-2.0mm):</strong> Balanced performance. Good mix of control, speed, and spin for all-around play.</p>
                    <p className="text-muted-foreground leading-relaxed"><strong className="text-foreground">Thicker (&gt;2.0mm):</strong> Maximum speed and power. Less control. Best for aggressive offensive play.</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-card p-2 mt-2 rounded-lg border border-border">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {availableSponges.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    onChange(size);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedThickness === size
                      ? 'bg-primary text-primary-foreground shadow-lg border-2 border-primary/50'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70 border-2 border-transparent'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const ColorSelector = ({ selectedColor, onChange }: { selectedColor: string; onChange: (color: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const colors = ['Red', 'Black'];
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between border-border hover:bg-secondary"
          >
            <span className="text-xs font-medium">
              {isOpen ? 'Choose Color' : `Color: ${selectedColor}`}
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-card p-2 mt-2 rounded-lg border border-border">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedColor === color
                      ? 'bg-primary text-primary-foreground shadow-lg border-2 border-primary/50'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70 border-2 border-transparent'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
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
              wheelType="middle"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3 lg:gap-6 xl:gap-8 justify-items-center py-8 max-w-7xl mx-auto px-2">
          <div className="w-full max-w-[380px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[500px]">
            <SlotWheel
              items={safeFilteredForehandRubbers}
              selected={selectedForehand}
              onChange={onForehandChange}
              label="Forehand Rubber"
              delay={0}
              filters={forehandFilters}
              rotationOffset={0}
              wheelType="side"
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
            <div className="mt-2 space-y-2">
              <SpongeSelector 
                rubber={selectedForehand} 
                selectedThickness={selectedForehandThickness} 
                onChange={onForehandThicknessChange}
              />
              <ColorSelector 
                selectedColor={selectedForehandColor} 
                onChange={onForehandColorChange}
              />
            </div>
          </div>
          
          <div className="w-full max-w-[380px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[500px]">
            <SlotWheel
              items={safeFilteredBlades}
              selected={selectedBlade}
              onChange={onBladeChange}
              label="Blade"
              rotationOffset={0}
              delay={1000}
              wheelType="middle"
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
          
          <div className="w-full max-w-[380px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[500px]">
            <SlotWheel
              items={safeFilteredBackhandRubbers}
              selected={selectedBackhand}
              onChange={onBackhandChange}
              label="Backhand Rubber"
              delay={2000}
              rotationOffset={0}
              wheelType="side"
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
            <div className="mt-2 space-y-2">
              <SpongeSelector 
                rubber={selectedBackhand} 
                selectedThickness={selectedBackhandThickness} 
                onChange={onBackhandThicknessChange}
              />
              <ColorSelector 
                selectedColor={selectedBackhandColor} 
                onChange={onBackhandColorChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
