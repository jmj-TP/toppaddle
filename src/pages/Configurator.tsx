import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlotMachine from "@/components/configurator/SlotMachine";
import StatsDisplay, { type UserPreferences } from "@/components/configurator/StatsDisplay";
import { Button } from "@/components/ui/button";
import { blades, rubbers, preAssembledRackets } from "@/data/products";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import { toast } from "sonner";
import type { ProductFilters } from "@/components/configurator/ProductFilter";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

const Configurator = () => {
  const [searchParams] = useSearchParams();
  const [isPreassembled, setIsPreassembled] = useState(false);
  
  // Shopify products state
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  
  // State for custom mode
  const [selectedBlade, setSelectedBlade] = useState<Blade>(blades[0]);
  const [selectedForehand, setSelectedForehand] = useState<Rubber>(rubbers[0]);
  const [selectedBackhand, setSelectedBackhand] = useState<Rubber>(rubbers[1]);
  
  // State for preassembled mode
  const [selectedRacket, setSelectedRacket] = useState<PreAssembledRacket>(preAssembledRackets[0]);
  
  // Filters - using values that match products.ts and Shopify
  const [selectedGrip, setSelectedGrip] = useState<string>("FL");
  const [selectedForehandThickness, setSelectedForehandThickness] = useState<string>("1.7mm");
  const [selectedBackhandThickness, setSelectedBackhandThickness] = useState<string>("1.7mm");
  const [selectedForehandColor, setSelectedForehandColor] = useState<string>("Red");
  const [selectedBackhandColor, setSelectedBackhandColor] = useState<string>("Black");
  
  // Handler for forehand color that auto-switches backhand if colors match
  const handleForehandColorChange = (color: string) => {
    setSelectedForehandColor(color);
    // If backhand has the same color, switch it to the other color
    if (selectedBackhandColor === color) {
      setSelectedBackhandColor(color === "Red" ? "Black" : "Red");
    }
  };
  
  // Handler for backhand color that auto-switches forehand if colors match
  const handleBackhandColorChange = (color: string) => {
    setSelectedBackhandColor(color);
    // If forehand has the same color, switch it to the other color
    if (selectedForehandColor === color) {
      setSelectedForehandColor(color === "Red" ? "Black" : "Red");
    }
  };
  
  // Filter popover open states
  const [forehandFilterOpen, setForehandFilterOpen] = useState(false);
  const [bladeFilterOpen, setBladeFilterOpen] = useState(false);
  const [backhandFilterOpen, setBackhandFilterOpen] = useState(false);
  
  // Product filters for each component
  const [forehandFilters, setForehandFilters] = useState<ProductFilters>({
    maxPrice: 999999,
    level: ["All"],
    style: ["All"],
    spongeSize: "All",
    brand: ["All"]
  });
  const [bladeFilters, setBladeFilters] = useState<ProductFilters>({
    maxPrice: 999999,
    level: ["All"],
    style: ["All"],
    gripType: "All",
    brand: ["All"]
  });
  const [backhandFilters, setBackhandFilters] = useState<ProductFilters>({
    maxPrice: 999999,
    level: ["All"],
    style: ["All"],
    spongeSize: "All",
    brand: ["All"]
  });

  // Helper function to extract brand from product name
  const extractBrand = (productName: string): string => {
    const name = productName.toUpperCase();
    if (name.startsWith('BUTTERFLY')) return 'Butterfly';
    if (name.startsWith('JOOLA')) return 'JOOLA';
    if (name.startsWith('ANDRO')) return 'ANDRO';
    if (name.startsWith('DHS')) return 'DHS';
    return 'Other';
  };

  // Validation functions for filters
  const validateFilters = (filters: ProductFilters, type: 'blade' | 'rubber'): boolean => {
    if (type === 'blade') {
      const filtered = blades.filter(blade => {
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
      return filtered.length > 0;
    } else {
      const filtered = rubbers.filter(rubber => {
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
      return filtered.length > 0;
    }
  };

  const handleForehandFiltersChange = (newFilters: ProductFilters) => {
    if (!validateFilters(newFilters, 'rubber')) {
      toast.error("No products match these filter criteria", {
        description: "Please adjust your filters to see available products."
      });
      return;
    }
    setForehandFilters(newFilters);
  };

  const handleBladeFiltersChange = (newFilters: ProductFilters) => {
    if (!validateFilters(newFilters, 'blade')) {
      toast.error("No products match these filter criteria", {
        description: "Please adjust your filters to see available products."
      });
      return;
    }
    setBladeFilters(newFilters);
  };

  const handleBackhandFiltersChange = (newFilters: ProductFilters) => {
    if (!validateFilters(newFilters, 'rubber')) {
      toast.error("No products match these filter criteria", {
        description: "Please adjust your filters to see available products."
      });
      return;
    }
    setBackhandFilters(newFilters);
  };
  
  // Spin trigger for random reroll
  const [spinTrigger, setSpinTrigger] = useState(0);

  // Load preselected items from quiz results
  useEffect(() => {
    const bladeParam = searchParams.get("blade");
    const fhParam = searchParams.get("fh");
    const bhParam = searchParams.get("bh");
    const racketParam = searchParams.get("racket");
    
    if (racketParam) {
      const racket = preAssembledRackets.find(r => r.Racket_Name === racketParam);
      if (racket) {
        setIsPreassembled(true);
        setSelectedRacket(racket);
      }
    } else if (bladeParam || fhParam || bhParam) {
      const blade = blades.find(b => b.Blade_Name === bladeParam) || blades[0];
      const fh = rubbers.find(r => r.Rubber_Name === fhParam) || rubbers[0];
      const bh = rubbers.find(r => r.Rubber_Name === bhParam) || rubbers[1];
      
      setSelectedBlade(blade);
      setSelectedForehand(fh);
      setSelectedBackhand(bh);
    }
  }, [searchParams]);

  // Fetch Shopify products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchShopifyProducts();
        setShopifyProducts(products);
      } catch (error) {
        console.error("Error loading Shopify products:", error);
        toast.error("Unable to load products", {
          description: "Please refresh the page to try again."
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleRandomReroll = () => {
    setSpinTrigger(prev => prev + 1);
  };

  const handlePreferencesChange = (preferences: UserPreferences) => {
    // Helper function to check level compatibility (same logic as quiz)
    const isLevelCompatible = (productLevel: string, userLevel: string): boolean => {
      if (userLevel === productLevel) return true;
      if (userLevel === 'Advanced' && productLevel === 'Intermediate') return true;
      if (userLevel === 'Beginner' && productLevel === 'Intermediate') return true;
      // Filter out incompatible levels
      if (userLevel === 'Advanced' && productLevel === 'Beginner') return false;
      if (userLevel === 'Beginner' && productLevel === 'Advanced') return false;
      return false;
    };

    // Check if component-specific preferences are provided
    const hasComponentPreferences = preferences.forehandSpeed !== undefined;

    // Find best matching products based on preferences
    if (isPreassembled) {
      // Find best matching preassembled racket
      const matchingRackets = preAssembledRackets
        .filter(racket => {
          // Filter by budget
          if (racket.Racket_Price > preferences.budget) return false;
          // Filter by level compatibility
          if (!isLevelCompatible(racket.Racket_Level, preferences.level)) return false;
          return true;
        })
        .map(racket => {
          const scoreDiff = 
            Math.abs(racket.Racket_Speed - preferences.speed) +
            Math.abs(racket.Racket_Spin - preferences.spin) +
            Math.abs(racket.Racket_Control - preferences.control) +
            Math.abs((racket.Racket_Speed + racket.Racket_Spin) / 2 - preferences.power);
          return { racket, scoreDiff };
        })
        .sort((a, b) => a.scoreDiff - b.scoreDiff);

      if (matchingRackets.length > 0) {
        setSelectedRacket(matchingRackets[0].racket);
      } else {
        toast.error("No preassembled racket matches your preferences", {
          description: "Try adjusting your budget, level, or performance preferences."
        });
      }
    } else {
      // Find ALL valid combinations that fit budget and level requirements
      const validCombinations: Array<{
        blade: Blade;
        forehand: Rubber;
        backhand: Rubber;
        totalPrice: number;
        scoreDiff: number;
      }> = [];

      // Apply product filters first
      const filterBlades = (blade: Blade) => {
        if (blade.Blade_Price > bladeFilters.maxPrice) return false;
        if (!bladeFilters.level.includes("All") && !bladeFilters.level.includes(blade.Blade_Level)) return false;
        if (!bladeFilters.style.includes("All") && !bladeFilters.style.includes(blade.Blade_Style)) return false;
        if (bladeFilters.brand && !bladeFilters.brand.includes("All")) {
          if (!bladeFilters.brand.includes(extractBrand(blade.Blade_Name))) return false;
        }
        return true;
      };

      const filterForehandRubbers = (rubber: Rubber) => {
        if (rubber.Rubber_Price > forehandFilters.maxPrice) return false;
        if (!forehandFilters.level.includes("All") && !forehandFilters.level.includes(rubber.Rubber_Level)) return false;
        if (!forehandFilters.style.includes("All") && !forehandFilters.style.includes(rubber.Rubber_Style)) return false;
        if (forehandFilters.brand && !forehandFilters.brand.includes("All")) {
          if (!forehandFilters.brand.includes(extractBrand(rubber.Rubber_Name))) return false;
        }
        return true;
      };

      const filterBackhandRubbers = (rubber: Rubber) => {
        if (rubber.Rubber_Price > backhandFilters.maxPrice) return false;
        if (!backhandFilters.level.includes("All") && !backhandFilters.level.includes(rubber.Rubber_Level)) return false;
        if (!backhandFilters.style.includes("All") && !backhandFilters.style.includes(rubber.Rubber_Style)) return false;
        if (backhandFilters.brand && !backhandFilters.brand.includes("All")) {
          if (!backhandFilters.brand.includes(extractBrand(rubber.Rubber_Name))) return false;
        }
        return true;
      };

      // Filter compatible blades and rubbers with both preference level and product filters
      const compatibleBlades = blades.filter(blade => 
        isLevelCompatible(blade.Blade_Level, preferences.level) && filterBlades(blade)
      );
      const compatibleForehandRubbers = rubbers.filter(rubber => 
        isLevelCompatible(rubber.Rubber_Level, preferences.level) && filterForehandRubbers(rubber)
      );
      const compatibleBackhandRubbers = rubbers.filter(rubber => 
        isLevelCompatible(rubber.Rubber_Level, preferences.level) && filterBackhandRubbers(rubber)
      );

      // Build all valid combinations
      for (const blade of compatibleBlades) {
        for (const forehandRubber of compatibleForehandRubbers) {
          for (const backhandRubber of compatibleBackhandRubbers) {
            const totalPrice = blade.Blade_Price + forehandRubber.Rubber_Price + backhandRubber.Rubber_Price;
            
            // Only include combinations within budget
            if (totalPrice <= preferences.budget) {
              let scoreDiff = 0;
              
              if (hasComponentPreferences) {
                // Use component-specific preferences for more precise matching
                const forehandDiff = 
                  Math.abs(forehandRubber.Rubber_Speed - (preferences.forehandSpeed || preferences.speed)) +
                  Math.abs(forehandRubber.Rubber_Spin - (preferences.forehandSpin || preferences.spin)) +
                  Math.abs(forehandRubber.Rubber_Control - (preferences.forehandControl || preferences.control)) +
                  Math.abs(forehandRubber.Rubber_Power - (preferences.forehandPower || preferences.power));
                
                const bladeDiff = 
                  Math.abs(blade.Blade_Speed - (preferences.bladeSpeed || preferences.speed)) +
                  Math.abs(blade.Blade_Spin - (preferences.bladeSpin || preferences.spin)) +
                  Math.abs(blade.Blade_Control - (preferences.bladeControl || preferences.control)) +
                  Math.abs(blade.Blade_Power - (preferences.bladePower || preferences.power));
                
                const backhandDiff = 
                  Math.abs(backhandRubber.Rubber_Speed - (preferences.backhandSpeed || preferences.speed)) +
                  Math.abs(backhandRubber.Rubber_Spin - (preferences.backhandSpin || preferences.spin)) +
                  Math.abs(backhandRubber.Rubber_Control - (preferences.backhandControl || preferences.control)) +
                  Math.abs(backhandRubber.Rubber_Power - (preferences.backhandPower || preferences.power));
                
                scoreDiff = forehandDiff + bladeDiff + backhandDiff;
              } else {
                // Use overall average preferences
                const avgSpeed = Math.round((blade.Blade_Speed + forehandRubber.Rubber_Speed + backhandRubber.Rubber_Speed) / 3);
                const avgSpin = Math.round((blade.Blade_Spin + forehandRubber.Rubber_Spin + backhandRubber.Rubber_Spin) / 3);
                const avgControl = Math.round((blade.Blade_Control + forehandRubber.Rubber_Control + backhandRubber.Rubber_Control) / 3);
                const avgPower = Math.round((avgSpeed + avgSpin) / 2);
                
                scoreDiff = 
                  Math.abs(avgSpeed - preferences.speed) +
                  Math.abs(avgSpin - preferences.spin) +
                  Math.abs(avgControl - preferences.control) +
                  Math.abs(avgPower - preferences.power);
              }
              
              validCombinations.push({
                blade,
                forehand: forehandRubber,
                backhand: backhandRubber,
                totalPrice,
                scoreDiff
              });
            }
          }
        }
      }

      // Sort by score (best match first)
      validCombinations.sort((a, b) => a.scoreDiff - b.scoreDiff);

      // Select the best combination if available
      if (validCombinations.length > 0) {
        const best = validCombinations[0];
        setSelectedBlade(best.blade);
        setSelectedForehand(best.forehand);
        setSelectedBackhand(best.backhand);
      } else {
        toast.error("No custom racket configuration matches your preferences", {
          description: "Try increasing your budget or adjusting your level and performance preferences."
        });
      }
    }
  };

  const calculateCustomStats = () => {
    // Helper function to get sponge thickness multiplier
    const getSpongeMultiplier = (thickness: string): { control: number; power: number; speed: number; spin: number } => {
      const thicknessValue = parseFloat(thickness);
      
      // Thinner sponges (< 1.8mm): more control, less power/speed/spin
      if (thicknessValue < 1.8) {
        return { control: 1.05, power: 0.95, speed: 0.95, spin: 0.95 };
      }
      // Medium sponges (1.8-2.0mm): balanced
      else if (thicknessValue >= 1.8 && thicknessValue <= 2.0) {
        return { control: 1.0, power: 1.0, speed: 1.0, spin: 1.0 };
      }
      // Thicker sponges (> 2.0mm): less control, more power/speed/spin
      else {
        return { control: 0.95, power: 1.05, speed: 1.05, spin: 1.05 };
      }
    };
    
    const fhMultiplier = getSpongeMultiplier(selectedForehandThickness);
    const bhMultiplier = getSpongeMultiplier(selectedBackhandThickness);
    
    // Apply sponge multipliers to rubber stats
    const fhSpeed = selectedForehand.Rubber_Speed * fhMultiplier.speed;
    const bhSpeed = selectedBackhand.Rubber_Speed * bhMultiplier.speed;
    const fhSpin = selectedForehand.Rubber_Spin * fhMultiplier.spin;
    const bhSpin = selectedBackhand.Rubber_Spin * bhMultiplier.spin;
    const fhControl = selectedForehand.Rubber_Control * fhMultiplier.control;
    const bhControl = selectedBackhand.Rubber_Control * bhMultiplier.control;
    
    const speed = Math.round((selectedBlade.Blade_Speed + fhSpeed + bhSpeed) / 3);
    const spin = Math.round((selectedBlade.Blade_Spin + fhSpin + bhSpin) / 3);
    const control = Math.round((selectedBlade.Blade_Control + fhControl + bhControl) / 3);
    const power = Math.round((speed + spin) / 2);
    const totalPrice = selectedBlade.Blade_Price + selectedForehand.Rubber_Price + selectedBackhand.Rubber_Price;
    
    return { speed, spin, control, power, price: totalPrice };
  };

  // Helper function to find matching Shopify variant
  const findMatchingVariant = (
    product: ShopifyProduct,
    options: Array<{ name: string; value: string }>
  ): string | null => {
    const variants = product.node.variants.edges;
    
    console.log(`🔍 Finding variant for ${product.node.title}`, {
      requestedOptions: options,
      availableVariants: variants.map(v => ({
        id: v.node.id,
        title: v.node.title,
        options: v.node.selectedOptions,
        available: v.node.availableForSale
      }))
    });
    
    for (const variant of variants) {
      const variantOptions = variant.node.selectedOptions;
      
      // Check if all required options match
      const allMatch = options.every(requiredOption => 
        variantOptions.some(variantOption => 
          variantOption.name === requiredOption.name && 
          variantOption.value === requiredOption.value
        )
      );
      
      if (allMatch && variant.node.availableForSale) {
        console.log(`✅ Found matching variant:`, {
          variantId: variant.node.id,
          title: variant.node.title,
          options: variant.node.selectedOptions
        });
        return variant.node.id;
      }
    }
    
    console.log(`❌ No matching variant found for options:`, options);
    return null;
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (isLoadingProducts) {
      toast.error("Products are still loading", {
        description: "Please wait a moment and try again."
      });
      return;
    }

    if (shopifyProducts.length === 0) {
      toast.error("No products available", {
        description: "Please make sure products are created in your Shopify store."
      });
      return;
    }

    try {
      if (isPreassembled) {
        // For preassembled rackets - find matching product
        const racketProduct = shopifyProducts.find(p => 
          p.node.title.toLowerCase().includes(selectedRacket.Racket_Name.toLowerCase())
        );

        if (!racketProduct) {
          toast.error("Product not found in store", {
            description: `${selectedRacket.Racket_Name} is not available in the Shopify store yet.`
          });
          return;
        }

        const variant = racketProduct.node.variants.edges[0];
        if (!variant) {
          toast.error("No variant available");
          return;
        }

        addItem({
          product: racketProduct,
          variantId: variant.node.id,
          variantTitle: variant.node.title,
          price: variant.node.price,
          quantity: 1,
          selectedOptions: variant.node.selectedOptions
        });

        toast.success("Added to cart", {
          description: `${selectedRacket.Racket_Name} added to your cart`
        });
      } else {
        // For custom rackets - find blade and both rubbers with their variants
        const bladeProduct = shopifyProducts.find(p => 
          p.node.title.toLowerCase().includes(selectedBlade.Blade_Name.toLowerCase())
        );
        const forehandProduct = shopifyProducts.find(p => 
          p.node.title.toLowerCase().includes(selectedForehand.Rubber_Name.toLowerCase())
        );
        const backhandProduct = shopifyProducts.find(p => 
          p.node.title.toLowerCase().includes(selectedBackhand.Rubber_Name.toLowerCase())
        );

        if (!bladeProduct || !forehandProduct || !backhandProduct) {
          const missing = [];
          if (!bladeProduct) missing.push(selectedBlade.Blade_Name);
          if (!forehandProduct) missing.push(selectedForehand.Rubber_Name);
          if (!backhandProduct) missing.push(selectedBackhand.Rubber_Name);
          
          toast.error("Products not found in store", {
            description: `The following products are not available: ${missing.join(", ")}`
          });
          return;
        }

        // Find matching variants for each component
        const bladeVariantId = findMatchingVariant(bladeProduct, [
          { name: "Grip Type", value: selectedGrip }
        ]);

        const forehandVariantId = findMatchingVariant(forehandProduct, [
          { name: "Sponge Thickness", value: selectedForehandThickness },
          { name: "Color", value: selectedForehandColor }
        ]);

        const backhandVariantId = findMatchingVariant(backhandProduct, [
          { name: "Sponge Thickness", value: selectedBackhandThickness },
          { name: "Color", value: selectedBackhandColor }
        ]);

        if (!bladeVariantId || !forehandVariantId || !backhandVariantId) {
          const missingParts = [];
          if (!bladeVariantId) missingParts.push(`Blade with grip: ${selectedGrip}`);
          if (!forehandVariantId) missingParts.push(`Forehand rubber with thickness: ${selectedForehandThickness}`);
          if (!backhandVariantId) missingParts.push(`Backhand rubber with thickness: ${selectedBackhandThickness}`);
          
          console.error("Missing variants:", { bladeVariantId, forehandVariantId, backhandVariantId });
          
          toast.error("Variant not available", {
            description: `The following options are not available: ${missingParts.join(", ")}`
          });
          return;
        }

        // Add all three items to cart
        const bladeVariant = bladeProduct.node.variants.edges.find(v => v.node.id === bladeVariantId)!;
        const forehandVariant = forehandProduct.node.variants.edges.find(v => v.node.id === forehandVariantId)!;
        const backhandVariant = backhandProduct.node.variants.edges.find(v => v.node.id === backhandVariantId)!;

        addItem({
          product: bladeProduct,
          variantId: bladeVariantId,
          variantTitle: bladeVariant.node.title,
          price: bladeVariant.node.price,
          quantity: 1,
          selectedOptions: bladeVariant.node.selectedOptions
        });

        addItem({
          product: forehandProduct,
          variantId: forehandVariantId,
          variantTitle: forehandVariant.node.title,
          price: forehandVariant.node.price,
          quantity: 1,
          selectedOptions: forehandVariant.node.selectedOptions
        });

        addItem({
          product: backhandProduct,
          variantId: backhandVariantId,
          variantTitle: backhandVariant.node.title,
          price: backhandVariant.node.price,
          quantity: 1,
          selectedOptions: backhandVariant.node.selectedOptions
        });

        toast.success("Custom racket added to cart", {
          description: "3 items added: blade and 2 rubbers with your selected options"
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart", {
        description: "Please try again."
      });
    }
  };

  const stats = isPreassembled 
    ? {
        speed: selectedRacket.Racket_Speed,
        spin: selectedRacket.Racket_Spin,
        control: selectedRacket.Racket_Control,
        power: Math.round((selectedRacket.Racket_Speed + selectedRacket.Racket_Spin) / 2),
        price: selectedRacket.Racket_Price
      }
    : calculateCustomStats();

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Table Tennis Racket Configurator - Build Your Custom Setup"
        description="Configure your perfect table tennis racket. Choose from professional blades and rubbers or select pre-assembled options. Real-time stats and pricing for all skill levels."
        canonical="https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/configurator"
      />
      <StructuredData
        data={{
          type: 'BreadcrumbList',
          items: [
            { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' },
            { name: 'Configurator', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/configurator' }
          ]
        }}
      />
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Quiz Recommendation Note */}
          <div className="mb-8 bg-primary/5 border border-primary/20 rounded-xl p-4 text-center animate-fade-in">
            <p className="font-body text-sm md:text-base text-foreground/80">
              <span className="font-semibold text-primary">Don't know what to choose?</span> Try our{" "}
              <a 
                href="/" 
                className="text-primary hover:text-primary/80 underline underline-offset-2 font-semibold transition-colors"
              >
                quiz
              </a>
              {" "}to get the perfect recommendation tailored to your playing style.
            </p>
          </div>
          
          {/* Header */}
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-fade-in">
              Build Your Perfect Racket
            </h1>
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => setIsPreassembled(false)}
                variant={!isPreassembled ? "default" : "outline"}
                className="rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base"
              >
                Custom
              </Button>
              <Button
                onClick={() => setIsPreassembled(true)}
                variant={isPreassembled ? "default" : "outline"}
                className="rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base"
              >
                Preassembled
              </Button>
            </div>
          </div>

          {/* Slot Machine and Stats - Single Container */}
          <div className="max-w-7xl mx-auto">
            <SlotMachine
              isPreassembled={isPreassembled}
              selectedBlade={selectedBlade}
              selectedForehand={selectedForehand}
              selectedBackhand={selectedBackhand}
              selectedRacket={selectedRacket}
              onBladeChange={setSelectedBlade}
              onForehandChange={setSelectedForehand}
              onBackhandChange={setSelectedBackhand}
              onRacketChange={setSelectedRacket}
              spinTrigger={spinTrigger}
            selectedGrip={selectedGrip}
            selectedForehandThickness={selectedForehandThickness}
            selectedBackhandThickness={selectedBackhandThickness}
            selectedForehandColor={selectedForehandColor}
            selectedBackhandColor={selectedBackhandColor}
            onGripChange={setSelectedGrip}
            onForehandThicknessChange={setSelectedForehandThickness}
            onBackhandThicknessChange={setSelectedBackhandThickness}
            onForehandColorChange={handleForehandColorChange}
            onBackhandColorChange={handleBackhandColorChange}
              forehandFilters={forehandFilters}
              bladeFilters={bladeFilters}
              backhandFilters={backhandFilters}
              onForehandFiltersChange={handleForehandFiltersChange}
              onBladeFiltersChange={handleBladeFiltersChange}
              onBackhandFiltersChange={handleBackhandFiltersChange}
              forehandFilterOpen={forehandFilterOpen}
              bladeFilterOpen={bladeFilterOpen}
              backhandFilterOpen={backhandFilterOpen}
              onForehandFilterOpenChange={setForehandFilterOpen}
              onBladeFilterOpenChange={setBladeFilterOpen}
              onBackhandFilterOpenChange={setBackhandFilterOpen}
            />

            {/* Stats Display Below Slots */}
            <div className="mt-5">
              <StatsDisplay
                stats={stats}
                level={isPreassembled ? selectedRacket.Racket_Level : selectedBlade.Blade_Level}
                blade={isPreassembled ? null : selectedBlade}
                forehand={isPreassembled ? null : selectedForehand}
                backhand={isPreassembled ? null : selectedBackhand}
                racket={isPreassembled ? selectedRacket : null}
                onRandomReroll={handleRandomReroll}
                onPreferencesChange={handlePreferencesChange}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Configurator;
