import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/googleSheets";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { useReviews } from "@/hooks/useReviews";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Target, Gauge, Shield, Info, ChevronDown, ChevronUp, ShoppingCart, Wrench, Sparkles } from "lucide-react";
import { isFastStyle, isSpinStyle, isControlStyle, type Recommendation, type CustomSetup, type QuizAnswers, type Inventory } from "@/utils/ratingSystem";
import { estimateBladeWeight, estimateRubberWeight } from "@/data/products";
import { getProductImage } from "@/utils/addProductImages";

import BrandSelector from "./BrandSelector";
import { StatBar } from "./ui/StatBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShareButton from "./ShareButton";
import { useCartStore } from "@/stores/cartStore";
import { useComparisonStore, type ComparisonPaddle } from "@/stores/comparisonStore";
import { toast } from "sonner";
import { selectSmartSpongeSize } from "@/utils/smartSpongeSelection";
import AssemblyComparisonView from "./AssemblyComparisonView";
import LeadCaptureModal from "./LeadCaptureModal";

interface RecommendationDisplayProps {
  recommendation: Recommendation;
  onRestart: () => void;
  assemblyPreference?: string;
  budgetAmount?: number;
  playerLevel?: string;
  currentAnswers?: Partial<QuizAnswers>;
  onUpdatePreferences?: (budget: string, brands: string[]) => void;
  inventory: Inventory;
}

/** Small wrapper that hooks into reviews for a specific combo */
function RecommendationReviews({ blade, fhRubber, bhRubber }: { blade?: string; fhRubber?: string; bhRubber?: string }) {
  const { matchingReviews, isLoading } = useReviews(blade, fhRubber, bhRubber);
  return (
    <ReviewsCarousel
      reviews={matchingReviews}
      isLoading={isLoading}
      currentBlade={blade}
      currentFhRubber={fhRubber}
      currentBhRubber={bhRubber}
    />
  );
}

