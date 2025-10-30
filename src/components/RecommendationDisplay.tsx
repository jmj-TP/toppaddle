import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Target, Gauge, Shield, ShoppingCart, BarChart3, ChevronRight } from "lucide-react";
import type { Recommendation, CustomSetup, QuizAnswers } from "@/utils/ratingSystem";
import { estimateBladeWeight, estimateRubberWeight } from "@/data/products";
import { useCartStore } from "@/stores/cartStore";
import { useComparisonStore, type ComparisonPaddle } from "@/stores/comparisonStore";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import tableTennisImage from "@/assets/table-tennis.png";

interface RecommendationDisplayProps {
  recommendation: Recommendation;
  onRestart: () => void;
  assemblyPreference?: string;
  budgetAmount?: number;
  playerLevel?: string;
  currentAnswers?: Partial<QuizAnswers>;
  onUpdatePreferences?: (budget: string, brands: string[]) => void;
}

export default function RecommendationDisplay({ 
  recommendation, 
  onRestart, 
  assemblyPreference,
  playerLevel 
}: RecommendationDisplayProps) {
  const { 
    preAssembled, 
    preAssembled2, 
    customSetup, 
    customSetup2,
    forehandThickness,
    backhandThickness,
    handleType 
  } = recommendation;
  
  const navigate = useNavigate();
  const addPaddle = useComparisonStore(state => state.addPaddle);
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [viewMode, setViewMode] = useState<"2" | "all">("2");

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

  // Create array of all recommendations
  const allOptions = [
    preAssembled ? { type: 'preAssembled' as const, data: preAssembled } : null,
    preAssembled2 ? { type: 'preAssembled2' as const, data: preAssembled2 } : null,
    customSetup ? { type: 'custom1' as const, data: customSetup } : null,
    customSetup2 ? { type: 'custom2' as const, data: customSetup2 } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null)
   .sort((a, b) => {
     // Prioritize custom setups for intermediate/advanced players
     if (playerLevel === 'Intermediate' || playerLevel === 'Advanced') {
       if ((a.type === 'preAssembled' || a.type === 'preAssembled2') && 
           (b.type !== 'preAssembled' && b.type !== 'preAssembled2')) return 1;
       if ((a.type !== 'preAssembled' && a.type !== 'preAssembled2') && 
           (b.type === 'preAssembled' || b.type === 'preAssembled2')) return -1;
     }
     return b.data.score - a.data.score;
   });

  // Filter based on view mode and assembly preference
  let displayedOptions = allOptions;
  
  if (viewMode === "2") {
    if (assemblyPreference === "Ready-to-play racket") {
      displayedOptions = allOptions.filter(item => 
        item.type === 'preAssembled' || item.type === 'preAssembled2'
      ).slice(0, 2);
    } else if (assemblyPreference === "Custom setup") {
      displayedOptions = allOptions.filter(item => 
        item.type !== 'preAssembled' && item.type !== 'preAssembled2'
      ).slice(0, 2);
    } else {
      displayedOptions = allOptions.slice(0, 2);
    }
  }

  const handleAddToCompare = (item: typeof allOptions[0]) => {
    if (!item) return;

    const isPreAssembled = item.type === 'preAssembled' || item.type === 'preAssembled2';

    const comparisonPaddle: ComparisonPaddle = isPreAssembled ? {
      id: `racket-${(item.data as any).Racket_Name}-${Date.now()}`,
      name: (item.data as any).Racket_Name,
      image: tableTennisImage,
      speed: (item.data as any).Racket_Speed,
      control: (item.data as any).Racket_Control,
      power: Math.round(((item.data as any).Racket_Speed + (item.data as any).Racket_Spin) / 2),
      spin: (item.data as any).Racket_Spin,
      price: (item.data as any).Racket_Price,
      weight: 175,
      level: (item.data as any).Racket_Level as "Beginner" | "Intermediate" | "Advanced",
    } : {
      id: `custom-${(item.data as CustomSetup).blade.Blade_Name}-${Date.now()}`,
      name: `${(item.data as CustomSetup).blade.Blade_Name} (Custom)`,
      image: tableTennisImage,
      speed: Math.round(((item.data as CustomSetup).blade.Blade_Speed + (item.data as CustomSetup).forehandRubber.Rubber_Speed + (item.data as CustomSetup).backhandRubber.Rubber_Speed) / 3),
      control: Math.round(((item.data as CustomSetup).blade.Blade_Control + (item.data as CustomSetup).forehandRubber.Rubber_Control + (item.data as CustomSetup).backhandRubber.Rubber_Control) / 3),
      power: Math.round(((item.data as CustomSetup).blade.Blade_Power + (item.data as CustomSetup).forehandRubber.Rubber_Power + (item.data as CustomSetup).backhandRubber.Rubber_Power) / 3),
      spin: Math.round(((item.data as CustomSetup).forehandRubber.Rubber_Spin + (item.data as CustomSetup).backhandRubber.Rubber_Spin) / 2),
      price: (item.data as CustomSetup).blade.Blade_Price + (item.data as CustomSetup).forehandRubber.Rubber_Price + (item.data as CustomSetup).backhandRubber.Rubber_Price,
      weight: ((item.data as CustomSetup).blade.Blade_Weight || 88) + ((item.data as CustomSetup).forehandRubber.Rubber_Weight || 48) + ((item.data as CustomSetup).backhandRubber.Rubber_Weight || 48),
      level: (item.data as CustomSetup).blade.Blade_Level as "Beginner" | "Intermediate" | "Advanced",
      blade: (item.data as CustomSetup).blade.Blade_Name,
      forehandRubber: (item.data as CustomSetup).forehandRubber.Rubber_Name,
      backhandRubber: (item.data as CustomSetup).backhandRubber.Rubber_Name,
      forehandSponge: forehandThickness,
      backhandSponge: backhandThickness,
    };

    addPaddle(comparisonPaddle);
    toast.success("Added to comparison! 📊", {
      action: {
        label: "View",
        onClick: () => navigate("/compare")
      }
    });
  };

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  const RacketCard = ({ item, rank }: { item: typeof allOptions[0]; rank: number }) => {
    const isPreAssembled = item.type === 'preAssembled' || item.type === 'preAssembled2';

    return (
      <Card className="border-2 border-border hover:border-primary/50 transition-all shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className="mb-2">
                {isPreAssembled ? "Pre-Assembled" : "Custom Setup"}
              </Badge>
              <h3 className="text-2xl font-bold">
                {isPreAssembled ? (item.data as any).Racket_Name : `${(item.data as CustomSetup).blade.Blade_Name} Custom`}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold">{item.data.score}%</span>
            </div>
          </div>

          <div className="w-full aspect-square bg-card rounded-2xl border-2 border-border flex items-center justify-center mb-4">
            <img src={tableTennisImage} alt="" className="w-1/2 h-1/2 opacity-60" />
          </div>

          <div className="space-y-3 mb-6">
            <StatBar label="Speed" value={isPreAssembled ? (item.data as any).Racket_Speed : Math.round(((item.data as CustomSetup).blade.Blade_Speed + (item.data as CustomSetup).forehandRubber.Rubber_Speed + (item.data as CustomSetup).backhandRubber.Rubber_Speed) / 3)} color="bg-gradient-to-r from-primary to-primary/70" />
            <StatBar label="Spin" value={isPreAssembled ? (item.data as any).Racket_Spin : Math.round(((item.data as CustomSetup).forehandRubber.Rubber_Spin + (item.data as CustomSetup).backhandRubber.Rubber_Spin) / 2)} color="bg-gradient-to-r from-secondary to-secondary/70" />
            <StatBar label="Control" value={isPreAssembled ? (item.data as any).Racket_Control : Math.round(((item.data as CustomSetup).blade.Blade_Control + (item.data as CustomSetup).forehandRubber.Rubber_Control + (item.data as CustomSetup).backhandRubber.Rubber_Control) / 3)} color="bg-gradient-to-r from-accent to-accent/70" />
          </div>

          {!isPreAssembled && (
            <div className="space-y-2 mb-6 p-4 bg-card rounded-xl border border-border">
              <div className="text-sm">
                <span className="text-muted-foreground">Blade:</span>
                <span className="font-semibold ml-2">{(item.data as CustomSetup).blade.Blade_Name}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">FH Rubber:</span>
                <span className="font-semibold ml-2">{(item.data as CustomSetup).forehandRubber.Rubber_Name} ({forehandThickness})</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">BH Rubber:</span>
                <span className="font-semibold ml-2">{(item.data as CustomSetup).backhandRubber.Rubber_Name} ({backhandThickness})</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border mb-4">
            <span className="text-lg font-medium">Price</span>
            <span className="text-3xl font-bold text-primary">
              ${isPreAssembled ? (item.data as any).Racket_Price : ((item.data as CustomSetup).blade.Blade_Price + (item.data as CustomSetup).forehandRubber.Rubber_Price + (item.data as CustomSetup).backhandRubber.Rubber_Price).toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleAddToCompare(item)}
              className="w-full rounded-xl font-semibold"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Compare
            </Button>
            <Button
              size="lg"
              onClick={() => toast.success("Added to cart! 🏓")}
              className="w-full rounded-xl font-semibold"
              disabled={isLoadingProducts}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Your Perfect Paddles 🎯
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Based on your playing style and preferences
        </p>

        {allOptions.length > 2 && (
          <div className="flex justify-center gap-3">
            <Button
              variant={viewMode === "2" ? "default" : "outline"}
              onClick={() => setViewMode("2")}
              className="rounded-full"
            >
              Top 2 Matches
            </Button>
            <Button
              variant={viewMode === "all" ? "default" : "outline"}
              onClick={() => setViewMode("all")}
              className="rounded-full"
            >
              View All Options
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {displayedOptions.map((item, index) => (
          <RacketCard key={`${item.type}-${index}`} item={item} rank={index + 1} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Button
          size="lg"
          onClick={onRestart}
          variant="outline"
          className="rounded-full px-8 font-semibold"
        >
          Take Quiz Again
        </Button>
        <Button
          size="lg"
          onClick={() => navigate("/compare")}
          className="rounded-full px-8 font-semibold"
        >
          Compare All
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
