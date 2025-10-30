import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { blades, rubbers, preAssembledRackets } from "@/data/products";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useComparisonStore, type ComparisonPaddle } from "@/stores/comparisonStore";
import tableTennisImage from "@/assets/table-tennis.png";
import { HelpCircle, ArrowRight, ShoppingCart, BarChart3 } from "lucide-react";
import { ComponentSelector } from "@/components/configurator/ComponentSelector";
import { SelectedPaddleView } from "@/components/configurator/SelectedPaddleView";
import { ProductFilter, type ProductFilters } from "@/components/configurator/ProductFilter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductCard } from "@/components/configurator/ProductCard";

const Configurator = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPreassembled, setIsPreassembled] = useState(false);
  
  // Shopify products state
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const addPaddle = useComparisonStore(state => state.addPaddle);
  
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
  
  // Filters - using values that match products.ts and Shopify
  const [selectedGrip, setSelectedGrip] = useState<string>("FL");
  const [selectedForehandThickness, setSelectedForehandThickness] = useState<string>("");
  const [selectedBackhandThickness, setSelectedBackhandThickness] = useState<string>("");
  const [selectedForehandColor, setSelectedForehandColor] = useState<string>("Red");
  const [selectedBackhandColor, setSelectedBackhandColor] = useState<string>("Black");
  
  // Filter dialog states
  const [showBladeFilters, setShowBladeFilters] = useState(false);
  const [showForehandFilters, setShowForehandFilters] = useState(false);
  const [showBackhandFilters, setShowBackhandFilters] = useState(false);
  
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

  // Filter products based on current filters
  const filteredBlades = blades.filter(blade => {
    if (blade.Blade_Price > bladeFilters.maxPrice) return false;
    if (!bladeFilters.level.includes("All") && !bladeFilters.level.includes(blade.Blade_Level)) return false;
    if (!bladeFilters.style.includes("All") && blade.Blade_Style && !bladeFilters.style.includes(blade.Blade_Style)) return false;
    if (bladeFilters.gripType && bladeFilters.gripType !== "All") {
      if (!blade.Blade_Grip || !blade.Blade_Grip.includes(bladeFilters.gripType)) return false;
    }
    if (bladeFilters.brand && !bladeFilters.brand.includes("All")) {
      if (!bladeFilters.brand.includes(extractBrand(blade.Blade_Name))) return false;
    }
    return true;
  });

  const filteredForehandRubbers = rubbers.filter(rubber => {
    if (rubber.Rubber_Price > forehandFilters.maxPrice) return false;
    if (!forehandFilters.level.includes("All") && !forehandFilters.level.includes(rubber.Rubber_Level)) return false;
    if (!forehandFilters.style.includes("All") && !forehandFilters.style.includes(rubber.Rubber_Style)) return false;
    if (forehandFilters.spongeSize && forehandFilters.spongeSize !== "All") {
      if (!rubber.Rubber_Sponge_Sizes || !rubber.Rubber_Sponge_Sizes.includes(forehandFilters.spongeSize)) return false;
    }
    if (forehandFilters.brand && !forehandFilters.brand.includes("All")) {
      if (!forehandFilters.brand.includes(extractBrand(rubber.Rubber_Name))) return false;
    }
    return true;
  });

  const filteredBackhandRubbers = rubbers.filter(rubber => {
    if (rubber.Rubber_Price > backhandFilters.maxPrice) return false;
    if (!backhandFilters.level.includes("All") && !backhandFilters.level.includes(rubber.Rubber_Level)) return false;
    if (!backhandFilters.style.includes("All") && !backhandFilters.style.includes(rubber.Rubber_Style)) return false;
    if (backhandFilters.spongeSize && backhandFilters.spongeSize !== "All") {
      if (!rubber.Rubber_Sponge_Sizes || !rubber.Rubber_Sponge_Sizes.includes(backhandFilters.spongeSize)) return false;
    }
    if (backhandFilters.brand && !backhandFilters.brand.includes("All")) {
      if (!backhandFilters.brand.includes(extractBrand(rubber.Rubber_Name))) return false;
    }
    return true;
  });

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

  const handleAddToCart = () => {
    toast.success("Added to cart");
  };

  const handleAddToCompare = () => {
    const comparisonPaddle: ComparisonPaddle = isPreassembled ? {
      id: `racket-${selectedRacket.Racket_Name}-${Date.now()}`,
      name: selectedRacket.Racket_Name,
      image: tableTennisImage,
      speed: selectedRacket.Racket_Speed,
      control: selectedRacket.Racket_Control,
      power: Math.round((selectedRacket.Racket_Speed + selectedRacket.Racket_Spin) / 2),
      spin: selectedRacket.Racket_Spin,
      price: selectedRacket.Racket_Price,
      weight: 175,
      level: selectedRacket.Racket_Level as "Beginner" | "Intermediate" | "Advanced",
    } : {
      id: `custom-${selectedBlade.Blade_Name}-${selectedForehand.Rubber_Name}-${selectedBackhand.Rubber_Name}-${Date.now()}`,
      name: `${selectedBlade.Blade_Name} (Custom)`,
      image: tableTennisImage,
      speed: Math.round((selectedBlade.Blade_Speed + selectedForehand.Rubber_Speed + selectedBackhand.Rubber_Speed) / 3),
      control: Math.round((selectedBlade.Blade_Control + selectedForehand.Rubber_Control + selectedBackhand.Rubber_Control) / 3),
      power: Math.round((selectedBlade.Blade_Power + selectedForehand.Rubber_Power + selectedBackhand.Rubber_Power) / 3),
      spin: Math.round((selectedBlade.Blade_Spin + selectedForehand.Rubber_Spin + selectedBackhand.Rubber_Spin) / 3),
      price: selectedBlade.Blade_Price + selectedForehand.Rubber_Price + selectedBackhand.Rubber_Price,
      weight: (selectedBlade.Blade_Weight || 88) + (selectedForehand.Rubber_Weight || 48) + (selectedBackhand.Rubber_Weight || 48),
      level: selectedBlade.Blade_Level as "Beginner" | "Intermediate" | "Advanced",
      blade: selectedBlade.Blade_Name,
      forehandRubber: selectedForehand.Rubber_Name,
      backhandRubber: selectedBackhand.Rubber_Name,
      forehandSponge: selectedForehandThickness,
      backhandSponge: selectedBackhandThickness,
      bladeStats: {
        speed: selectedBlade.Blade_Speed,
        control: selectedBlade.Blade_Control,
        power: selectedBlade.Blade_Power,
        spin: selectedBlade.Blade_Spin,
        price: selectedBlade.Blade_Price,
      },
      forehandStats: {
        speed: selectedForehand.Rubber_Speed,
        control: selectedForehand.Rubber_Control,
        power: selectedForehand.Rubber_Power,
        spin: selectedForehand.Rubber_Spin,
        price: selectedForehand.Rubber_Price,
      },
      backhandStats: {
        speed: selectedBackhand.Rubber_Speed,
        control: selectedBackhand.Rubber_Control,
        power: selectedBackhand.Rubber_Power,
        spin: selectedBackhand.Rubber_Spin,
        price: selectedBackhand.Rubber_Price,
      },
    };

    addPaddle(comparisonPaddle);
    
    toast.success("Added to comparison", {
      description: "View your comparison list",
      action: {
        label: "View",
        onClick: () => navigate("/compare")
      }
    });
  };

  return (
    <>
      <SEO 
        title="Table Tennis Paddle Configurator | Build Your Perfect Custom Racket"
        description="Create your ideal table tennis paddle with our interactive configurator. Choose from premium blades and rubbers from Butterfly, DHS, JOOLA, and ANDRO."
        canonical="https://yourdomain.com/configurator"
      />
      <StructuredData
        data={{
          type: 'BreadcrumbList',
          items: [
            { name: 'Home', url: 'https://yourdomain.com/' },
            { name: 'Configurator', url: 'https://yourdomain.com/configurator' }
          ]
        }}
      />
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 px-6 bg-gradient-to-br from-background via-muted/20 to-background border-b border-border overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--accent-rgb),0.05),transparent_50%)]" />
            <div className="container mx-auto max-w-6xl relative">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Build your perfect paddle
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Handpick every component or let us guide you to the ideal setup
                </p>
              </div>
              
              {/* CTA Cards */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <button
                  onClick={() => navigate("/quiz")}
                  className="group relative p-10 rounded-3xl bg-card/80 backdrop-blur-sm border-2 border-border hover:border-accent/50 transition-all duration-500 text-left overflow-hidden hover:shadow-elegant"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <HelpCircle className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-3">Help me choose</h3>
                    <p className="text-muted-foreground text-base mb-6">
                      Answer a few questions to find the perfect paddle
                    </p>
                    <div className="flex items-center text-accent font-medium text-base">
                      Start quiz
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </button>

                <div className="p-10 rounded-3xl bg-card/80 backdrop-blur-sm border-2 border-accent/30 shadow-elegant">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                    <img src={tableTennisImage} alt="" className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-3">Build your own</h3>
                  <p className="text-muted-foreground text-base">
                    Select components manually for complete control
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mode Toggle */}
          <section className="py-10 px-6 bg-muted/20 border-b border-border">
            <div className="container mx-auto max-w-7xl">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 p-2 rounded-3xl bg-background shadow-elegant border-2 border-border">
                  <Button
                    onClick={() => setIsPreassembled(false)}
                    variant={!isPreassembled ? "default" : "ghost"}
                    size="lg"
                    className="rounded-2xl px-12 py-7 text-base font-semibold transition-all duration-300"
                  >
                    Custom Build
                  </Button>
                  <Button
                    onClick={() => setIsPreassembled(true)}
                    variant={isPreassembled ? "default" : "ghost"}
                    size="lg"
                    className="rounded-2xl px-12 py-7 text-base font-semibold transition-all duration-300"
                  >
                    Pre-Assembled
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Main Configuration Area */}
          <section className="py-16 px-6">
            <div className="container mx-auto max-w-[1800px]">
              <div className="grid lg:grid-cols-[1fr,400px] gap-12 items-start">
                {/* Left: Product Selection */}
                <div className="space-y-16">
                  {!isPreassembled ? (
                    <>
                      {/* Blade Selection */}
                      <ComponentSelector
                        title="Choose your blade"
                        subtitle="The foundation of your paddle"
                        products={filteredBlades}
                        selectedProduct={selectedBlade}
                        onSelect={(product) => setSelectedBlade(product as Blade)}
                        onFilterClick={() => setShowBladeFilters(true)}
                      />

                      {/* Forehand Rubber Selection */}
                      <ComponentSelector
                        title="Choose forehand rubber"
                        subtitle="Optimize your attacking side"
                        products={filteredForehandRubbers}
                        selectedProduct={selectedForehand}
                        onSelect={(product) => setSelectedForehand(product as Rubber)}
                        onFilterClick={() => setShowForehandFilters(true)}
                      />

                      {/* Backhand Rubber Selection */}
                      <ComponentSelector
                        title="Choose backhand rubber"
                        subtitle="Perfect your defensive game"
                        products={filteredBackhandRubbers}
                        selectedProduct={selectedBackhand}
                        onSelect={(product) => setSelectedBackhand(product as Rubber)}
                        onFilterClick={() => setShowBackhandFilters(true)}
                      />
                    </>
                  ) : (
                    <>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-semibold mb-1">Choose pre-assembled racket</h2>
                          <p className="text-muted-foreground">Ready to play, professionally assembled</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {preAssembledRackets.map((racket) => (
                            <ProductCard
                              key={racket.Racket_Name}
                              name={racket.Racket_Name}
                              level={racket.Racket_Level}
                              price={racket.Racket_Price}
                              stats={{
                                speed: racket.Racket_Speed,
                                spin: racket.Racket_Spin,
                                control: racket.Racket_Control,
                                power: racket.Racket_Power,
                              }}
                              selected={selectedRacket.Racket_Name === racket.Racket_Name}
                              onClick={() => setSelectedRacket(racket)}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Right: Selected Configuration Summary */}
                <div>
                  <SelectedPaddleView
                    blade={!isPreassembled ? selectedBlade : undefined}
                    forehand={!isPreassembled ? selectedForehand : undefined}
                    backhand={!isPreassembled ? selectedBackhand : undefined}
                    racket={isPreassembled ? selectedRacket : undefined}
                    grip={selectedGrip}
                    forehandThickness={selectedForehandThickness}
                    backhandThickness={selectedBackhandThickness}
                    forehandColor={selectedForehandColor}
                    backhandColor={selectedBackhandColor}
                  />

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-4">
                    <Button
                      size="lg"
                      className="w-full rounded-2xl py-7 text-base font-semibold gap-3"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full rounded-2xl py-7 text-base font-semibold gap-3"
                      onClick={handleAddToCompare}
                    >
                      <BarChart3 className="w-5 h-5" />
                      Add to Compare
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Filter Dialogs */}
        <ProductFilter
          filters={bladeFilters}
          onFiltersChange={setBladeFilters}
          type="blade"
          title="Blade Filters"
          open={showBladeFilters}
          onOpenChange={setShowBladeFilters}
        />

        <ProductFilter
          filters={forehandFilters}
          onFiltersChange={setForehandFilters}
          type="rubber"
          title="Forehand Rubber Filters"
          open={showForehandFilters}
          onOpenChange={setShowForehandFilters}
        />

        <ProductFilter
          filters={backhandFilters}
          onFiltersChange={setBackhandFilters}
          type="rubber"
          title="Backhand Rubber Filters"
          open={showBackhandFilters}
          onOpenChange={setShowBackhandFilters}
        />
      </div>
    </>
  );
};

export default Configurator;