export default function RecommendationDisplay({ recommendation, onRestart, assemblyPreference, budgetAmount, playerLevel, currentAnswers, onUpdatePreferences, inventory }: RecommendationDisplayProps) {
  const { preAssembled, customSetup, totalScore, forehandThickness, forehandThicknessExplanation, backhandThickness, backhandThicknessExplanation, handleType, handleTypeExplanation } = recommendation;

  // Track which option user wants to see when they selected "Not sure"
  const [selectedOption, setSelectedOption] = useState<'preassembled' | 'custom' | null>(
    assemblyPreference === 'Not sure' ? null :
      assemblyPreference?.includes('Ready-to-play') ? 'preassembled' : 'custom'
  );

  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);
  const addPaddle = useComparisonStore(state => state.addPaddle);
  const comparisonPaddles = useComparisonStore(state => state.paddles);
  const [flexibleBudgetUpsell, setFlexibleBudgetUpsell] = useState<any>(null);

  // Generate dynamic explanations based on stats and answers
  const generateDynamicExplanation = (itemData: any, isPre: boolean, answers?: Partial<QuizAnswers>) => {
    if (!answers || Object.keys(answers).length === 0) {
      return isPre
        ? "This ready-to-play racket matches your skill level and playing style perfectly. No assembly required — just unbox and start playing immediately."
        : `This custom setup combines ${itemData?.blade?.Blade_Name} with premium rubbers tailored to your preferences. It offers the perfect balance of performance characteristics you're looking for.`;
    }

    const { Level, Playstyle, Forehand, Backhand, Power } = answers;

    if (isPre) {
      const racket = itemData;
      return `As a ${Level} player looking for an ${Playstyle?.toLowerCase()} game, the ${racket.Racket_Name} is exactly what you need. It provides ${racket.Racket_Speed > 80 ? 'high speed' : 'excellent control'} (rated ${racket.Racket_Control}/100) right out of the box, allowing you to ${isSpinStyle(Forehand) ? 'generate massive spin' : 'execute your gameplan'} without worrying about custom assembly.`;
    }

    const setup = itemData as CustomSetup;
    const bStiff = setup.blade.Blade_Stiffness || 50;
    const bMat = setup.blade.Blade_Material || 'All-Wood';
    const fhHard = setup.forehandRubber.Rubber_Hardness || 'Medium';
    const fhThrow = setup.forehandRubber.Rubber_ThrowAngle || 'Medium';

    let parts = [];

    // Blade logic
    if (Level === 'Beginner') {
      parts.push(`For your development, the ${setup.blade.Blade_Name} blade provides the essential vibration feedback of an ${bMat} build.`);
    } else {
      if (bStiff > 70) parts.push(`The ${setup.blade.Blade_Name} blade provides the high stiffness and ${bMat} power needed for your aggressive game.`);
      else if (bStiff < 60) parts.push(`The ${setup.blade.Blade_Name} blade offers the flexibility and dwell time critical for your control-oriented style.`);
      else parts.push(`The ${setup.blade.Blade_Name} blade perfectly balances speed and control with its ${bMat} composition.`);
    }

    // Forehand logic
    if (isFastStyle(Forehand)) {
      parts.push(`Your fast forehand is supported by the ${fhHard} sponge on the ${setup.forehandRubber.Rubber_Name}, preventing the rubber from bottoming out during flat hits.`);
    } else if (isSpinStyle(Forehand)) {
      parts.push(`To maximize your topspin, the ${setup.forehandRubber.Rubber_Name} offers a ${fhThrow?.toLowerCase()} throw angle to lift the ball effortlessly.`);
    } else {
      parts.push(`The ${setup.forehandRubber.Rubber_Name} on your forehand gives you wide margins for error with its ${fhHard?.toLowerCase()} sponge.`);
    }

    // Power logic
    if (Power?.includes('A lot of power')) {
      parts.push(`Together, this combination maximizes your offensive output without sacrificing all your precision.`);
    }

    return parts.join(' ');
  };

  // Assembly / seal options for custom setup CTAs
  const [assembleCustom1, setAssembleCustom1] = useState(true);
  const [sealCustom1, setSealCustom1] = useState(false);
  const [assembleUpsell, setAssembleUpsell] = useState(true);
  const [sealUpsell, setSealUpsell] = useState(false);

  // Lead modal state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadEquipmentDetail, setLeadEquipmentDetail] = useState<any>(null);

  // Preference editor state
  const [showPreferenceEditor, setShowPreferenceEditor] = useState(false);
  const [tempBudget, setTempBudget] = useState('');
  const [tempBrands, setTempBrands] = useState<string[]>([]);

  // No-op Shopify product lookup (Shopify removed; images come from Google Sheet)
  const findShopifyProduct = (_name: string) => null;

  // Calculate flexible budget upsell if we have complete answers
  useEffect(() => {
    const calculateUpsell = async () => {
      if (currentAnswers && Object.keys(currentAnswers).length > 10 && inventory) {
        const { calculateFlexibleBudgetUpsell } = await import('@/utils/upsellCalculation');
        const upsell = calculateFlexibleBudgetUpsell(
          currentAnswers as QuizAnswers,
          recommendation,
          inventory
        );
        setFlexibleBudgetUpsell(upsell);
      }
    };
    calculateUpsell();
  }, [currentAnswers, recommendation]);

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

  // Handle lead capture instead of add to cart
  const handleRequestQuotes = (item: { type: "main" | "pre" | "custom", data: any, score: number, rank: number }) => {
    setLeadEquipmentDetail({
      ...item,
      options: {
        assemble: item.rank === 1 ? assembleCustom1 : assembleUpsell,
        seal: item.rank === 1 ? sealCustom1 : sealUpsell,
        forehandThickness,
        backhandThickness,
        handleType
      }
    });
    setIsLeadModalOpen(true);
  };

  const handleAddToCart = async (item: { type: "main" | "pre" | "custom", data: any, score: number, rank: number }) => {
    // Kept for backward compatibility but bypassed in UI
    console.log("Add to cart called for:", item);
  };

  // Navigate to configurator with pre-selected items
  const handleViewInConfigurator = (item: typeof allRecommendations[0]) => {
    const isPreAssembled = 'Racket_Name' in item.data;

    if (isPreAssembled) {
      const racket = item.data as any;
      router.push(`/configurator?preassembled=true&racket=${encodeURIComponent(racket.Racket_Name)}&handle=${encodeURIComponent(handleType)}`);
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

      router.push(`/configurator?blade=${encodeURIComponent(setup.blade.Blade_Name)}&fh=${encodeURIComponent(setup.forehandRubber.Rubber_Name)}&bh=${encodeURIComponent(setup.backhandRubber.Rubber_Name)}&handle=${encodeURIComponent(handleType)}&fhThickness=${encodeURIComponent(fhThickness)}&bhThickness=${encodeURIComponent(bhThickness)}`);
    }
  };

  // Add to comparison
  const handleAddToCompare = (item: typeof allRecommendations[0]) => {
    const isPreAssembled = 'Racket_Name' in item.data;
    let paddle: ComparisonPaddle;

    if (isPreAssembled) {
      const racket = item.data as any;
      paddle = {
        id: `pre-${racket.Racket_Name}-${Date.now()}`,
        name: racket.Racket_Name,
        image: getProductImage(racket, 'racket'),
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
        id: `custom-${setup.blade.Blade_Name}-${Date.now()}`,
        name: `Custom Setup: ${setup.blade.Blade_Name}`,
        image: getProductImage(setup.blade, 'blade'),
        speed: combinedSpeed,
        control: combinedControl,
        power: combinedPower,
        spin: combinedSpin,
        price: setup.totalPrice,
        weight: totalWeight,
        level: setup.blade.Blade_Level as "Beginner" | "Intermediate" | "Advanced",
        blade: setup.blade.Blade_Name,
        bladeImage: getProductImage(setup.blade, 'blade'),
        forehandRubber: setup.forehandRubber.Rubber_Name,
        forehandImage: getProductImage(setup.forehandRubber, 'rubber'),
        backhandRubber: setup.backhandRubber.Rubber_Name,
        backhandImage: getProductImage(setup.backhandRubber, 'rubber'),
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
    router.push('/compare');
  };


  // Create array with just the main recommendation based on selectedOption
  const mainRecommendation = selectedOption === 'preassembled' ? preAssembled :
    selectedOption === 'custom' ? customSetup :
      preAssembled || customSetup;
  const allRecommendations = mainRecommendation
    ? [{ type: 'main' as const, score: mainRecommendation.score, data: mainRecommendation, rank: 1 }]
    : [];

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500 dark:text-green-400"; // Excellent match
    if (score >= 45) return "text-yellow-500 dark:text-yellow-400"; // Decent/average match
    return "text-orange-500 dark:text-orange-400"; // Poor match
  };


  const statDescriptions = {
    speed: "How fast the ball travels off your paddle",
    spin: "Ability to generate rotation on the ball",
    control: "Precision and consistency in placement",
    power: "Force and impact of your shots"
  };


  // Premium hero card for best match
  const HeroCard = ({ item, rank }: { item: typeof allRecommendations[0]; rank?: number }) => {
    const isPreAssembled = 'Racket_Name' in item.data;
    const racket = isPreAssembled ? item.data as any : null;
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
                  <div className="product-img-wrap aspect-square w-64 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    <img
                      src={getProductImage(preAssembled, 'racket')}
                      alt={preAssembled?.Racket_Name}
                      className="product-img w-full h-full object-cover"
                    />
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
                  <div className="product-img-wrap aspect-square rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    <img
                      src={getProductImage(setup!.forehandRubber, 'rubber')}
                      alt={setup!.forehandRubber.Rubber_Name}
                      className="product-img w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link href={`/product/rubber/${slugify(setup!.forehandRubber.Rubber_Name)}`} className="text-sm font-medium text-foreground leading-tight hover:text-primary hover:underline transition-colors">{setup!.forehandRubber.Rubber_Name}</Link>
                    <p className="text-xs text-muted-foreground">Sponge: {setup!.forehandThickness || forehandThickness}</p>
                  </div>
                </div>

                {/* Blade */}
                <div className="text-center space-y-3">
                  <div className="product-img-wrap aspect-square rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    <img
                      src={getProductImage(setup!.blade, 'blade')}
                      alt={setup!.blade.Blade_Name}
                      className="product-img w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link href={`/product/blade/${slugify(setup!.blade.Blade_Name)}`} className="text-sm font-medium text-foreground leading-tight hover:text-primary hover:underline transition-colors">{setup!.blade.Blade_Name}</Link>
                    <p className="text-xs text-muted-foreground">Handle: {handleType}</p>
                  </div>
                </div>

                {/* Backhand Rubber */}
                <div className="text-center space-y-3">
                  <div className="product-img-wrap aspect-square rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    <img
                      src={getProductImage(setup!.backhandRubber, 'rubber')}
                      alt={setup!.backhandRubber.Rubber_Name}
                      className="product-img w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link href={`/product/rubber/${slugify(setup!.backhandRubber.Rubber_Name)}`} className="text-sm font-medium text-foreground leading-tight hover:text-primary hover:underline transition-colors">{setup!.backhandRubber.Rubber_Name}</Link>
                    <p className="text-xs text-muted-foreground">Sponge: {setup!.backhandThickness || backhandThickness}</p>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <StatBar label="Speed" value={stats.speed} icon={Gauge} tooltip={statDescriptions.speed} />
              <StatBar label="Spin" value={stats.spin} icon={Target} tooltip={statDescriptions.spin} />
              <StatBar label="Control" value={stats.control} icon={Shield} tooltip={statDescriptions.control} />
              <StatBar label="Power" value={stats.power} icon={Star} tooltip={statDescriptions.power} />
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

            {/* Show user's profile answers to give context */}
            {currentAnswers && Object.keys(currentAnswers).length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 text-xs">
                {Object.entries(currentAnswers).map(([key, val]) => {
                  if (!val || typeof val !== 'string' || key === 'Brand' || key === 'Budget' || key === 'WantsSpecialRubbers' || key === 'WantsSpecialHandle' || key === 'AssemblyPreference') return null;
                  return (
                    <Badge key={key} variant="secondary" className="font-normal border-primary/20 bg-primary/5 text-foreground/80">
                      <span className="opacity-60 mr-1">{key}:</span> {val}
                    </Badge>
                  );
                })}
              </div>
            )}

            <p className="text-sm text-muted-foreground leading-relaxed">
              {generateDynamicExplanation(isPreAssembled ? racket : setup, isPreAssembled, currentAnswers)}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="px-8 pb-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <Button
              onClick={() => handleRequestQuotes(item)}
              size="lg"
              className="w-full h-14 text-base font-bold rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Ask for an offer from the best shops
            </Button>
            <div className="grid grid-cols-3 gap-3">
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
              <ShareButton
                racketName={name}
                score={score}
                price={price}
                isCustom={!isPreAssembled}
                forehandRubberName={!isPreAssembled ? setup?.forehandRubber.Rubber_Name : undefined}
                backhandRubberName={!isPreAssembled ? setup?.backhandRubber.Rubber_Name : undefined}
                className="h-12 text-sm font-medium rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Flexible Budget Upsell Card Component
  const FlexibleBudgetCard = ({ upsell }: { upsell: any }) => {
    const upsellRecommendation = assemblyPreference?.includes('Ready-to-play')
      ? upsell.recommendation.preAssembled
      : upsell.recommendation.customSetup;

    if (!upsellRecommendation) return null;

    const isPreAssembled = 'Racket_Name' in upsellRecommendation;
    const upsellItem = {
      type: "main" as const,
      data: upsellRecommendation,
      score: upsellRecommendation.score,
      rank: 2
    };

    const name = isPreAssembled ? upsellRecommendation.Racket_Name : upsellRecommendation.blade.Blade_Name;
    const price = isPreAssembled ? upsellRecommendation.Racket_Price : upsellRecommendation.totalPrice;
    const level = isPreAssembled ? upsellRecommendation.Racket_Level : upsellRecommendation.blade.Blade_Level;

    // Get product images for custom setup

    // Calculate stats for comparison
    const mainSetup = assemblyPreference?.includes('Ready-to-play')
      ? recommendation.preAssembled
      : recommendation.customSetup;

    const mainStats = mainSetup && ('Racket_Speed' in mainSetup ? {
      speed: mainSetup.Racket_Speed,
      spin: mainSetup.Racket_Spin,
      control: mainSetup.Racket_Control,
      power: Math.round((mainSetup.Racket_Speed + mainSetup.Racket_Spin) / 2)
    } : {
      speed: Math.round((mainSetup.blade.Blade_Speed + mainSetup.forehandRubber.Rubber_Speed + mainSetup.backhandRubber.Rubber_Speed) / 3),
      spin: Math.round((mainSetup.blade.Blade_Spin + mainSetup.forehandRubber.Rubber_Spin + mainSetup.backhandRubber.Rubber_Spin) / 3),
      control: Math.round((mainSetup.blade.Blade_Control + mainSetup.forehandRubber.Rubber_Control + mainSetup.backhandRubber.Rubber_Control) / 3),
      power: Math.round((mainSetup.blade.Blade_Power + mainSetup.forehandRubber.Rubber_Speed + mainSetup.backhandRubber.Rubber_Speed) / 3)
    });

    const upsellStats = !isPreAssembled ? {
      speed: Math.round((upsellRecommendation.blade.Blade_Speed + upsellRecommendation.forehandRubber.Rubber_Speed + upsellRecommendation.backhandRubber.Rubber_Speed) / 3),
      spin: Math.round((upsellRecommendation.blade.Blade_Spin + upsellRecommendation.forehandRubber.Rubber_Spin + upsellRecommendation.backhandRubber.Rubber_Spin) / 3),
      control: Math.round((upsellRecommendation.blade.Blade_Control + upsellRecommendation.forehandRubber.Rubber_Control + upsellRecommendation.backhandRubber.Rubber_Control) / 3),
      power: Math.round((upsellRecommendation.blade.Blade_Power + upsellRecommendation.forehandRubber.Rubber_Speed + upsellRecommendation.backhandRubber.Rubber_Speed) / 3)
    } : {
      speed: upsellRecommendation.Racket_Speed,
      spin: upsellRecommendation.Racket_Spin,
      control: upsellRecommendation.Racket_Control,
      power: Math.round((upsellRecommendation.Racket_Speed + upsellRecommendation.Racket_Spin) / 2)
    };

    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Heading matching "Your Perfect Match" style */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="text-xs font-normal px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-1 inline" />
            Flexible budget?
          </Badge>
          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            Upgrade Your Budget
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {upsell.explanation}
          </p>
        </div>

        <Card className="overflow-hidden bg-gradient-to-br from-card via-card to-accent/5 border-accent/30 shadow-lg">
          <CardContent className="p-0">
            {/* Price Comparison Header */}
            <div className="bg-accent/10 border-b border-accent/20 px-8 py-6">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Original Budget</p>
                    <p className="text-lg font-semibold text-foreground">{upsell.originalBudget}</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs text-muted-foreground">Price Increase</p>
                    <p className="text-sm font-medium text-accent">+${upsell.priceIncrease.toFixed(0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Upgraded Budget</p>
                    <p className="text-lg font-semibold text-accent">{upsell.upsellBudget}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Display - Custom or Pre-assembled */}
            {!isPreAssembled ? (
              /* Custom Setup - Show all 3 products with images */
              <div className="px-8 py-8 space-y-8">
                {/* Overall Setup Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">Custom Setup</h3>
                  <div className="flex items-center justify-center gap-4">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {level}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-foreground">{upsellItem.score.toFixed(0)}% Match</span>
                    </div>
                    <span className="text-2xl font-bold text-accent">
                      ${price}
                    </span>
                  </div>
                </div>

                {/* 3 Products Grid - Blade in Middle */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Forehand Rubber */}
                  <div className="bg-background/50 border border-border rounded-xl p-4 space-y-3">
                    <div className="product-img-wrap aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={getProductImage(upsellRecommendation.forehandRubber, 'rubber')}
                        alt={upsellRecommendation.forehandRubber.Rubber_Name}
                        className="product-img w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Forehand Rubber</p>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {upsellRecommendation.forehandRubber.Rubber_Name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {forehandThickness}
                      </p>
                    </div>
                  </div>

                  {/* Blade */}
                  <div className="bg-background/50 border border-border rounded-xl p-4 space-y-3">
                    <div className="product-img-wrap aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={getProductImage(upsellRecommendation.blade, 'blade')}
                        alt={upsellRecommendation.blade.Blade_Name}
                        className="product-img w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Blade</p>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {upsellRecommendation.blade.Blade_Name}
                      </p>
                    </div>
                  </div>

                  {/* Backhand Rubber */}
                  <div className="bg-background/50 border border-border rounded-xl p-4 space-y-3">
                    <div className="product-img-wrap aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={getProductImage(upsellRecommendation.backhandRubber, 'rubber')}
                        alt={upsellRecommendation.backhandRubber.Rubber_Name}
                        className="product-img w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Backhand Rubber</p>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {upsellRecommendation.backhandRubber.Rubber_Name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {backhandThickness}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Comparison */}
                {mainStats && (
                  <div className="mt-8 space-y-6">
                    <h4 className="text-lg font-semibold text-center text-foreground">Performance Comparison</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Speed', main: mainStats.speed, upsell: upsellStats.speed, icon: Gauge, tooltip: statDescriptions.speed },
                        { label: 'Spin', main: mainStats.spin, upsell: upsellStats.spin, icon: Target, tooltip: statDescriptions.spin },
                        { label: 'Control', main: mainStats.control, upsell: upsellStats.control, icon: Shield, tooltip: statDescriptions.control },
                        { label: 'Power', main: mainStats.power, upsell: upsellStats.power, icon: Star, tooltip: statDescriptions.power }
                      ].map(stat => {
                        const diff = stat.upsell - stat.main;
                        return (
                          <div key={stat.label} className="space-y-2">
                            <StatBar
                              label={stat.label}
                              value={stat.upsell}
                              icon={stat.icon}
                              tooltip={stat.tooltip}
                            />
                            {diff !== 0 && (
                              <div className="text-center">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {diff > 0 ? '↑' : '↓'} {Math.abs(diff)} vs original
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Pre-assembled Racket */
              <div className="px-8 py-8">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <div className="max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden bg-muted">
                    <img
                      src={getProductImage(upsellRecommendation, 'racket')}
                      alt={name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">
                      {name}
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {level}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-foreground">{upsellItem.score.toFixed(0)}% Match</span>
                      </div>
                      <span className="text-2xl font-bold text-accent">
                        ${price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="px-8 pb-12">
              <div className="max-w-2xl mx-auto space-y-3">
                <Button
                  onClick={() => handleRequestQuotes(upsellItem)}
                  size="lg"
                  className="w-full h-14 text-base font-bold rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Ask for an offer from the best shops
                </Button>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => handleViewInConfigurator(upsellItem)}
                    variant="outline"
                    className="flex text-xs font-semibold h-11"
                  >
                    <Wrench className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                  <Button
                    className="flex text-xs font-semibold h-11"
                    variant="outline"
                    onClick={() => {
                      if (window.confirm("This will clear your current configurator session. Do you want to proceed?")) {
                        router.push(`/configurator`);
                      }
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                  <ShareButton
                    racketName={name}
                    score={upsellItem.score}
                    price={price}
                    isCustom={!isPreAssembled}
                    forehandRubberName={!isPreAssembled ? (upsellRecommendation as any).forehandRubber?.Rubber_Name : undefined}
                    backhandRubberName={!isPreAssembled ? (upsellRecommendation as any).backhandRubber?.Rubber_Name : undefined}
                    className="flex text-xs font-semibold h-11"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Show comparison view if "Not sure" is selected and no option has been chosen yet
  if (assemblyPreference === 'Not sure' && selectedOption === null) {
    return (
      <div className="w-full mx-auto space-y-16 py-12 px-4 sm:px-6 lg:px-8">
        <AssemblyComparisonView
          recommendation={recommendation}
          onSelectPreAssembled={() => setSelectedOption('preassembled')}
          onSelectCustom={() => setSelectedOption('custom')}
        />
      </div>
    );
  }

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
      {allRecommendations.length > 0 && allRecommendations[0].score < 45 && (
        <div className="max-w-2xl mx-auto bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-left space-y-1">
              <p className="text-sm font-medium text-foreground">Limited Matches Found</p>
              <p className="text-sm text-muted-foreground">
                The recommendations below have a lower absolute match score. Consider adjusting your rigorous budget or brand filters for higher-tier results.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Best Match - Hero Card */}
      {allRecommendations.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <HeroCard item={allRecommendations[0]} rank={1} />
        </div>
      )}

      {/* Reviews for this combo */}
      {allRecommendations.length > 0 && (() => {
        const item = allRecommendations[0];
        const isPA = 'Racket_Name' in item.data;
        const cs = !isPA ? item.data as any : null;
        return (
          <div className="max-w-5xl mx-auto">
            <RecommendationReviews
              blade={isPA ? undefined : cs?.blade?.Blade_Name}
              fhRubber={isPA ? undefined : cs?.forehandRubber?.Rubber_Name}
              bhRubber={isPA ? undefined : cs?.backhandRubber?.Rubber_Name}
            />
          </div>
        );
      })()}

      {/* Flexible Budget Upsell */}
      {flexibleBudgetUpsell && (
        <FlexibleBudgetCard upsell={flexibleBudgetUpsell} />
      )}

      {/* No recommendations fallback */}
      {allRecommendations.length === 0 && !flexibleBudgetUpsell && (
        <div className="max-w-2xl mx-auto text-center py-8">
          <p className="text-muted-foreground">
            No recommendations found. Try adjusting your preferences.
          </p>
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
      {/* Modal is outside the main flow */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onOpenChange={setIsLeadModalOpen}
        equipmentDetails={leadEquipmentDetail}
      />
    </div>
  );
}