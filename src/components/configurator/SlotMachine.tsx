import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { slugify } from "@/lib/googleSheets";
import { motion, AnimatePresence } from "framer-motion";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import { ProductFilter, type ProductFilters } from "./ProductFilter";
import { Info, BarChart3, ChevronUp, ChevronDown, ChevronRight, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ComponentStatsCard from "./ComponentStatsCard";
import { getProductImage } from "@/utils/addProductImages";
import Image from "next/image";

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
  allBlades: Blade[];
  allRubbers: Rubber[];
  allRackets: PreAssembledRacket[];
}

const SlotWheel = ({
  items,
  selected,
  onChange,
  label,
  delay = 0,
  selectorComponent,
  filterComponent,
  filters,
  allItems,
  isSpinning
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
  isSpinning?: boolean;
}) => {
  const getName = (item: any) => {
    if (!item) return '';
    return item.Blade_Name || item.Rubber_Name || item.Racket_Name || '';
  };

  const getImage = (item: any) => {
    if (!item) return getProductImage({}, 'blade');
    if (item.Blade_Name) return getProductImage(item, 'blade');
    if (item.Rubber_Name) return getProductImage(item, 'rubber');
    if (item.Racket_Name) return getProductImage(item, 'racket');
    return getProductImage(item, 'blade');
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

    if (selected?.Blade_Price > filters.maxPrice || selected?.Rubber_Price > filters.maxPrice) {
      reasons.push(`Price exceeds your max budget of $${filters.maxPrice === 999999 ? 'unlimited' : filters.maxPrice}`);
    }
    if (!filters.level.includes("All") && (!filters.level.includes(selected?.Blade_Level || '') && !filters.level.includes(selected?.Rubber_Level || ''))) {
      reasons.push(`Level doesn't match your filter (${filters.level.join(', ')})`);
    }
    let bStyle = selected?.Blade_Style || '';
    if (bStyle === 'All-Round') bStyle = 'Allround';

    if (!filters.style.includes("All") && (!filters.style.includes(bStyle) && !filters.style.includes(selected?.Rubber_Style || ''))) {
      reasons.push(`Style doesn't match your filter (${filters.style.join(', ')})`);
    }

    if (reasons.length === 0) return "";

    return `This product is currently filtered out:\n• ${reasons.join('\n• ')}\n\nTo make it available again, adjust the filters above.`;
  };

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = items.findIndex(item => getName(item) === getName(selected));
    return idx >= 0 ? idx : 0;
  });
  const [localSpinning, setLocalSpinning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const hasSpun = useRef(false);
  const selectedAvailable = isSelectedAvailable();
  const unavailabilityReason = getUnavailabilityReason();

  // Attach non-passive wheel listener to prevent page scroll
  useEffect(() => {
    const wheelElement = wheelRef.current;
    if (!wheelElement) return;

    const handleWheelEvent = (e: WheelEvent) => {
      if (isSpinning) return;
      e.preventDefault();

      const delta = e.deltaY;
      const newIndex = delta > 0
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;

      onChange(items[newIndex]);
    };

    wheelElement.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => wheelElement.removeEventListener('wheel', handleWheelEvent);
  }, [isSpinning, items, currentIndex, onChange]);

  // Update current index only when not spinning
  useEffect(() => {
    if (!localSpinning) {
      const newIndex = items.findIndex(item => getName(item) === getName(selected));
      setCurrentIndex(newIndex >= 0 ? newIndex : 0);
    }
  }, [selected, items, localSpinning]);

  // Start spinning only once when isSpinning becomes true
  useEffect(() => {
    if (isSpinning && !hasSpun.current) {
      hasSpun.current = true;
      setLocalSpinning(true);
      setAnimationKey(prev => prev + 1);

      // Stop spinning after animation completes (1000ms base + delay)
      const timer = setTimeout(() => {
        setLocalSpinning(false);
      }, 1000 + delay);

      return () => clearTimeout(timer);
    }

    // Reset ref when spinning stops
    if (!isSpinning) {
      hasSpun.current = false;
    }
  }, [isSpinning, delay]);

  const handleSwipe = (direction: 'up' | 'down') => {
    if (isSpinning) return;

    const newIndex = direction === 'down'
      ? (currentIndex + 1) % items.length
      : (currentIndex - 1 + items.length) % items.length;

    onChange(items[newIndex]);
  };

  // Get visible items (current, prev, next with wrapping)
  const getVisibleItems = () => {
    if (items.length === 0) return [];
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + items.length) % items.length;
      const item = items[index];
      if (item) {
        visible.push({ item, offset: i });
      }
    }
    return visible;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header with title and filter button */}
      <div className="relative w-full max-w-[380px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[500px] mb-2 md:mb-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title={`Search ${label}`}
          >
            <Search className="w-4 h-4" />
          </button>
          <h3 className="text-base md:text-sm lg:text-base xl:text-lg font-semibold text-foreground tracking-tight text-center">{label}</h3>
        </div>
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
        className={`relative w-full max-w-[380px] md:max-w-[300px] lg:max-w-[320px] xl:max-w-[380px] h-[380px] md:h-[360px] lg:h-[400px] bg-card rounded-xl shadow-2xl border-2 ${!selectedAvailable ? 'border-destructive/50' : 'border-border'
          } ${!selectedAvailable ? 'opacity-60' : ''} overflow-hidden`}
      >
        <div className="relative h-full flex flex-col items-center justify-center p-2" style={{ perspective: "1500px" }}>
          <AnimatePresence mode="wait">
            {localSpinning ? (
              <motion.div
                key={animationKey}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 360 * 3 }} // 3 full rapid rotations
                transition={{
                  duration: (1000 + delay) / 1000,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                {items.length > 0 && Array.from({ length: Math.max(12, items.length) }).map((_, i) => {
                  const itemIndex = i % items.length;
                  const totalItems = Math.max(12, items.length);
                  const angle = (360 / totalItems) * i;
                  // Math logic: chord length / (2 * sin(pi / n)). 
                  const radius = 140 / (2 * Math.sin(Math.PI / totalItems));

                  return (
                    <div
                      key={`spin-${i}`}
                      className="absolute w-[calc(100%-40px)] h-[140px] flex flex-col items-center justify-center"
                      style={{
                        transform: `rotateX(${angle}deg) translateZ(${radius}px)`,
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="relative w-full h-[120px] rounded-lg overflow-hidden bg-background border-2 border-border shadow-md flex items-center justify-center pointer-events-none p-2">
                        <img
                          src={getImage(items[itemIndex])}
                          alt={getName(items[itemIndex])}
                          loading="eager"
                          className="w-auto h-full max-h-[100px] object-contain drop-shadow-sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center" key="static" style={{ transformStyle: 'preserve-3d' }}>
                {/* Large centered image */}
                <motion.div
                  className="absolute w-full flex flex-col items-center justify-center px-2.5 z-30 pointer-events-auto"
                  style={{ top: '50%', transform: `translateY(-50%)` }}
                  initial={false}
                  animate={{ y: '-50%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="product-img-wrap relative w-[calc(100%-20px)] h-[280px] md:h-[260px] lg:h-[300px] rounded-xl overflow-hidden bg-background border-2 border-border shadow-2xl">
                    <div className="relative w-full h-full p-3">
                      <Image
                        src={getImage(items[currentIndex])}
                        alt={getName(items[currentIndex])}
                        fill
                        priority
                        unoptimized
                        className={`product-img object-contain ${label.toLowerCase() === 'blade' ? 'pb-16' : ''}`}
                      />
                    </div>
                    {/* Name overlay inside the box */}
                    <div className="absolute bottom-0 left-0 right-0 pt-4 pb-3 px-3 flex items-end justify-between gap-2 overflow-hidden bg-background border-t border-border">
                      <span className="text-base lg:text-lg font-bold text-foreground drop-shadow-sm leading-tight line-clamp-2">
                        {getName(items[currentIndex])}
                      </span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-muted-foreground bg-background/80 hover:text-foreground hover:bg-background transition-colors flex-shrink-0 rounded-full p-1.5 border border-border/50 shadow-sm" aria-label="Product info">
                            <Info className="w-4 h-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-[280px] sm:max-w-xs bg-card border-2 border-border p-4 z-[9999]" side="right" sideOffset={10} align="center">
                          <div className="space-y-2 text-xs">
                            <h4 className="font-semibold text-sm text-foreground break-words">{getName(items[currentIndex])}</h4>
                            {items[currentIndex]?.Blade_Name && (
                              <Link href={`/product/blade/${slugify(items[currentIndex].Blade_Name)}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline" target="_blank">
                                Full specs &amp; reviews <ChevronRight className="w-3 h-3" />
                              </Link>
                            )}
                            {items[currentIndex]?.Rubber_Name && (
                              <Link href={`/product/rubber/${slugify(items[currentIndex].Rubber_Name)}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline" target="_blank">
                                Full specs &amp; reviews <ChevronRight className="w-3 h-3" />
                              </Link>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                              {items[currentIndex]?.Blade_Speed !== undefined && (
                                <>
                                  <div><span className="text-muted-foreground">Speed:</span> <span className="font-medium">{items[currentIndex].Blade_Speed}</span></div>
                                  <div><span className="text-muted-foreground">Spin:</span> <span className="font-medium">{items[currentIndex].Blade_Spin}</span></div>
                                  <div><span className="text-muted-foreground">Control:</span> <span className="font-medium">{items[currentIndex].Blade_Control}</span></div>
                                  <div><span className="text-muted-foreground">Power:</span> <span className="font-medium">{items[currentIndex].Blade_Power}</span></div>
                                  <div><span className="text-muted-foreground">Price:</span> <span className="font-medium">${items[currentIndex].Blade_Price}</span></div>
                                  <div><span className="text-muted-foreground">Level:</span> <span className="font-medium">{items[currentIndex].Blade_Level}</span></div>
                                  {items[currentIndex].Blade_Style && <div className="col-span-2"><span className="text-muted-foreground">Style:</span> <span className="font-medium">{items[currentIndex].Blade_Style}</span></div>}
                                  {items[currentIndex].Blade_Weight && <div className="col-span-2"><span className="text-muted-foreground">Weight:</span> <span className="font-medium">{items[currentIndex].Blade_Weight}g</span></div>}
                                </>
                              )}
                              {items[currentIndex]?.Rubber_Speed !== undefined && (
                                <>
                                  <div><span className="text-muted-foreground">Speed:</span> <span className="font-medium">{items[currentIndex].Rubber_Speed}</span></div>
                                  <div><span className="text-muted-foreground">Spin:</span> <span className="font-medium">{items[currentIndex].Rubber_Spin}</span></div>
                                  <div><span className="text-muted-foreground">Control:</span> <span className="font-medium">{items[currentIndex].Rubber_Control}</span></div>
                                  <div><span className="text-muted-foreground">Power:</span> <span className="font-medium">{items[currentIndex].Rubber_Power}</span></div>
                                  <div><span className="text-muted-foreground">Price:</span> <span className="font-medium">${items[currentIndex].Rubber_Price}</span></div>
                                  <div><span className="text-muted-foreground">Level:</span> <span className="font-medium">{items[currentIndex].Rubber_Level}</span></div>
                                  <div className="col-span-2"><span className="text-muted-foreground">Style:</span> <span className="font-medium">{items[currentIndex].Rubber_Style}</span></div>
                                  {items[currentIndex].Rubber_Weight && <div className="col-span-2"><span className="text-muted-foreground">Weight:</span> <span className="font-medium">{items[currentIndex].Rubber_Weight}g</span></div>}
                                  {items[currentIndex].Rubber_Sponge_Sizes && <div className="col-span-2"><span className="text-muted-foreground">Sponge:</span> <span className="font-medium">{items[currentIndex].Rubber_Sponge_Sizes.join(", ")}</span></div>}
                                </>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </motion.div>

                {/* Teaser for next item (bottom) flat */}
                <div className="absolute bottom-0 left-0 right-0 h-28 overflow-hidden pointer-events-none z-20">
                  <div className="absolute bottom-[-10px] left-8 right-8">
                    <div className="relative w-full h-40 rounded-t-xl bg-background border-t-2 border-x-2 border-border flex items-center justify-center shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)]">
                      <div className="relative w-[80%] h-full pt-2">
                        <Image
                          src={getImage(items[(currentIndex + 1) % items.length])}
                          alt=""
                          fill
                          unoptimized
                          className="product-img object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teaser for previous item (top) flat */}
                <div className="absolute top-0 left-0 right-0 h-28 overflow-hidden pointer-events-none z-20">
                  <div className="absolute top-[-10px] left-8 right-8">
                    <div className="relative w-full h-40 rounded-b-xl bg-background border-b-2 border-x-2 border-border flex flex-col items-center justify-end shadow-[0_4px_10px_-4px_rgba(0,0,0,0.1)]">
                      <div className="relative w-[80%] h-full pb-2">
                        <Image
                          src={getImage(items[(currentIndex - 1 + items.length) % items.length])}
                          alt=""
                          fill
                          unoptimized
                          className="product-img object-contain object-bottom"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll buttons */}
        <button
          onClick={() => handleSwipe('up')}
          disabled={isSpinning}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-card/80 hover:bg-card border border-border disabled:opacity-30 disabled:cursor-not-allowed text-foreground rounded-full shadow-md transition-all hover:scale-105 disabled:hover:scale-100 w-7 h-7 flex items-center justify-center backdrop-blur-sm"
          aria-label="Previous item"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleSwipe('down')}
          disabled={isSpinning}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 bg-card/80 hover:bg-card border border-border disabled:opacity-30 disabled:cursor-not-allowed text-foreground rounded-full shadow-md transition-all hover:scale-105 disabled:hover:scale-100 w-7 h-7 flex items-center justify-center backdrop-blur-sm"
          aria-label="Next item"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selector below wheel */}
      {selectorComponent && (
        <div className="mt-4">
          {selectorComponent}
        </div>
      )}

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder={`Search ${label}...`} />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={label}>
            {items.map((item, idx) => (
              <CommandItem
                key={`${label}-${getName(item)}-${idx}`}
                onSelect={() => {
                  onChange(item);
                  setSearchOpen(false);
                }}
                className="flex items-center gap-3 p-3"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded bg-muted p-1">
                  <img src={getImage(item)} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{getName(item)}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.Blade_Brand || item.Rubber_Brand || item.Racket_Brand || ""}
                  </span>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <span className="text-sm font-semibold">${item.Blade_Price || item.Rubber_Price || item.Racket_Price}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{item.Blade_Level || item.Rubber_Level || item.Racket_Level}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

// Selector components
const GripSelector = ({
  selectedBlade,
  selectedGrip,
  onGripChange
}: {
  selectedBlade: Blade;
  selectedGrip: string;
  onGripChange: (grip: string) => void;
}) => {
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
          asChild
        >
          <div role="button" tabIndex={0}>
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
          </div>
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
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedGrip === gripType
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
    </Collapsible >
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
          asChild
        >
          <div role="button" tabIndex={0}>
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
          </div>
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
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedThickness === size
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
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedColor === color
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
  allBlades,
  allRubbers,
  allRackets,
}: SlotMachineProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showForehandStats, setShowForehandStats] = useState(false);
  const [showBladeStats, setShowBladeStats] = useState(false);
  const [showBackhandStats, setShowBackhandStats] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track window resize for responsive opacity
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to extract brand from product name
  const extractBrand = (productName: string): string => {
    const name = productName.toUpperCase();
    if (name.includes('TIMO BOLL') || name.includes('VISCARIA') || name.includes('TENERGY') || name.includes('DIGNICS') || name.includes('ROZENA') || name.includes('GLAYZER') || name.includes('KORBEL') || name.includes('FAN ZHENDONG') || name.startsWith('BUTTERFLY')) return 'Butterfly';
    if (name.startsWith('JOOLA')) return 'JOOLA';
    if (name.startsWith('ANDRO')) return 'ANDRO';
    if (name.startsWith('DHS') || name.startsWith('HURRICANE')) return 'DHS';
    if (name.startsWith('STIGA') || name.startsWith('CYBERSHAPE') || name.startsWith('CLIPPER')) return 'STIGA';
    if (name.startsWith('YASAKA') || name.startsWith('RAKZA') || name.startsWith('MARK V') || name.startsWith('FALCK') || name.startsWith('MA LIN')) return 'YASAKA';
    if (name.startsWith('TIBHAR') || name.startsWith('EVOLUTION') || name.startsWith('AURUS') || name.startsWith('QUANTUM') || name.startsWith('MK') || name.startsWith('SAMSONOV') || name.startsWith('LEBRUN') || name.startsWith('DARKO')) return 'TIBHAR';
    if (name.startsWith('NITTAKU') || name.startsWith('FASTARC') || name.startsWith('ACOUSTIC') || name.startsWith('VIOLIN') || name.startsWith('MORISTO')) return 'Nittaku';
    if (name.startsWith('XIOM') || name.startsWith('VEGA') || name.startsWith('OMEGA') || name.startsWith('JEFFREY')) return 'XIOM';
    if (name.startsWith('VICTAS') || name.startsWith('V>15') || name.startsWith('KOJI')) return 'VICTAS';
    if (name.startsWith('DONIC') || name.startsWith('BLUEFIRE') || name.startsWith('ACUDA') || name.startsWith('BARACUDA') || name.startsWith('OVTCHAROV')) return 'DONIC';
    if (name.startsWith('GEWO')) return 'GEWO';
    return 'Other';
  };

  // Filter products based on filters
  const filterBlades = (filters: ProductFilters) => {
    return allBlades.filter(blade => {
      if (blade.Blade_Price > filters.maxPrice) return false;
      if (!filters.level.includes("All") && !filters.level.includes(blade.Blade_Level)) return false;

      let bStyle = blade.Blade_Style || '';
      if (bStyle === 'All-Round') bStyle = 'Allround';
      if (!filters.style.includes("All") && !filters.style.includes(bStyle)) return false;
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
    return allRubbers.filter(rubber => {
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

  const imgBlades = filteredBlades;
  const imgForehandRubbers = filteredForehandRubbers;
  const imgBackhandRubbers = filteredBackhandRubbers;

  // Ensure we always have at least one item in each array to prevent crashes
  const safeFilteredBlades = imgBlades.length > 0 ? imgBlades : allBlades;
  const safeFilteredForehandRubbers = imgForehandRubbers.length > 0 ? imgForehandRubbers : allRubbers;
  const safeFilteredBackhandRubbers = imgBackhandRubbers.length > 0 ? imgBackhandRubbers : allRubbers;

  // Auto-select first item if current selection is not in filtered list
  useEffect(() => {
    if (!isPreassembled) {
      if (selectedBlade && !safeFilteredBlades.some(b => b.Blade_Name === selectedBlade.Blade_Name)) {
        onBladeChange(safeFilteredBlades[0]);
      }
      if (selectedForehand && !safeFilteredForehandRubbers.some(r => r.Rubber_Name === selectedForehand.Rubber_Name)) {
        onForehandChange(safeFilteredForehandRubbers[0]);
      }
      if (selectedBackhand && !safeFilteredBackhandRubbers.some(r => r.Rubber_Name === selectedBackhand.Rubber_Name)) {
        onBackhandChange(safeFilteredBackhandRubbers[0]);
      }
    }
  }, [bladeFilters, forehandFilters, backhandFilters]);

  useEffect(() => {
    if (spinTrigger > 0) {
      handleSpin();
    }
  }, [spinTrigger]);

  const handleSpin = async () => {
    setIsSpinning(true);

    if (isPreassembled) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const randomRacket = allRackets[Math.floor(Math.random() * allRackets.length)];
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

  return (
    <div className="w-full">
      {isPreassembled ? (
        <div className="flex justify-center py-8">
          <div className="w-full max-w-[1000px]">
            <SlotWheel isSpinning={isSpinning}
              items={allRackets}
              selected={selectedRacket}
              onChange={onRacketChange}
              label="Preassembled Racket"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3 lg:gap-6 xl:gap-8 justify-items-center py-8 max-w-7xl mx-auto px-2">
          <div className="w-full max-w-[380px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[500px]">
            <SlotWheel isSpinning={isSpinning}
              items={safeFilteredForehandRubbers}
              selected={selectedForehand}
              onChange={onForehandChange}
              label="Forehand Rubber"
              delay={0}
              filters={forehandFilters}
              allItems={allRubbers}
              filterComponent={
                <ProductFilter
                  filters={forehandFilters}
                  onFiltersChange={onForehandFiltersChange}
                  type="rubber"
                  title="Forehand Rubber"
                  open={forehandFilterOpen}
                  onOpenChange={onForehandFilterOpenChange}
                  products={allRubbers}
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
            <SlotWheel isSpinning={isSpinning}
              items={safeFilteredBlades}
              selected={selectedBlade}
              onChange={onBladeChange}
              label="Blade"
              delay={1000}
              filters={bladeFilters}
              allItems={allBlades}
              filterComponent={
                <ProductFilter
                  filters={bladeFilters}
                  onFiltersChange={onBladeFiltersChange}
                  type="blade"
                  title="Blade"
                  open={bladeFilterOpen}
                  onOpenChange={onBladeFilterOpenChange}
                  products={allBlades}
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
              <GripSelector selectedBlade={selectedBlade} selectedGrip={selectedGrip} onGripChange={onGripChange} />
            </div>
          </div>

          <div className="w-full max-w-[380px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[500px]">
            <SlotWheel isSpinning={isSpinning}
              items={safeFilteredBackhandRubbers}
              selected={selectedBackhand}
              onChange={onBackhandChange}
              label="Backhand Rubber"
              delay={2000}
              filters={backhandFilters}
              allItems={allRubbers}
              filterComponent={
                <ProductFilter
                  filters={backhandFilters}
                  onFiltersChange={onBackhandFiltersChange}
                  type="rubber"
                  title="Backhand Rubber"
                  open={backhandFilterOpen}
                  onOpenChange={onBackhandFilterOpenChange}
                  products={allRubbers}
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
