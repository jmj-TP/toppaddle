import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Target, Gauge, Shield, Info, ChevronDown, ChevronUp, ShoppingCart, Wrench, Sparkles } from "lucide-react";
import type { Recommendation, CustomSetup, QuizAnswers } from "@/utils/ratingSystem";
import { estimateBladeWeight, estimateRubberWeight } from "@/data/products";
import BrandSelector from "./BrandSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShareButton from "./ShareButton";
import { useCartStore } from "@/stores/cartStore";
import { useComparisonStore, type ComparisonPaddle } from "@/stores/comparisonStore";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

interface RecommendationDisplayProps {
  recommendation: Recommendation;
  onRestart: () => void;
  assemblyPreference?: string;
  budgetAmount?: number;
  playerLevel?: string;
  currentAnswers?: Partial<QuizAnswers>;
  onUpdatePreferences?: (budget: string, brands: string[]) => void;
}

export default function RecommendationDisplay({ recommendation, onRestart, assemblyPreference, budgetAmount, playerLevel, currentAnswers, onUpdatePreferences }: RecommendationDisplayProps) {
  const { preAssembled, preAssembled2, customSetup, customSetup2, totalScore, forehandThickness, forehandThicknessExplanation, backhandThickness, backhandThicknessExplanation, handleType, handleTypeExplanation } = recommendation;
  
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const addPaddle = useComparisonStore(state => state.addPaddle);
  const comparisonPaddles = useComparisonStore(state => state.paddles);
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  
  const [showPreferenceEditor, setShowPreferenceEditor] = useState(false);
  const [tempBudget, setTempBudget] = useState(currentAnswers?.Budget || "<100$");
  const [tempBrands, setTempBrands] = useState<string[]>(currentAnswers?.Brand || []);
  const [assembleCustom1, setAssembleCustom1] = useState(false);
  const [assembleCustom2, setAssembleCustom2] = useState(false);
  const [sealCustom1, setSealCustom1] = useState(false);
  const [sealCustom2, setSealCustom2] = useState(false);
  
  // Sponge size selections for custom setups
  const [custom1ForehandSponge, setCustom1ForehandSponge] = useState<string>("");
  const [custom1BackhandSponge, setCustom1BackhandSponge] = useState<string>("");
  const [custom2ForehandSponge, setCustom2ForehandSponge] = useState<string>("");
  const [custom2BackhandSponge, setCustom2BackhandSponge] = useState<string>("");

  // Load Shopify products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchShopifyProducts();
        setShopifyProducts(products);
      } catch (error) {
        console.error("Error loading Shopify products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // Initialize sponge selections when products load
  useEffect(() => {
    if (shopifyProducts.length === 0) return;
    
    if (customSetup) {
      const fhSponges = getAvailableSponges(customSetup.forehandRubber.Rubber_Name);
      const bhSponges = getAvailableSponges(customSetup.backhandRubber.Rubber_Name);
      
      const fhRecommended = getValidatedThickness(customSetup.forehandThickness || forehandThickness, customSetup.forehandRubber);
      const bhRecommended = getValidatedThickness(customSetup.backhandThickness || backhandThickness, customSetup.backhandRubber);
      
      setCustom1ForehandSponge(fhSponges.includes(fhRecommended) ? fhRecommended : fhSponges[0] || "");
      setCustom1BackhandSponge(bhSponges.includes(bhRecommended) ? bhRecommended : bhSponges[0] || "");
    }
    
    if (customSetup2) {
      const fhSponges = getAvailableSponges(customSetup2.forehandRubber.Rubber_Name);
      const bhSponges = getAvailableSponges(customSetup2.backhandRubber.Rubber_Name);
      
      const fhRecommended = getValidatedThickness(customSetup2.forehandThickness || forehandThickness, customSetup2.forehandRubber);
      const bhRecommended = getValidatedThickness(customSetup2.backhandThickness || backhandThickness, customSetup2.backhandRubber);
      
      setCustom2ForehandSponge(fhSponges.includes(fhRecommended) ? fhRecommended : fhSponges[0] || "");
      setCustom2BackhandSponge(bhSponges.includes(bhRecommended) ? bhRecommended : bhSponges[0] || "");
    }
  }, [shopifyProducts, customSetup, customSetup2, forehandThickness, backhandThickness]);

  // Helper to find Shopify product by name
  const findShopifyProduct = (productName: string) => {
    return shopifyProducts.find(p => 
      p.node.title.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(p.node.title.toLowerCase())
    );
  };

  // Helper to get available sponge sizes from a rubber product
  const getAvailableSponges = (productName: string): string[] => {
    const product = findShopifyProduct(productName);
    if (!product) return [];
    
    const spongeOption = product.node.options.find(opt => opt.name === "Sponge Thickness");
    return spongeOption?.values || [];
  };

  // Helper to check if product has a specific option
  const hasProductOption = (product: ShopifyProduct, optionName: string): boolean => {
    return product.node.options.some(opt => opt.name === optionName);
  };

  // Helper to get available color for a rubber product
  const getAvailableColor = (product: ShopifyProduct, preferredColor: string): string | null => {
    const colorOption = product.node.options.find(opt => opt.name === "Color");
    if (!colorOption || colorOption.values.length === 0) return null;
    
    // Check if preferred color is available
    if (colorOption.values.some(v => v.toLowerCase() === preferredColor.toLowerCase())) {
      return preferredColor;
    }
    
    // Return first available color as fallback
    return colorOption.values[0];
  };

  // Helper to find variant with specific options - matching Configurator logic
  const findMatchingVariant = (
    product: ShopifyProduct,
    options: Array<{ name: string; value: string }>
  ): string | null => {
    const variants = product.node.variants.edges;
    
    // Try exact match
    for (const variant of variants) {
      const variantOptions = variant.node.selectedOptions;
      const allMatch = options.every(requiredOption => 
        variantOptions.some(variantOption => 
          variantOption.name === requiredOption.name && 
          variantOption.value === requiredOption.value
        )
      );
      
      if (allMatch && variant.node.availableForSale) {
        return variant.node.id;
      }
    }
    
    // Try flexible match
    for (const variant of variants) {
      const variantOptions = variant.node.selectedOptions;
      const allMatch = options.every(requiredOption => 
        variantOptions.some(variantOption => {
          if (variantOption.name !== requiredOption.name) return false;
          const shopifyValue = variantOption.value.toLowerCase();
          const requestedValue = requiredOption.value.toLowerCase();
          return shopifyValue === requestedValue || 
                 shopifyValue.startsWith(requestedValue + ' ') ||
                 shopifyValue.startsWith(requestedValue + '(');
        })
      );
      
      if (allMatch && variant.node.availableForSale) {
        return variant.node.id;
      }
    }
    
    return null;
  };

  // Helper to validate and get closest available sponge thickness
  const getValidatedThickness = (idealThickness: string, rubber: any) => {
    const availableSizes = rubber.Rubber_Sponge_Sizes || [];
    if (availableSizes.length === 0) return idealThickness;
    
    // Parse thickness
    const parseThickness = (t: string) => {
      const match = t.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 2.0;
    };
    
    const target = parseThickness(idealThickness);
    let closest = availableSizes[0];
    let closestDiff = Math.abs(parseThickness(closest) - target);
    
    for (const size of availableSizes) {
      const diff = Math.abs(parseThickness(size) - target);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = size;
      }
    }
    
    return closest;
  };

  // Navigate to configurator with pre-selected items
  const handleViewInConfigurator = (item: typeof allRecommendations[0]) => {
    if (item.type === 'preAssembled' || item.type === 'preAssembled2') {
      const racket = item.data;
      navigate(`/configurator?preassembled=true&racket=${encodeURIComponent(racket.Racket_Name)}&handle=${encodeURIComponent(handleType)}`);
    } else {
      const setup = item.data as CustomSetup;
      
      // VALIDATE sponge thicknesses against available options
      const fhThickness = getValidatedThickness(
        setup.forehandThickness || forehandThickness, 
        setup.forehandRubber
      );
      const bhThickness = getValidatedThickness(
        setup.backhandThickness || backhandThickness, 
        setup.backhandRubber
      );
      
      navigate(`/configurator?blade=${encodeURIComponent(setup.blade.Blade_Name)}&fh=${encodeURIComponent(setup.forehandRubber.Rubber_Name)}&bh=${encodeURIComponent(setup.backhandRubber.Rubber_Name)}&handle=${encodeURIComponent(handleType)}&fhThickness=${encodeURIComponent(fhThickness)}&bhThickness=${encodeURIComponent(bhThickness)}`);
    }
  };

  // Add to comparison
  const handleAddToCompare = (item: typeof allRecommendations[0]) => {
    let paddle: ComparisonPaddle;
    
    if (item.type === 'preAssembled' || item.type === 'preAssembled2') {
      const racket = item.data;
      paddle = {
        id: `pre-${racket.Racket_Name}`,
        name: racket.Racket_Name,
        image: racket.Racket_Image || '',
        speed: racket.Racket_Speed,
        control: racket.Racket_Control,
        power: racket.Racket_Power,
        spin: racket.Racket_Spin,
        price: racket.Racket_Price,
        weight: 180,
        level: racket.Racket_Level as "Beginner" | "Intermediate" | "Advanced"
      };
    } else {
      const setup = item.data as CustomSetup;
      const bladeWeight = estimateBladeWeight(setup.blade);
      const fhWeight = estimateRubberWeight(setup.forehandRubber);
      const bhWeight = estimateRubberWeight(setup.backhandRubber);
      const totalWeight = bladeWeight + fhWeight + bhWeight;
      
      // VALIDATE sponge thicknesses against available options
      const fhThickness = getValidatedThickness(
        setup.forehandThickness || forehandThickness, 
        setup.forehandRubber
      );
      const bhThickness = getValidatedThickness(
        setup.backhandThickness || backhandThickness, 
        setup.backhandRubber
      );
      
      const combinedSpeed = Math.round((setup.blade.Blade_Speed + setup.forehandRubber.Rubber_Speed + setup.backhandRubber.Rubber_Speed) / 3);
      const combinedSpin = Math.round((setup.forehandRubber.Rubber_Spin + setup.backhandRubber.Rubber_Spin) / 2);
      const combinedControl = Math.round((setup.blade.Blade_Control + setup.forehandRubber.Rubber_Control + setup.backhandRubber.Rubber_Control) / 3);
      const combinedPower = Math.round((setup.blade.Blade_Power + setup.forehandRubber.Rubber_Speed + setup.backhandRubber.Rubber_Speed) / 3);
      
      paddle = {
        id: `custom-${setup.blade.Blade_Name}-${setup.forehandRubber.Rubber_Name}-${setup.backhandRubber.Rubber_Name}`,
        name: `Custom Setup: ${setup.blade.Blade_Name}`,
        image: setup.blade.Blade_Image || '',
        speed: combinedSpeed,
        control: combinedControl,
        power: combinedPower,
        spin: combinedSpin,
        price: setup.totalPrice,
        weight: totalWeight,
        level: setup.blade.Blade_Level as "Beginner" | "Intermediate" | "Advanced",
        blade: setup.blade.Blade_Name,
        forehandRubber: setup.forehandRubber.Rubber_Name,
        backhandRubber: setup.backhandRubber.Rubber_Name,
        forehandSponge: fhThickness,
        backhandSponge: bhThickness,
        bladeStats: {
          speed: setup.blade.Blade_Speed,
          control: setup.blade.Blade_Control,
          power: setup.blade.Blade_Power,
          spin: 0,
          price: setup.blade.Blade_Price
        },
        forehandStats: {
          speed: setup.forehandRubber.Rubber_Speed,
          control: setup.forehandRubber.Rubber_Control,
          power: setup.forehandRubber.Rubber_Speed,
          spin: setup.forehandRubber.Rubber_Spin,
          price: setup.forehandRubber.Rubber_Price
        },
        backhandStats: {
          speed: setup.backhandRubber.Rubber_Speed,
          control: setup.backhandRubber.Rubber_Control,
          power: setup.backhandRubber.Rubber_Speed,
          spin: setup.backhandRubber.Rubber_Spin,
          price: setup.backhandRubber.Rubber_Price
        }
      };
    }
    
    if (comparisonPaddles.length >= 3) {
      toast.error("Comparison is full", { 
        description: "Please clear the comparison section to add more paddles" 
      });
      return;
    }
    
    addPaddle(paddle);
    toast.success("Added to comparison", { description: paddle.name });
    navigate('/compare');
  };

  // Add to cart with Shopify integration
  const handleAddToCart = async (item: typeof allRecommendations[0]) => {
    if (isLoadingProducts) {
      toast.error("Still loading products", { description: "Please wait a moment..." });
      return;
    }

    try {
      if (item.type === 'preAssembled' || item.type === 'preAssembled2') {
        const racket = item.data;
        const shopifyProduct = findShopifyProduct(racket.Racket_Name);
        
        if (!shopifyProduct) {
          toast.error("Product not found in store", { 
            description: `${racket.Racket_Name} is not available in our store yet.` 
          });
          return;
        }

        const variantId = findMatchingVariant(shopifyProduct, [
          { name: "Grip Type", value: handleType }
        ]);
        const variant = variantId 
          ? shopifyProducts.find(p => p.node.id === shopifyProduct.node.id)?.node.variants.edges.find(v => v.node.id === variantId)?.node
          : shopifyProduct.node.variants.edges[0].node;
        
        addItem({
          product: shopifyProduct,
          variantId: variant.id,
          variantTitle: variant.title,
          price: variant.price,
          quantity: 1,
          selectedOptions: variant.selectedOptions
        });

        toast.success("Added to cart!", { description: racket.Racket_Name });
      } else {
        const setup = item.data as CustomSetup;
        const isSetup1 = item.type === 'custom1';
        
        // Get user-selected sponge sizes
        const fhThickness = isSetup1 ? custom1ForehandSponge : custom2ForehandSponge;
        const bhThickness = isSetup1 ? custom1BackhandSponge : custom2BackhandSponge;
        
        if (!fhThickness || !bhThickness) {
          toast.error("Please select sponge sizes", { 
            description: "Choose sponge thickness for both forehand and backhand rubbers" 
          });
          return;
        }
        
        // Find all required products
        const bladeProduct = findShopifyProduct(setup.blade.Blade_Name);
        const fhProduct = findShopifyProduct(setup.forehandRubber.Rubber_Name);
        const bhProduct = findShopifyProduct(setup.backhandRubber.Rubber_Name);
        
        // Check if all products exist
        const missingProducts: string[] = [];
        if (!bladeProduct) missingProducts.push(setup.blade.Blade_Name);
        if (!fhProduct) missingProducts.push(setup.forehandRubber.Rubber_Name);
        if (!bhProduct) missingProducts.push(setup.backhandRubber.Rubber_Name);
        
        if (missingProducts.length > 0) {
          toast.error("Setup incomplete", { 
            description: `Products not found: ${missingProducts.join(", ")}` 
          });
          return;
        }
        
        // Find blade variant (only Grip Type)
        const bladeVariantId = findMatchingVariant(bladeProduct!, [
          { name: "Grip Type", value: handleType }
        ]);
        
        // Build forehand rubber options dynamically
        const fhOptions: Array<{ name: string; value: string }> = [
          { name: "Sponge Thickness", value: fhThickness }
        ];
        let fhColorUsed: string | null = null;
        if (hasProductOption(fhProduct!, "Color")) {
          fhColorUsed = getAvailableColor(fhProduct!, "Red");
          if (fhColorUsed) {
            fhOptions.push({ name: "Color", value: fhColorUsed });
          }
        }
        const fhVariantId = findMatchingVariant(fhProduct!, fhOptions);
        
        // Build backhand rubber options dynamically
        const bhOptions: Array<{ name: string; value: string }> = [
          { name: "Sponge Thickness", value: bhThickness }
        ];
        let bhColorUsed: string | null = null;
        if (hasProductOption(bhProduct!, "Color")) {
          bhColorUsed = getAvailableColor(bhProduct!, "Black");
          if (!bhColorUsed && fhColorUsed) {
            const colorOption = bhProduct!.node.options.find(opt => opt.name === "Color");
            if (colorOption && colorOption.values.length > 1) {
              bhColorUsed = colorOption.values.find(c => c !== fhColorUsed) || colorOption.values[0];
            }
          }
          if (bhColorUsed) {
            bhOptions.push({ name: "Color", value: bhColorUsed });
          }
        }
        const bhVariantId = findMatchingVariant(bhProduct!, bhOptions);
        
        // Check if all variants exist
        if (!bladeVariantId || !fhVariantId || !bhVariantId) {
          toast.error("Configuration unavailable", { 
            description: "One or more products with the selected options are not available" 
          });
          return;
        }
        
        // Get variant objects
        const bladeVariant = bladeProduct!.node.variants.edges.find(v => v.node.id === bladeVariantId)!.node;
        const fhVariant = fhProduct!.node.variants.edges.find(v => v.node.id === fhVariantId)!.node;
        const bhVariant = bhProduct!.node.variants.edges.find(v => v.node.id === bhVariantId)!.node;
        
        // ========== PHASE 2: EXECUTION (ADD ALL ITEMS) ==========
        // Add blade
        addItem({
          product: bladeProduct!,
          variantId: bladeVariant.id,
          variantTitle: bladeVariant.title,
          price: bladeVariant.price,
          quantity: 1,
          selectedOptions: bladeVariant.selectedOptions
        });
        
        // Add forehand rubber
        addItem({
          product: fhProduct!,
          variantId: fhVariant.id,
          variantTitle: fhVariant.title,
          price: fhVariant.price,
          quantity: 1,
          selectedOptions: fhVariant.selectedOptions
        });
        
        // Add backhand rubber
        addItem({
          product: bhProduct!,
          variantId: bhVariant.id,
          variantTitle: bhVariant.title,
          price: bhVariant.price,
          quantity: 1,
          selectedOptions: bhVariant.selectedOptions
        });
        
        let itemCount = 3; // blade + 2 rubbers
        
        // Add assembly service if requested
        const shouldAssemble = (item.type === 'custom1' && assembleCustom1) || (item.type === 'custom2' && assembleCustom2);
        if (shouldAssemble) {
          const assemblyProduct = shopifyProducts.find(p => 
            p.node.title.toLowerCase().includes("racket assembly service") ||
            p.node.title.toLowerCase().includes("assembly service")
          );

          if (assemblyProduct) {
            const assemblyVariant = assemblyProduct.node.variants.edges[0].node;
            addItem({
              product: assemblyProduct,
              variantId: assemblyVariant.id,
              variantTitle: assemblyVariant.title,
              price: assemblyVariant.price,
              quantity: 1,
              selectedOptions: assemblyVariant.selectedOptions
            });
            itemCount++;
          }
        }
        
        // Add seal service if requested
        const shouldSeal = (item.type === 'custom1' && sealCustom1) || (item.type === 'custom2' && sealCustom2);
        if (shouldSeal) {
          const sealProduct = shopifyProducts.find(p => 
            p.node.title.toLowerCase().includes("edge seal service") ||
            p.node.title.toLowerCase().includes("seal service")
          );

          if (sealProduct) {
            const sealVariant = sealProduct.node.variants.edges[0].node;
            addItem({
              product: sealProduct,
              variantId: sealVariant.id,
              variantTitle: sealVariant.title,
              price: sealVariant.price,
              quantity: 1,
              selectedOptions: sealVariant.selectedOptions
            });
            itemCount++;
          }
        }

        toast.success(`Added ${itemCount} items to cart!`, { 
          description: "Complete custom setup added"
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart", { 
        description: "Please try again or contact support." 
      });
    }
  };
  
  // Create array of all recommendations sorted by match score
  let allRecommendations = [
    preAssembled ? { type: 'preAssembled' as const, score: preAssembled.score, data: preAssembled, rank: 1 } : null,
    preAssembled2 ? { type: 'preAssembled2' as const, score: preAssembled2.score, data: preAssembled2, rank: 2 } : null,
    customSetup ? { type: 'custom1' as const, score: customSetup.score, data: customSetup, rank: 1 } : null,
    customSetup2 ? { type: 'custom2' as const, score: customSetup2.score, data: customSetup2, rank: 2 } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null)
   .sort((a, b) => {
     // For intermediate/advanced players, prioritize custom setups over pre-assembled
     if (playerLevel === 'Intermediate' || playerLevel === 'Advanced') {
       if ((a.type === 'preAssembled' || a.type === 'preAssembled2') && (b.type !== 'preAssembled' && b.type !== 'preAssembled2')) return 1;
       if ((a.type !== 'preAssembled' && a.type !== 'preAssembled2') && (b.type === 'preAssembled' || b.type === 'preAssembled2')) return -1;
     }
     // Otherwise sort by match score descending
     return b.score - a.score;
   });

  // Filter based on assembly preference to show exactly 2 rackets
  if (assemblyPreference === "Ready-to-play racket") {
    // Show only pre-assembled rackets (max 2)
    allRecommendations = allRecommendations.filter(item => item.type === 'preAssembled' || item.type === 'preAssembled2').slice(0, 2);
  } else if (assemblyPreference === "Custom setup") {
    // Show only custom setups (max 2)
    allRecommendations = allRecommendations.filter(item => item.type !== 'preAssembled' && item.type !== 'preAssembled2').slice(0, 2);
  } else if (assemblyPreference === "Not sure") {
    // Show 1 custom and 1 pre-assembled
    const customOptions = allRecommendations.filter(item => item.type !== 'preAssembled' && item.type !== 'preAssembled2').slice(0, 1);
    const preAssembledOptions = allRecommendations.filter(item => item.type === 'preAssembled' || item.type === 'preAssembled2').slice(0, 1);
    allRecommendations = [...customOptions, ...preAssembledOptions];
  } else {
    // Default: show top 2 of any type
    allRecommendations = allRecommendations.slice(0, 2);
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500 dark:text-green-400";
    if (score >= 70) return "text-yellow-500 dark:text-yellow-400";
    return "text-orange-500 dark:text-orange-400";
  };


  const statDescriptions = {
    speed: "How fast the ball travels off your paddle",
    spin: "Your ability to curve and control ball trajectory",
    control: "Precision and accuracy of ball placement",
    power: "Force and impact behind each shot"
  };

  const StatSlider = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{label}</span>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">{statDescriptions[label.toLowerCase() as keyof typeof statDescriptions]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
      <Slider value={[value]} max={100} disabled className="cursor-default" />
    </div>
  );

  // Premium hero card for best match
  const HeroCard = ({ item, rank, fhSponge, bhSponge, onFhSpongeChange, onBhSpongeChange }: { 
    item: typeof allRecommendations[0]; 
    rank?: number;
    fhSponge?: string;
    bhSponge?: string;
    onFhSpongeChange?: (value: string) => void;
    onBhSpongeChange?: (value: string) => void;
  }) => {
    const isPreAssembled = item.type === 'preAssembled' || item.type === 'preAssembled2';
    const racket = isPreAssembled ? item.data : null;
    const setup = !isPreAssembled ? (item.data as CustomSetup) : null;
    
    const name = racket ? racket.Racket_Name : setup?.blade.Blade_Name || '';
    const price = racket ? racket.Racket_Price : setup?.totalPrice || 0;
    const level = racket ? racket.Racket_Level : setup?.blade.Blade_Level || '';
    const score = item.score;
    
    const stats = racket ? {
      speed: racket.Racket_Speed,
      spin: racket.Racket_Spin,
      control: racket.Racket_Control,
      power: racket.Racket_Power
    } : {
      speed: Math.round((setup!.blade.Blade_Speed + setup!.forehandRubber.Rubber_Speed + setup!.backhandRubber.Rubber_Speed) / 3),
      spin: Math.round((setup!.forehandRubber.Rubber_Spin + setup!.backhandRubber.Rubber_Spin) / 2),
      control: Math.round((setup!.blade.Blade_Control + setup!.forehandRubber.Rubber_Control + setup!.backhandRubber.Rubber_Control) / 3),
      power: Math.round((setup!.blade.Blade_Power + setup!.forehandRubber.Rubber_Speed + setup!.backhandRubber.Rubber_Speed) / 3)
    };

    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 shadow-2xl">
        {/* Hero Header */}
        <div className="px-8 pt-12 pb-8 text-center space-y-4">
          <Badge variant="default" className="text-xs font-medium px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Perfect Match for You
          </Badge>
          
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {name}
          </h2>
          
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Badge variant="outline" className="text-xs font-normal">
              {level}
            </Badge>
            <span className="text-sm">•</span>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-foreground">{score.toFixed(0)}% Match</span>
            </div>
            <span className="text-sm">•</span>
            <Badge variant="outline" className="text-xs font-normal">
              {isPreAssembled ? 'Ready to Play' : 'Custom Setup'}
            </Badge>
          </div>

          {/* Product Images */}
          <div className="max-w-3xl mx-auto mt-8 mb-6">
            {isPreAssembled ? (
              <div className="flex justify-center">
                <div className="text-center space-y-3">
                  <div className="aspect-square w-64 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center space-y-2 px-4">
                      <div className="text-6xl">🏓</div>
                      <p className="text-xs text-muted-foreground">Racket image</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{handleType} Handle</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6 items-start">
                {/* Forehand Rubber */}
                 <div className="text-center space-y-3">
                  <div className="aspect-square rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center space-y-2 px-4">
                      <div className="text-5xl">🔴</div>
                      <p className="text-xs text-muted-foreground">Forehand rubber</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground leading-tight">{setup!.forehandRubber.Rubber_Name}</p>
                    <div className="space-y-1">
                      <Label htmlFor="fh-sponge-hero" className="text-xs text-muted-foreground">Sponge Thickness</Label>
                      <Select value={fhSponge} onValueChange={onFhSpongeChange}>
                        <SelectTrigger id="fh-sponge-hero" className="h-8 text-xs">
                          <SelectValue placeholder="Select thickness" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableSponges(setup!.forehandRubber.Rubber_Name).map(size => {
                            const recommended = getValidatedThickness(setup!.forehandThickness || forehandThickness, setup!.forehandRubber);
                            return (
                              <SelectItem key={size} value={size}>
                                {size} {size === recommended && '★ Recommended'}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Blade */}
                <div className="text-center space-y-3">
                  <div className="aspect-square rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center space-y-2 px-4">
                      <div className="text-5xl">🏓</div>
                      <p className="text-xs text-muted-foreground">Blade</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground leading-tight">{setup!.blade.Blade_Name}</p>
                    <p className="text-xs text-muted-foreground">Handle: {handleType}</p>
                  </div>
                </div>

                {/* Backhand Rubber */}
                <div className="text-center space-y-3">
                  <div className="aspect-square rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center space-y-2 px-4">
                      <div className="text-5xl">⚫</div>
                      <p className="text-xs text-muted-foreground">Backhand rubber</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground leading-tight">{setup!.backhandRubber.Rubber_Name}</p>
                    <div className="space-y-1">
                      <Label htmlFor="bh-sponge-hero" className="text-xs text-muted-foreground">Sponge Thickness</Label>
                      <Select value={bhSponge} onValueChange={onBhSpongeChange}>
                        <SelectTrigger id="bh-sponge-hero" className="h-8 text-xs">
                          <SelectValue placeholder="Select thickness" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableSponges(setup!.backhandRubber.Rubber_Name).map(size => {
                            const recommended = getValidatedThickness(setup!.backhandThickness || backhandThickness, setup!.backhandRubber);
                            return (
                              <SelectItem key={size} value={size}>
                                {size} {size === recommended && '★ Recommended'}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">Starting at</p>
            <p className="text-5xl font-semibold text-foreground tracking-tight">{formatPrice(price)}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-8 pb-8">
          <div className="max-w-2xl mx-auto space-y-6 bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
            <h3 className="text-lg font-semibold text-center text-foreground">Performance</h3>
            <div className="grid gap-6">
              <StatSlider label="Speed" value={stats.speed} icon={Gauge} />
              <StatSlider label="Spin" value={stats.spin} icon={Target} />
              <StatSlider label="Control" value={stats.control} icon={Shield} />
              <StatSlider label="Power" value={stats.power} icon={Star} />
            </div>
          </div>
        </div>

        {/* Recommendation Summary */}
        <div className="px-8 pb-8">
          <div className="max-w-2xl mx-auto bg-accent/5 rounded-2xl p-6 border border-accent/20">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Why this is perfect for you
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isPreAssembled 
                ? "This ready-to-play racket matches your skill level and playing style perfectly. No assembly required — just unbox and start playing immediately."
                : `This custom setup combines ${setup?.blade.Blade_Name} with premium rubbers tailored to your preferences. It offers the perfect balance of performance characteristics you're looking for.`
              }
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="px-8 pb-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <Button 
              onClick={() => handleAddToCart(item)}
              size="lg"
              className="w-full h-14 text-base font-medium rounded-full"
              disabled={isLoadingProducts}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleViewInConfigurator(item)}
                variant="outline"
                size="lg"
                className="h-12 text-sm font-medium rounded-full"
              >
                More Info
              </Button>
              <Button 
                onClick={() => handleAddToCompare(item)}
                variant="outline"
                size="lg"
                className="h-12 text-sm font-medium rounded-full"
              >
                Compare
              </Button>
            </div>
          </div>
        </div>

        {/* Assembly and Seal Options for Custom */}
        {!isPreAssembled && setup && (
          <div className="px-8 pb-12">
            <div className="max-w-2xl mx-auto space-y-3">
              {/* Assembly Service */}
              <div className="bg-muted/30 rounded-2xl p-6 border border-border/30">
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Free Professional Assembly</p>
                      <p className="text-xs text-muted-foreground">
                        We'll expertly glue your rubbers to your blade at no extra cost.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="assemble-hero"
                        checked={assembleCustom1}
                        onCheckedChange={(checked) => setAssembleCustom1(!!checked)}
                      />
                      <Label 
                        htmlFor="assemble-hero"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Assemble my racket (Free)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seal Service */}
              <div className="bg-muted/30 rounded-2xl p-6 border border-border/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Edge Tape Seal Service</p>
                      <p className="text-xs text-muted-foreground">
                        Protect your blade with professional edge tape application for extended durability.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="seal-hero"
                        checked={sealCustom1}
                        onCheckedChange={(checked) => setSealCustom1(!!checked)}
                      />
                      <Label 
                        htmlFor="seal-hero"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Add edge tape seal ($5.00)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Alternative option card (simpler, clean)
  const AlternativeCard = ({ item, rank, fhSponge, bhSponge, onFhSpongeChange, onBhSpongeChange }: { 
    item: typeof allRecommendations[0]; 
    rank?: number;
    fhSponge?: string;
    bhSponge?: string;
    onFhSpongeChange?: (value: string) => void;
    onBhSpongeChange?: (value: string) => void;
  }) => {
    const isPreAssembled = item.type === 'preAssembled' || item.type === 'preAssembled2';
    const racket = isPreAssembled ? item.data : null;
    const setup = !isPreAssembled ? (item.data as CustomSetup) : null;
    
    const name = racket ? racket.Racket_Name : setup?.blade.Blade_Name || '';
    const price = racket ? racket.Racket_Price : setup?.totalPrice || 0;
    const level = racket ? racket.Racket_Level : setup?.blade.Blade_Level || '';
    const score = item.score;
    
    const stats = racket ? {
      speed: racket.Racket_Speed,
      spin: racket.Racket_Spin,
      control: racket.Racket_Control,
      power: racket.Racket_Power
    } : {
      speed: Math.round((setup!.blade.Blade_Speed + setup!.forehandRubber.Rubber_Speed + setup!.backhandRubber.Rubber_Speed) / 3),
      spin: Math.round((setup!.forehandRubber.Rubber_Spin + setup!.backhandRubber.Rubber_Spin) / 2),
      control: Math.round((setup!.blade.Blade_Control + setup!.forehandRubber.Rubber_Control + setup!.backhandRubber.Rubber_Control) / 3),
      power: Math.round((setup!.blade.Blade_Power + setup!.forehandRubber.Rubber_Speed + setup!.backhandRubber.Rubber_Speed) / 3)
    };

    const budgetDiff = budgetAmount ? Math.abs(price - budgetAmount) : 0;
    const isHigherBudget = budgetAmount ? price > budgetAmount : false;
    
    return (
      <div className="rounded-2xl bg-card border border-border/50 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Badge variant="outline" className="text-xs">
                {isPreAssembled ? 'Ready to Play' : 'Custom Setup'}
              </Badge>
              <h3 className="font-semibold text-xl text-foreground">{name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{level}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span>{score.toFixed(0)}% Match</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-foreground">{formatPrice(price)}</p>
              {budgetAmount && (
                <p className="text-xs text-muted-foreground">
                  {isHigherBudget ? `+${formatPrice(budgetDiff)} more` : `${formatPrice(budgetDiff)} under budget`}
                </p>
              )}
            </div>
          </div>

          {/* Placeholder Image */}
          <div className="aspect-[16/9] rounded-xl bg-muted/20 border border-border/30 flex items-center justify-center">
            <div className="text-center space-y-1">
              <div className="text-4xl">🏓</div>
              <p className="text-xs text-muted-foreground">Product image</p>
            </div>
          </div>

          {/* Sponge Selection for Custom Setups */}
          {!isPreAssembled && setup && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`fh-sponge-alt-${rank}`} className="text-xs font-medium text-foreground">Forehand Sponge</Label>
                <Select value={fhSponge} onValueChange={onFhSpongeChange}>
                  <SelectTrigger id={`fh-sponge-alt-${rank}`} className="h-9 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSponges(setup.forehandRubber.Rubber_Name).map(size => {
                      const recommended = getValidatedThickness(setup.forehandThickness || forehandThickness, setup.forehandRubber);
                      return (
                        <SelectItem key={size} value={size}>
                          {size} {size === recommended && '★'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`bh-sponge-alt-${rank}`} className="text-xs font-medium text-foreground">Backhand Sponge</Label>
                <Select value={bhSponge} onValueChange={onBhSpongeChange}>
                  <SelectTrigger id={`bh-sponge-alt-${rank}`} className="h-9 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSponges(setup.backhandRubber.Rubber_Name).map(size => {
                      const recommended = getValidatedThickness(setup.backhandThickness || backhandThickness, setup.backhandRubber);
                      return (
                        <SelectItem key={size} value={size}>
                          {size} {size === recommended && '★'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Why Different */}
          <div className="bg-muted/20 rounded-xl p-4">
            <p className="text-xs font-medium text-foreground mb-1">Why consider this option:</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isHigherBudget 
                ? `Higher performance tier with enhanced characteristics. Worth the extra ${formatPrice(budgetDiff)} for serious players.`
                : `Great value option that stays under budget while maintaining quality performance.`
              }
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-3 py-2">
            {[
              { label: 'Speed', value: stats.speed },
              { label: 'Spin', value: stats.spin },
              { label: 'Control', value: stats.control },
              { label: 'Power', value: stats.power }
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-sm font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <Button 
              onClick={() => handleAddToCart(item)}
              size="lg"
              className="w-full h-12 text-sm rounded-full"
              disabled={isLoadingProducts}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleViewInConfigurator(item)}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                More Info
              </Button>
              <Button 
                onClick={() => handleAddToCompare(item)}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                Compare
              </Button>
            </div>
          </div>

          {/* Assembly and Seal for custom */}
          {!isPreAssembled && setup && (
            <div className="space-y-2">
              <div className="bg-muted/20 rounded-xl p-3 border border-border/30">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`assemble-alt-${rank}`}
                    checked={assembleCustom2}
                    onCheckedChange={(checked) => setAssembleCustom2(!!checked)}
                  />
                  <Label 
                    htmlFor={`assemble-alt-${rank}`}
                    className="text-xs font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Wrench className="w-3 h-3" />
                    Free professional assembly
                  </Label>
                </div>
              </div>
              
              <div className="bg-muted/20 rounded-xl p-3 border border-border/30">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`seal-alt-${rank}`}
                    checked={sealCustom2}
                    onCheckedChange={(checked) => setSealCustom2(!!checked)}
                  />
                  <Label 
                    htmlFor={`seal-alt-${rank}`}
                    className="text-xs font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    Add edge tape seal ($5.00)
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto space-y-16 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="outline" className="text-xs font-normal px-4 py-1.5">
          Quiz Results
        </Badge>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">
          Your Perfect Match
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Based on your playing style and preferences, we've found the ideal setup to elevate your game.
        </p>
      </div>

      {/* Budget Warning */}
      {budgetAmount && budgetAmount < 60 && (
        <div className="max-w-2xl mx-auto bg-accent/5 border border-accent/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-left space-y-1">
              <p className="text-sm font-medium text-foreground">Budget Consideration</p>
              <p className="text-sm text-muted-foreground">
                Your budget is best suited for pre-assembled rackets. Custom setups typically start at $90+ due to individual component costs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Low Match Score Warning */}
      {allRecommendations.length > 0 && allRecommendations[0].score < 60 && (
        <div className="max-w-2xl mx-auto bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-left space-y-1">
              <p className="text-sm font-medium text-foreground">Limited Matches Found</p>
              <p className="text-sm text-muted-foreground">
                The recommendations below have a lower match score. Consider adjusting your budget or brand preferences for better results.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Best Match - Hero Card */}
      {allRecommendations.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <HeroCard 
            item={allRecommendations[0]} 
            rank={1}
            fhSponge={custom1ForehandSponge}
            bhSponge={custom1BackhandSponge}
            onFhSpongeChange={setCustom1ForehandSponge}
            onBhSpongeChange={setCustom1BackhandSponge}
          />
        </div>
      )}

      {/* Alternative Options */}
      {allRecommendations.length > 1 && (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-headline text-3xl font-bold text-foreground">
              Alternative Options
            </h2>
            <p className="text-muted-foreground">
              Other great choices that also match your preferences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {allRecommendations.slice(1).map((item, index) => {
              const isCustom1 = item.type === 'custom1';
              const isCustom2 = item.type === 'custom2';
              
              return (
                <AlternativeCard 
                  key={`${item.type}-${index}`} 
                  item={item} 
                  rank={index + 2}
                  fhSponge={isCustom2 ? custom2ForehandSponge : custom1ForehandSponge}
                  bhSponge={isCustom2 ? custom2BackhandSponge : custom1BackhandSponge}
                  onFhSpongeChange={isCustom2 ? setCustom2ForehandSponge : setCustom1ForehandSponge}
                  onBhSpongeChange={isCustom2 ? setCustom2BackhandSponge : setCustom1BackhandSponge}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Adjust Preferences Section */}
      <div className="max-w-3xl mx-auto">
        <Collapsible open={showPreferenceEditor} onOpenChange={setShowPreferenceEditor}>
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors rounded-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-semibold text-lg">Adjust Preferences</span>
                </div>
                {showPreferenceEditor ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-6 pt-0 space-y-6 border-t border-border/30">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Budget Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">
                      Budget Range
                    </label>
                    <Select value={tempBudget} onValueChange={setTempBudget}>
                      <SelectTrigger className="w-full h-12 rounded-xl">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<50$">Under $50</SelectItem>
                        <SelectItem value="<100$">Under $100</SelectItem>
                        <SelectItem value="<120$">Under $120</SelectItem>
                        <SelectItem value="<140$">Under $140</SelectItem>
                        <SelectItem value="<160$">Under $160</SelectItem>
                        <SelectItem value="<180$">Under $180</SelectItem>
                        <SelectItem value="<200$">Under $200</SelectItem>
                        <SelectItem value="<250$">Under $250</SelectItem>
                        <SelectItem value="<300$">Under $300</SelectItem>
                        <SelectItem value="No limit">No Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Brand Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">
                      Preferred Brands
                    </label>
                    <BrandSelector 
                      selectedBrands={tempBrands}
                      onBrandToggle={(brand) => {
                        setTempBrands(prev => {
                          if (prev.includes(brand)) {
                            const newBrands = prev.filter(b => b !== brand);
                            return newBrands.length === 0 ? [brand] : newBrands;
                          } else {
                            return [...prev, brand];
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    if (onUpdatePreferences) {
                      onUpdatePreferences(tempBudget, tempBrands);
                      setShowPreferenceEditor(false);
                    }
                  }}
                  className="w-full h-12 text-base rounded-full"
                  size="lg"
                >
                  Update Recommendations
                </Button>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>

      {/* Bottom Actions */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Button 
          onClick={onRestart}
          variant="outline" 
          size="lg"
          className="h-12 px-8 rounded-full"
        >
          Retake Quiz
        </Button>
        
        <p className="text-xs text-muted-foreground">
          *Prices are estimates and may vary by retailer and region
        </p>
      </div>

      {/* No Results Fallback */}
      {!preAssembled && !customSetup && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
              <Info className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-xl text-foreground">No Matches Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find options matching your current preferences. Try adjusting your budget or brand selections above.
            </p>
            <Button onClick={onRestart} size="lg" className="mt-6 rounded-full">
              Retake Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}