import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WheelCard from "@/components/configurator/WheelCard";
import ReviewStrip from "@/components/configurator/ReviewStrip";
import UtilityDrawer from "@/components/configurator/UtilityDrawer";
import StickyDecisionBar from "@/components/configurator/StickyDecisionBar";
import RacketRadar from "@/components/configurator/RacketRadar";
import { Button } from "@/components/ui/button";
import { blades, rubbers, preAssembledRackets, estimateBladeWeight, estimateRubberWeight } from "@/data/products";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useComparisonStore, type ComparisonPaddle } from "@/stores/comparisonStore";
import tableTennisImage from "@/assets/table-tennis.png";
import { HelpCircle, ArrowRight } from "lucide-react";

const ConfiguratorNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPreassembled, setIsPreassembled] = useState(false);
  
  // Shopify products state
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const addPaddle = useComparisonStore(state => state.addPaddle);
  const comparisonPaddles = useComparisonStore(state => state.paddles);
  
  // State for custom mode
  const [selectedBlade, setSelectedBlade] = useState<Blade>(blades[0]);
  const [selectedForehand, setSelectedForehand] = useState<Rubber>(rubbers[0]);
  const [selectedBackhand, setSelectedBackhand] = useState<Rubber>(rubbers[1]);
  
  // State for preassembled mode
  const [selectedRacket, setSelectedRacket] = useState<PreAssembledRacket>(preAssembledRackets[0]);
  
  // Assembly option state
  const [assembleForMe, setAssembleForMe] = useState(false);
  
  // Seals service state (for custom blades)
  const [sealsService, setSealsService] = useState(false);
  
  // Filters
  const [selectedGrip, setSelectedGrip] = useState<string>("FL");
  const [selectedForehandThickness, setSelectedForehandThickness] = useState<string>("");
  const [selectedBackhandThickness, setSelectedBackhandThickness] = useState<string>("");
  const [selectedForehandColor, setSelectedForehandColor] = useState<string>("Red");
  const [selectedBackhandColor, setSelectedBackhandColor] = useState<string>("Black");

  // Refs for scrolling to cards
  const forehandRef = useRef<HTMLDivElement | null>(null);
  const bladeRef = useRef<HTMLDivElement | null>(null);
  const backhandRef = useRef<HTMLDivElement | null>(null);
  const racketRef = useRef<HTMLDivElement | null>(null);

  // Undo state for random reroll
  const [undoState, setUndoState] = useState<any>(null);

  // Initialize default thicknesses based on selected rubbers
  useEffect(() => {
    if (selectedForehand.Rubber_Sponge_Sizes && selectedForehand.Rubber_Sponge_Sizes.length > 0) {
      setSelectedForehandThickness(selectedForehand.Rubber_Sponge_Sizes[0]);
    }
  }, [selectedForehand]);
  
  useEffect(() => {
    if (selectedBackhand.Rubber_Sponge_Sizes && selectedBackhand.Rubber_Sponge_Sizes.length > 0) {
      setSelectedBackhandThickness(selectedBackhand.Rubber_Sponge_Sizes[0]);
    }
  }, [selectedBackhand]);

  // Load preselected items from quiz results
  useEffect(() => {
    const bladeParam = searchParams.get("blade");
    const fhParam = searchParams.get("fh");
    const bhParam = searchParams.get("bh");
    const racketParam = searchParams.get("racket");
    const handleParam = searchParams.get("handle");
    const preassembledParam = searchParams.get("preassembled");
    
    if (handleParam) {
      setSelectedGrip(handleParam);
    }
    
    if (preassembledParam === "true" && racketParam) {
      const racket = preAssembledRackets.find(r => r.Racket_Name === racketParam);
      if (racket) {
        setIsPreassembled(true);
        setSelectedRacket(racket);
      }
    } else if (bladeParam || fhParam || bhParam) {
      const blade = blades.find(b => b.Blade_Name === bladeParam);
      const fh = rubbers.find(r => r.Rubber_Name === fhParam);
      const bh = rubbers.find(r => r.Rubber_Name === bhParam);
      
      if (blade) setSelectedBlade(blade);
      if (fh) setSelectedForehand(fh);
      if (bh) setSelectedBackhand(bh);
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
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleRandomReroll = () => {
    // Store current state for undo
    setUndoState({
      blade: selectedBlade,
      forehand: selectedForehand,
      backhand: selectedBackhand,
      racket: selectedRacket,
      isPreassembled
    });

    if (isPreassembled) {
      const random = preAssembledRackets[Math.floor(Math.random() * preAssembledRackets.length)];
      setSelectedRacket(random);
      toast.success("Randomized!", { description: `Now showing ${random.Racket_Name}` });
    } else {
      const randomBlade = blades[Math.floor(Math.random() * blades.length)];
      const randomForehand = rubbers[Math.floor(Math.random() * rubbers.length)];
      const randomBackhand = rubbers[Math.floor(Math.random() * rubbers.length)];
      
      setSelectedBlade(randomBlade);
      setSelectedForehand(randomForehand);
      setSelectedBackhand(randomBackhand);
      
      toast.success("Randomized!", { 
        description: `${randomBlade.Blade_Name} + ${randomForehand.Rubber_Name} + ${randomBackhand.Rubber_Name}` 
      });
    }
  };

  const handleUndo = () => {
    if (!undoState) return;
    
    setSelectedBlade(undoState.blade);
    setSelectedForehand(undoState.forehand);
    setSelectedBackhand(undoState.backhand);
    setSelectedRacket(undoState.racket);
    setIsPreassembled(undoState.isPreassembled);
    
    toast.success("Undone!", { description: "Previous configuration restored" });
    setUndoState(null);
  };

  const calculateStats = () => {
    if (isPreassembled) {
      return {
        speed: selectedRacket.Racket_Speed,
        spin: selectedRacket.Racket_Spin,
        control: selectedRacket.Racket_Control,
        power: Math.round((selectedRacket.Racket_Speed + selectedRacket.Racket_Spin) / 2),
        price: selectedRacket.Racket_Price,
        weight: 175,
        level: selectedRacket.Racket_Level
      };
    } else {
      const speed = Math.round((selectedBlade.Blade_Speed + selectedForehand.Rubber_Speed + selectedBackhand.Rubber_Speed) / 3);
      const spin = Math.round((selectedBlade.Blade_Spin + selectedForehand.Rubber_Spin + selectedBackhand.Rubber_Spin) / 3);
      const control = Math.round((selectedBlade.Blade_Control + selectedForehand.Rubber_Control + selectedBackhand.Rubber_Control) / 3);
      const power = Math.round((speed + spin) / 2);
      const totalPrice = selectedBlade.Blade_Price + selectedForehand.Rubber_Price + selectedBackhand.Rubber_Price + (sealsService ? 5.49 : 0);
      const weight = estimateBladeWeight(selectedBlade) + estimateRubberWeight(selectedForehand) + estimateRubberWeight(selectedBackhand);
      
      return { speed, spin, control, power, price: totalPrice, weight, level: selectedBlade.Blade_Level };
    }
  };

  // Helper function to find matching Shopify variant
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

  const handleAddToCart = () => {
    if (isLoadingProducts) {
      toast.error("Products are still loading");
      return;
    }

    if (shopifyProducts.length === 0) {
      toast.error("No products available");
      return;
    }

    try {
      if (isPreassembled) {
        const racketProduct = shopifyProducts.find(p => 
          p.node.title.toLowerCase().includes(selectedRacket.Racket_Name.toLowerCase())
        );

        if (!racketProduct) {
          toast.error("Product not found in store");
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

        toast.success("Added to cart", { description: selectedRacket.Racket_Name });
      } else {
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
          toast.error("Products not found in store");
          return;
        }

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
          toast.error("Variant not available");
          return;
        }

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
          description: "3 items added: blade and 2 rubbers"
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToCompare = () => {
    if (comparisonPaddles.length >= 3) {
      toast.error("Comparison is full", { 
        description: "Please clear the comparison section to add more paddles" 
      });
      return;
    }

    try {
      const stats = calculateStats();
      const comparisonPaddle: ComparisonPaddle = isPreassembled ? {
        id: `racket-${selectedRacket.Racket_Name}-${Date.now()}`,
        name: selectedRacket.Racket_Name,
        image: tableTennisImage,
        speed: selectedRacket.Racket_Speed,
        control: selectedRacket.Racket_Control,
        power: stats.power,
        spin: selectedRacket.Racket_Spin,
        price: selectedRacket.Racket_Price,
        weight: stats.weight,
        level: selectedRacket.Racket_Level as "Beginner" | "Intermediate" | "Advanced",
      } : {
        id: `custom-${selectedBlade.Blade_Name}-${Date.now()}`,
        name: `${selectedBlade.Blade_Name} (Custom)`,
        image: tableTennisImage,
        speed: stats.speed,
        control: stats.control,
        power: stats.power,
        spin: stats.spin,
        price: stats.price,
        weight: stats.weight,
        level: selectedBlade.Blade_Level as "Beginner" | "Intermediate" | "Advanced",
        blade: selectedBlade.Blade_Name,
        forehandRubber: selectedForehand.Rubber_Name,
        backhandRubber: selectedBackhand.Rubber_Name,
      };

      addPaddle(comparisonPaddle);
      
      toast.success("Added to comparison", {
        description: "View your comparison list",
        action: {
          label: "View",
          onClick: () => navigate("/compare")
        }
      });
    } catch (error) {
      console.error("Error adding to comparison:", error);
      toast.error("Failed to add to comparison");
    }
  };

  const handleChipClick = (id: string) => {
    const ref = id === "forehand" ? forehandRef.current :
                id === "blade" ? bladeRef.current :
                id === "backhand" ? backhandRef.current :
                racketRef.current;
    
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Table Tennis Racket Configurator - Build Your Custom Setup"
        description="Configure your perfect table tennis racket with our professional configurator."
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
      
      <main className="flex-1 pb-24">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          {/* Help Banner */}
          <div className="mb-8 max-w-3xl mx-auto">
            <a
              href="/"
              className="block group bg-card hover:bg-muted/30 border border-border rounded-2xl p-4 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-3">
                <HelpCircle className="w-4 h-4 text-accent flex-shrink-0" />
                <div className="flex-1 text-center">
                  <p className="text-sm font-medium text-foreground">
                    Help me choose — Answer a few questions to find the best paddle.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
          
          {/* Header */}
          <div className="mb-8 space-y-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Build Your Perfect Paddle
            </h1>
            <div className="inline-flex items-center gap-1 bg-muted rounded-full p-1">
              <Button
                onClick={() => setIsPreassembled(false)}
                variant={!isPreassembled ? "default" : "ghost"}
                className="rounded-full px-5 py-1.5 text-sm font-medium transition-all"
              >
                Custom
              </Button>
              <Button
                onClick={() => setIsPreassembled(true)}
                variant={isPreassembled ? "default" : "ghost"}
                className="rounded-full px-5 py-1.5 text-sm font-medium transition-all"
              >
                Pre-Assembled
              </Button>
            </div>
          </div>

          {/* Configure Section - Three Wheel Cards */}
          <div className="mb-8">
            {isPreassembled ? (
              <div className="max-w-md mx-auto">
                <WheelCard
                  type="racket"
                  item={selectedRacket}
                  options={[
                    { label: "Price", value: `$${selectedRacket.Racket_Price}` },
                    { label: "Level", value: selectedRacket.Racket_Level }
                  ]}
                  onScroll={(ref) => racketRef.current = ref}
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                <WheelCard
                  type="forehand"
                  item={selectedForehand}
                  options={[
                    { label: "Sponge", value: selectedForehandThickness },
                    { label: "Color", value: selectedForehandColor }
                  ]}
                  onScroll={(ref) => forehandRef.current = ref}
                />
                <WheelCard
                  type="blade"
                  item={selectedBlade}
                  options={[
                    { label: "Grip", value: selectedGrip }
                  ]}
                  onScroll={(ref) => bladeRef.current = ref}
                />
                <WheelCard
                  type="backhand"
                  item={selectedBackhand}
                  options={[
                    { label: "Sponge", value: selectedBackhandThickness },
                    { label: "Color", value: selectedBackhandColor }
                  ]}
                  onScroll={(ref) => backhandRef.current = ref}
                />
              </div>
            )}
          </div>

          {/* Tune Section - Racket Radar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <RacketRadar
              speed={stats.speed}
              spin={stats.spin}
              control={stats.control}
              power={stats.power}
              weight={stats.weight}
              value={stats.price}
            />
          </div>
        </div>

        {/* Review Strip */}
        <ReviewStrip
          totalPrice={stats.price}
          level={stats.level}
          totalWeight={stats.weight}
          selections={
            isPreassembled
              ? [{ id: "racket", name: selectedRacket.Racket_Name, label: "Racket" }]
              : [
                  { id: "forehand", name: selectedForehand.Rubber_Name, label: "Forehand" },
                  { id: "blade", name: selectedBlade.Blade_Name, label: "Blade" },
                  { id: "backhand", name: selectedBackhand.Rubber_Name, label: "Backhand" },
                ]
          }
          onChipClick={handleChipClick}
        />
      </main>

      {/* Sticky Decision Bar */}
      <StickyDecisionBar
        totalPrice={stats.price}
        onAddToCart={handleAddToCart}
        onCompare={handleAddToCompare}
        isLoading={isLoadingProducts}
        utilityButton={
          <UtilityDrawer
            assembleForMe={assembleForMe}
            onAssembleChange={setAssembleForMe}
            sealsService={sealsService}
            onSealsChange={setSealsService}
            onRandomReroll={handleRandomReroll}
            onUndo={undoState ? handleUndo : undefined}
            isCustomMode={!isPreassembled}
          />
        }
      />
      
      <Footer />
    </div>
  );
};

export default ConfiguratorNew;
