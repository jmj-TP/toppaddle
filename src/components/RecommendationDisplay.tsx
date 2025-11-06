import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star, Target, Gauge, Shield, Info, Weight, ChevronDown, ChevronUp, Settings, DollarSign, Package, ShoppingCart, Wrench } from "lucide-react";
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

  // Helper to find Shopify product by name
  const findShopifyProduct = (productName: string) => {
    return shopifyProducts.find(p => 
      p.node.title.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(p.node.title.toLowerCase())
    );
  };

  // Helper to find variant with specific options
  const findVariant = (product: ShopifyProduct, options: { [key: string]: string }) => {
    return product.node.variants.edges.find(variant => {
      return Object.entries(options).every(([key, value]) => {
        return variant.node.selectedOptions.some(opt => 
          opt.name.toLowerCase() === key.toLowerCase() && 
          opt.value.toLowerCase() === value.toLowerCase()
        );
      });
    })?.node;
  };

  // Navigate to configurator with pre-selected items
  const handleViewInConfigurator = (item: typeof allRecommendations[0]) => {
    if (item.type === 'preAssembled' || item.type === 'preAssembled2') {
      const racket = item.data;
      navigate(`/configurator?preassembled=true&racket=${encodeURIComponent(racket.Racket_Name)}&handle=${encodeURIComponent(handleType)}`);
    } else {
      const setup = item.data as CustomSetup;
      navigate(`/configurator?blade=${encodeURIComponent(setup.blade.Blade_Name)}&fh=${encodeURIComponent(setup.forehandRubber.Rubber_Name)}&bh=${encodeURIComponent(setup.backhandRubber.Rubber_Name)}&handle=${encodeURIComponent(handleType)}&fhThickness=${encodeURIComponent(forehandThickness)}&bhThickness=${encodeURIComponent(backhandThickness)}`);
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
        forehandSponge: forehandThickness,
        backhandSponge: backhandThickness,
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

        const variant = findVariant(shopifyProduct, { handle: handleType }) || shopifyProduct.node.variants.edges[0].node;
        
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
        
        // Find blade
        const bladeProduct = findShopifyProduct(setup.blade.Blade_Name);
        if (bladeProduct) {
          const bladeVariant = findVariant(bladeProduct, { handle: handleType }) || bladeProduct.node.variants.edges[0].node;
          addItem({
            product: bladeProduct,
            variantId: bladeVariant.id,
            variantTitle: bladeVariant.title,
            price: bladeVariant.price,
            quantity: 1,
            selectedOptions: bladeVariant.selectedOptions
          });
        }

        // Find forehand rubber
        const fhProduct = findShopifyProduct(setup.forehandRubber.Rubber_Name);
        if (fhProduct) {
          const fhVariant = findVariant(fhProduct, { 
            thickness: forehandThickness, 
            color: "Red" 
          }) || fhProduct.node.variants.edges[0].node;
          addItem({
            product: fhProduct,
            variantId: fhVariant.id,
            variantTitle: fhVariant.title,
            price: fhVariant.price,
            quantity: 1,
            selectedOptions: fhVariant.selectedOptions
          });
        }

        // Find backhand rubber
        const bhProduct = findShopifyProduct(setup.backhandRubber.Rubber_Name);
        if (bhProduct) {
          const bhVariant = findVariant(bhProduct, { 
            thickness: backhandThickness, 
            color: "Black" 
          }) || bhProduct.node.variants.edges[0].node;
          addItem({
            product: bhProduct,
            variantId: bhVariant.id,
            variantTitle: bhVariant.title,
            price: bhVariant.price,
            quantity: 1,
            selectedOptions: bhVariant.selectedOptions
          });
        }

        // Add assembly service if requested
        let assemblyAdded = false;
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
            assemblyAdded = true;
          }
        }

        const addedCount = [bladeProduct, fhProduct, bhProduct].filter(Boolean).length;
        const itemCountWithAssembly = assemblyAdded ? addedCount + 1 : addedCount;
        const description = assemblyAdded 
          ? `${itemCountWithAssembly} items added with free assembly service`
          : "Custom setup components added";

        if (addedCount > 0) {
          toast.success(`Added ${addedCount} items to cart!`, { 
            description
          });
        } else {
          toast.error("Products not found in store", { 
            description: "These items are not available yet." 
          });
        }
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


  const StatBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium min-w-[60px]">{label}:</span>
      <div className="flex-1 bg-muted rounded-full h-2">
        <div 
          className="bg-primary rounded-full h-2 transition-all duration-500" 
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-semibold min-w-[30px]">{value}</span>
    </div>
  );

  // Pre-assembled racket card component
  const PreAssembledCard = ({ racket, rank, isBest }: { racket: typeof preAssembled, rank?: number, isBest?: boolean }) => racket ? (
    <Card className={`border-border ${isBest ? 'ring-2 ring-accent shadow-accent' : ''}`} style={{ boxShadow: isBest ? "var(--shadow-accent)" : "var(--shadow-lg)" }}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isBest && <span className="text-2xl flex-shrink-0">🏆</span>}
            <span className="text-2xl flex-shrink-0">🏓</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
              <span className="font-semibold text-base sm:text-lg truncate">
                {isBest ? 'Best Match - ' : ''}Ready-to-Play Racket{rank ? ` #${rank}` : ''}
              </span>
              <Badge variant={isBest ? "default" : "secondary"} className="w-fit text-xs">
                {isBest ? 'Recommended' : 'Beginner Friendly'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span className={`font-bold text-sm ${getScoreColor(racket.score)}`}>
                {racket.score.toFixed(0)}%
              </span>
            </div>
            <ShareButton
              racketName={racket.Racket_Name}
              score={racket.score}
              price={racket.Racket_Price}
              isCustom={false}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{racket.Racket_Name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              ✅ No assembly needed - perfect for beginners!
            </p>
            
            <div className="space-y-2">
              <StatBar label="Speed" value={racket.Racket_Speed} icon={Gauge} />
              <StatBar label="Spin" value={racket.Racket_Spin} icon={Target} />
              <StatBar label="Control" value={racket.Racket_Control} icon={Shield} />
              <StatBar label="Power" value={racket.Racket_Power} icon={Star} />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Weight:</span> ~180g
              </div>
              <div>
                <span className="font-medium">Level:</span> {racket.Racket_Level}
              </div>
              <div>
                <span className="font-medium">Grip:</span> {handleType}
              </div>
              <div>
                <span className="font-medium">Price:</span> 
                <span className="text-lg font-bold text-primary ml-1">
                  {formatPrice(racket.Racket_Price)}*
                </span>
              </div>
            </div>
            
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleViewInConfigurator({ type: 'preAssembled', score: racket.score, data: racket, rank })}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Wrench className="w-3 h-3 mr-1" />
                More Info
              </Button>
              <Button 
                onClick={() => handleAddToCart({ type: 'preAssembled', score: racket.score, data: racket, rank })}
                variant="default"
                size="sm"
                className="w-full"
                disabled={isLoadingProducts}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </Button>
            </div>
            <Button 
              onClick={() => handleAddToCompare({ type: 'preAssembled', score: racket.score, data: racket, rank })}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Compare
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null;

  // Custom setup card component with collapsible details
  const CustomSetupCard = ({ setup, rank, isBest }: { setup: CustomSetup; rank?: number; isBest?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Calculate combined stats (weighted average)
    const combinedSpeed = Math.round((setup.blade.Blade_Speed + setup.forehandRubber.Rubber_Speed + setup.backhandRubber.Rubber_Speed) / 3);
    const combinedSpin = Math.round((setup.forehandRubber.Rubber_Spin + setup.backhandRubber.Rubber_Spin) / 2);
    const combinedControl = Math.round((setup.blade.Blade_Control + setup.forehandRubber.Rubber_Control + setup.backhandRubber.Rubber_Control) / 3);
    const combinedPower = Math.round((setup.blade.Blade_Power + setup.forehandRubber.Rubber_Speed + setup.backhandRubber.Rubber_Speed) / 3);
    
    const bladeWeight = estimateBladeWeight(setup.blade);
    const fhWeight = estimateRubberWeight(setup.forehandRubber);
    const bhWeight = estimateRubberWeight(setup.backhandRubber);
    const totalWeight = bladeWeight + fhWeight + bhWeight;

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={`border-border ${isBest ? 'ring-2 ring-accent shadow-accent' : ''}`} style={{ boxShadow: isBest ? "var(--shadow-accent)" : "var(--shadow-lg)" }}>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {isBest && <span className="text-2xl flex-shrink-0">🏆</span>}
                <span className="text-2xl flex-shrink-0">⚡</span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                  <span className="font-semibold text-base sm:text-lg truncate">
                    {isBest ? 'Best Match - ' : ''}Custom Setup{rank ? ` #${rank}` : ''}
                  </span>
                  <Badge variant={isBest ? "default" : "outline"} className="w-fit text-xs">
                    {isBest ? 'Recommended' : 'Advanced Choice'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span className={`font-bold text-sm ${getScoreColor(setup.score)}`}>
                    {setup.score.toFixed(0)}%
                  </span>
                </div>
                <ShareButton
                  racketName={setup.blade.Blade_Name}
                  score={setup.score}
                  price={setup.totalPrice}
                  isCustom={true}
                  forehandRubberName={setup.forehandRubber.Rubber_Name}
                  backhandRubberName={setup.backhandRubber.Rubber_Name}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Collapsed View - Mimics Ready-to-Play format */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {setup.blade.Blade_Name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  ⚡ Professional custom setup - complete control!
                </p>
                
                <div className="space-y-2">
                  <StatBar label="Speed" value={combinedSpeed} icon={Gauge} />
                  <StatBar label="Spin" value={combinedSpin} icon={Target} />
                  <StatBar label="Control" value={combinedControl} icon={Shield} />
                  <StatBar label="Power" value={combinedPower} icon={Star} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Weight:</span> ~{totalWeight}g
                  </div>
                  <div>
                    <span className="font-medium">Level:</span> {setup.blade.Blade_Level}
                  </div>
                  <div>
                    <span className="font-medium">Grip:</span> {handleType}
                  </div>
                  <div>
                    <span className="font-medium">Price:</span> 
                    <span className="text-lg font-bold text-primary ml-1">
                      {formatPrice(setup.totalPrice)}*
                    </span>
                  </div>
                </div>
                
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="accent"
                    className="w-full"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Hide Component Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        View Component Details
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                {/* Free Assembly Option */}
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <Wrench className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        TopPaddle offers free professional assembly. We'll expertly glue your rubbers to your blade.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`assemble-${rank}`}
                      checked={rank === 1 ? assembleCustom1 : assembleCustom2}
                      onCheckedChange={(checked) => rank === 1 ? setAssembleCustom1(!!checked) : setAssembleCustom2(!!checked)}
                    />
                    <Label 
                      htmlFor={`assemble-${rank}`}
                      className="text-xs font-medium cursor-pointer"
                    >
                      Assemble my racket for me (Free)
                    </Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleViewInConfigurator({ type: 'custom1', score: setup.score, data: setup, rank })}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Wrench className="w-3 h-3 mr-1" />
                    More Info
                  </Button>
                  <Button 
                    onClick={() => handleAddToCart({ type: 'custom1', score: setup.score, data: setup, rank })}
                    variant="default"
                    size="sm"
                    className="w-full"
                    disabled={isLoadingProducts}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Add to Cart
                  </Button>
                </div>
                <Button 
                  onClick={() => handleAddToCompare({ type: 'custom1', score: setup.score, data: setup, rank })}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Compare
                </Button>
              </div>
            </div>

            {/* Expanded View - Full component breakdown */}
            <CollapsibleContent className="space-y-6 pt-4 border-t">
              <div className="text-center py-2">
                <p className="text-sm font-medium text-muted-foreground">
                  📦 Component Breakdown
                </p>
              </div>

              {/* Blade */}
              <div className="border rounded-lg p-4 bg-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  🏓 Blade: {setup.blade.Blade_Name}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <StatBar label="Speed" value={setup.blade.Blade_Speed} icon={Gauge} />
                    <StatBar label="Spin" value={setup.blade.Blade_Spin} icon={Target} />
                    <StatBar label="Control" value={setup.blade.Blade_Control} icon={Shield} />
                    <StatBar label="Power" value={setup.blade.Blade_Power} icon={Star} />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Level:</span> {setup.blade.Blade_Level}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Grip:</span> {handleType}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Price:</span> 
                      <span className="font-bold ml-1">{formatPrice(setup.blade.Blade_Price)}*</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={async () => {
                        const bladeProduct = findShopifyProduct(setup.blade.Blade_Name);
                        if (bladeProduct) {
                          const variant = findVariant(bladeProduct, { handle: handleType }) || bladeProduct.node.variants.edges[0].node;
                          addItem({
                            product: bladeProduct,
                            variantId: variant.id,
                            variantTitle: variant.title,
                            price: variant.price,
                            quantity: 1,
                            selectedOptions: variant.selectedOptions
                          });
                          toast.success("Added to cart!", { description: setup.blade.Blade_Name });
                        } else {
                          toast.error("Product not available", { description: "This blade is not in our store yet." });
                        }
                      }}
                      className="w-full"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add Blade to Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Forehand Rubber */}
              <div className="border rounded-lg p-4 bg-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  🔴 Forehand Rubber: {setup.forehandRubber.Rubber_Name}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <StatBar label="Speed" value={setup.forehandRubber.Rubber_Speed} icon={Gauge} />
                    <StatBar label="Spin" value={setup.forehandRubber.Rubber_Spin} icon={Target} />
                    <StatBar label="Control" value={setup.forehandRubber.Rubber_Control} icon={Shield} />
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full justify-start">
                          <Info className="w-4 h-4" />
                          <span>Recommended Sponge:</span>
                          <span className="font-bold text-accent">{forehandThickness}</span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Forehand Sponge Thickness</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {forehandThicknessExplanation}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Level:</span> {setup.forehandRubber.Rubber_Level}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Price:</span> 
                      <span className="font-bold ml-1">{formatPrice(setup.forehandRubber.Rubber_Price)}*</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={async () => {
                        const fhProduct = findShopifyProduct(setup.forehandRubber.Rubber_Name);
                        if (fhProduct) {
                          const variant = findVariant(fhProduct, { thickness: forehandThickness, color: "Red" }) || fhProduct.node.variants.edges[0].node;
                          addItem({
                            product: fhProduct,
                            variantId: variant.id,
                            variantTitle: variant.title,
                            price: variant.price,
                            quantity: 1,
                            selectedOptions: variant.selectedOptions
                          });
                          toast.success("Added to cart!", { description: setup.forehandRubber.Rubber_Name });
                        } else {
                          toast.error("Product not available", { description: "This rubber is not in our store yet." });
                        }
                      }}
                      className="w-full"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add FH Rubber to Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Backhand Rubber */}
              <div className="border rounded-lg p-4 bg-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  🔵 Backhand Rubber: {setup.backhandRubber.Rubber_Name}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <StatBar label="Speed" value={setup.backhandRubber.Rubber_Speed} icon={Gauge} />
                    <StatBar label="Spin" value={setup.backhandRubber.Rubber_Spin} icon={Target} />
                    <StatBar label="Control" value={setup.backhandRubber.Rubber_Control} icon={Shield} />
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full justify-start">
                          <Info className="w-4 h-4" />
                          <span>Recommended Sponge:</span>
                          <span className="font-bold text-primary">{backhandThickness}</span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Backhand Sponge Thickness</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {backhandThicknessExplanation}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Level:</span> {setup.backhandRubber.Rubber_Level}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Price:</span> 
                      <span className="font-bold ml-1">{formatPrice(setup.backhandRubber.Rubber_Price)}*</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={async () => {
                        const bhProduct = findShopifyProduct(setup.backhandRubber.Rubber_Name);
                        if (bhProduct) {
                          const variant = findVariant(bhProduct, { thickness: backhandThickness, color: "Black" }) || bhProduct.node.variants.edges[0].node;
                          addItem({
                            product: bhProduct,
                            variantId: variant.id,
                            variantTitle: variant.title,
                            price: variant.price,
                            quantity: 1,
                            selectedOptions: variant.selectedOptions
                          });
                          toast.success("Added to cart!", { description: setup.backhandRubber.Rubber_Name });
                        } else {
                          toast.error("Product not available", { description: "This rubber is not in our store yet." });
                        }
                      }}
                      className="w-full"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add BH Rubber to Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Total Weight Info */}
              <div className="bg-secondary rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xl font-bold text-primary">
                  <Weight className="w-5 h-5" />
                  Total Weight: {totalWeight}g
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Blade ({bladeWeight}g) + FH Rubber ({fhWeight}g) + BH Rubber ({bhWeight}g)
                </p>
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">
          ✨ Your Perfect Racket Setup! ✨
        </h2>
        <p className="text-muted-foreground">
          Based on your preferences, here are our top recommendations
        </p>
        
        {budgetAmount && budgetAmount < 60 && (
          <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-sm text-foreground">
              💡 <strong>Note:</strong> Your budget is best suited for pre-assembled rackets. 
              Custom setups typically start at $90+ due to blade and rubber costs.
            </p>
          </div>
        )}

        {allRecommendations.length > 0 && allRecommendations[0].score < 60 && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-foreground">
                  <strong>Low Match Score:</strong> The best match found is below 60%. For better recommendations, try adjusting your budget or expanding your brand preferences.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Render recommendations sorted by score (best first) */}
      <div className="space-y-4">
        {/* Best recommendation always shown */}
        {allRecommendations.length > 0 && (() => {
          const bestItem = allRecommendations[0];
          if (bestItem.type === 'preAssembled' || bestItem.type === 'preAssembled2') {
            return <PreAssembledCard key={bestItem.type} racket={bestItem.data} rank={1} isBest={true} />;
          } else {
            return <CustomSetupCard key={bestItem.type} setup={bestItem.data} rank={1} isBest={true} />;
          }
        })()}
        
        {/* Other recommendations - collapsible */}
        {allRecommendations.length > 1 && (
          <Collapsible open={showAllRecommendations} onOpenChange={setShowAllRecommendations}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                {showAllRecommendations ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Hide Alternative Options
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show {allRecommendations.length - 1} More Option{allRecommendations.length > 2 ? 's' : ''}
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              {allRecommendations.slice(1).map((item, index) => {
                const rank = index + 2;
                if (item.type === 'preAssembled' || item.type === 'preAssembled2') {
                  return <PreAssembledCard key={item.type} racket={item.data} rank={rank} isBest={false} />;
                } else {
                  return <CustomSetupCard key={item.type} setup={item.data} rank={rank} isBest={false} />;
                }
              })}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Preference Adjustment Section */}
      <Card className="mt-6 border-2 border-accent/50">
        <Collapsible open={showPreferenceEditor} onOpenChange={setShowPreferenceEditor}>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-accent/10">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent" />
                  <span className="font-semibold">Adjust Budget & Brand Preferences</span>
                </div>
                {showPreferenceEditor ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent className="space-y-4 pb-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Budget Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent" />
                    Budget
                  </label>
                  <Select value={tempBudget} onValueChange={setTempBudget}>
                    <SelectTrigger className="w-full">
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
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4 text-accent" />
                    Brands
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
                className="w-full"
                size="lg"
              >
                Update Recommendations
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Price Disclaimer */}
      <div className="text-center text-xs text-muted-foreground italic">
        *Estimated price. Actual price may vary depending on the retailer and region.
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onRestart}
          variant="outline" 
          size="lg"
          className="w-full sm:w-auto"
        >
          Take Quiz Again
        </Button>
        
        {!preAssembled && !customSetup && (
          <div className="text-center p-6 text-muted-foreground">
            <p>No suitable options found within your budget. Try adjusting your preferences or budget range.</p>
          </div>
        )}
      </div>
    </div>
  );
}