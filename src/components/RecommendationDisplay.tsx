import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink, Star, Target, Gauge, Shield, Info, Weight, ChevronDown, ChevronUp, Settings, DollarSign, Package } from "lucide-react";
import type { Recommendation, CustomSetup, QuizAnswers } from "@/utils/ratingSystem";
import { estimateBladeWeight, estimateRubberWeight } from "@/data/products";
import BrandSelector from "./BrandSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  
  const [showPreferenceEditor, setShowPreferenceEditor] = useState(false);
  const [tempBudget, setTempBudget] = useState(currentAnswers?.Budget || "<100$");
  const [tempBrands, setTempBrands] = useState<string[]>(currentAnswers?.Brand || []);
  
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
    if (score >= 85) return "text-primary";
    if (score >= 70) return "text-accent";
    return "text-destructive";
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
  const PreAssembledCard = ({ racket, rank }: { racket: typeof preAssembled, rank?: number }) => racket ? (
    <Card className="border-border" style={{ boxShadow: "var(--shadow-lg)" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🏓 <span>Ready-to-Play Racket{rank ? ` #${rank}` : ''}</span>
            <Badge variant="secondary">Beginner Friendly</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className={`font-bold ${getScoreColor(racket.score)}`}>
              {racket.score.toFixed(0)}% Match
            </span>
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
                <span className="font-medium">Grip:</span> {racket.Racket_Grip}
              </div>
              <div>
                <span className="font-medium">Price:</span> 
                <span className="text-lg font-bold text-primary ml-1">
                  {formatPrice(racket.Racket_Price)}*
                </span>
              </div>
            </div>
            
            <Button 
              asChild 
              variant="accent"
              className="w-full"
            >
              <a 
                href={racket.Racket_Affiliate_Link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Buy on Amazon
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null;

  // Custom setup card component with collapsible details
  const CustomSetupCard = ({ setup, rank }: { setup: CustomSetup; rank?: number }) => {
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
        <Card className="border-border" style={{ boxShadow: "var(--shadow-lg)" }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                ⚡ <span>Custom Setup{rank ? ` #${rank}` : ''}</span>
                <Badge variant="outline">Advanced Choice</Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className={`font-bold ${getScoreColor(setup.score)}`}>
                  {setup.score.toFixed(0)}% Match
                </span>
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
                    <span className="font-medium">Grip:</span> {setup.blade.Blade_Grip}
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
                  🏏 Blade: {setup.blade.Blade_Name}
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
                      <span className="font-medium">Grip:</span> {setup.blade.Blade_Grip}
                    </div>
                    <div className="mt-3 p-3 bg-accent/10 border border-accent/30 rounded-md">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <div className="text-xs leading-relaxed">
                          <span className="font-semibold text-accent">Handle Recommendation:</span>
                          <span className="text-foreground"> When purchasing, make sure to choose </span>
                          <span className="font-bold text-accent">{handleType}</span>
                          <span className="text-foreground"> handle in the shop.</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Price:</span> 
                      <span className="font-bold ml-1">{formatPrice(setup.blade.Blade_Price)}*</span>
                    </div>
                    <Button size="sm" asChild variant="accent">
                      <a 
                        href={setup.blade.Blade_Affiliate_Link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Buy Blade
                      </a>
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
                    <Button size="sm" asChild variant="accent">
                      <a 
                        href={setup.forehandRubber.Rubber_Affiliate_Link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Buy FH Rubber
                      </a>
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
                    <Button size="sm" asChild variant="accent">
                      <a 
                        href={setup.backhandRubber.Rubber_Affiliate_Link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Buy BH Rubber
                      </a>
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
      {allRecommendations.map((item, index) => {
        const rank = allRecommendations.length > 1 ? index + 1 : undefined;
        
        if (item.type === 'preAssembled' || item.type === 'preAssembled2') {
          return <PreAssembledCard key={item.type} racket={item.data} rank={rank} />;
        } else if (item.type === 'custom1') {
          return <CustomSetupCard key="custom1" setup={item.data} rank={rank} />;
        } else if (item.type === 'custom2') {
          return <CustomSetupCard key="custom2" setup={item.data} rank={rank} />;
        }
        return null;
      })}

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