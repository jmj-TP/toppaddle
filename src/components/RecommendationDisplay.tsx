import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink, Star, Target, Gauge, Shield, Info, Weight, ChevronDown, ChevronUp } from "lucide-react";
import type { Recommendation, CustomSetup } from "@/utils/ratingSystem";
import { estimateBladeWeight, estimateRubberWeight } from "@/data/products";

interface RecommendationDisplayProps {
  recommendation: Recommendation;
  onRestart: () => void;
  assemblyPreference?: string;
  budgetAmount?: number;
}

export default function RecommendationDisplay({ recommendation, onRestart, assemblyPreference, budgetAmount }: RecommendationDisplayProps) {
  const { preAssembled, customSetup, customSetup2, totalScore, forehandThickness, forehandThicknessExplanation, backhandThickness, backhandThicknessExplanation, handleType, handleTypeExplanation } = recommendation;
  
  // Calculate combined stats for sorting
  const getStatsTotal = (item: any) => {
    if (item.type === 'preAssembled') {
      return item.data.Racket_Speed + item.data.Racket_Spin + item.data.Racket_Control + item.data.Racket_Power;
    } else {
      // For custom setups, calculate combined stats
      const blade = item.data.blade;
      const fhRubber = item.data.forehandRubber;
      const bhRubber = item.data.backhandRubber;
      const combinedSpeed = Math.round((blade.Blade_Speed + fhRubber.Rubber_Speed + bhRubber.Rubber_Speed) / 3);
      const combinedSpin = Math.round((fhRubber.Rubber_Spin + bhRubber.Rubber_Spin) / 2);
      const combinedControl = Math.round((blade.Blade_Control + fhRubber.Rubber_Control + bhRubber.Rubber_Control) / 3);
      const combinedPower = Math.round((blade.Blade_Power + fhRubber.Rubber_Speed + bhRubber.Rubber_Speed) / 3);
      return combinedSpeed + combinedSpin + combinedControl + combinedPower;
    }
  };
  
  // Create array of all recommendations with their stats total for sorting
  const allRecommendations = [
    preAssembled ? { type: 'preAssembled' as const, score: preAssembled.score, data: preAssembled, statsTotal: 0 } : null,
    customSetup ? { type: 'custom1' as const, score: customSetup.score, data: customSetup, statsTotal: 0 } : null,
    customSetup2 ? { type: 'custom2' as const, score: customSetup2.score, data: customSetup2, statsTotal: 0 } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null)
   .map(item => ({ ...item, statsTotal: getStatsTotal(item) }))
   .sort((a, b) => b.statsTotal - a.statsTotal); // Sort by stats total descending

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
  const PreAssembledCard = ({ rank }: { rank?: number }) => preAssembled ? (
    <Card className="border-border" style={{ boxShadow: "var(--shadow-lg)" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🏓 <span>Ready-to-Play Racket{rank ? ` #${rank}` : ''}</span>
            <Badge variant="secondary">Beginner Friendly</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className={`font-bold ${getScoreColor(preAssembled.score)}`}>
              {preAssembled.score.toFixed(0)}% Match
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{preAssembled.Racket_Name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              ✅ No assembly needed - perfect for beginners!
            </p>
            
            <div className="space-y-2">
              <StatBar label="Speed" value={preAssembled.Racket_Speed} icon={Gauge} />
              <StatBar label="Spin" value={preAssembled.Racket_Spin} icon={Target} />
              <StatBar label="Control" value={preAssembled.Racket_Control} icon={Shield} />
              <StatBar label="Power" value={preAssembled.Racket_Power} icon={Star} />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Weight:</span> ~180g
              </div>
              <div>
                <span className="font-medium">Level:</span> {preAssembled.Racket_Level}
              </div>
              <div>
                <span className="font-medium">Grip:</span> {preAssembled.Racket_Grip}
              </div>
              <div>
                <span className="font-medium">Price:</span> 
                <span className="text-lg font-bold text-primary ml-1">
                  {formatPrice(preAssembled.Racket_Price)}
                </span>
              </div>
            </div>
            
            <Button 
              asChild 
              variant="accent"
              className="w-full"
            >
              <a 
                href={preAssembled.Racket_Affiliate_Link} 
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
                      {formatPrice(setup.totalPrice)}
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
                    <div className="text-sm">
                      <span className="font-medium">Price:</span> 
                      <span className="font-bold ml-1">{formatPrice(setup.blade.Blade_Price)}</span>
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
                      <span className="font-bold ml-1">{formatPrice(setup.forehandRubber.Rubber_Price)}</span>
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
                      <span className="font-bold ml-1">{formatPrice(setup.backhandRubber.Rubber_Price)}</span>
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
        
        {/* Handle Type Recommendation */}
        <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg max-w-2xl mx-auto">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors w-full">
                <Info className="w-4 h-4" />
                <span>Recommended Handle Type:</span>
                <span className="font-bold text-accent">{handleType}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Why {handleType}?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {handleTypeExplanation}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {budgetAmount && budgetAmount < 60 && (
          <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-sm text-foreground">
              💡 <strong>Note:</strong> Your budget is best suited for pre-assembled rackets. 
              Custom setups typically start at $90+ due to blade and rubber costs.
            </p>
          </div>
        )}
      </div>


      {/* Render recommendations sorted by score (best first) */}
      {allRecommendations.map((item, index) => {
        const rank = allRecommendations.length > 1 ? index + 1 : undefined;
        
        if (item.type === 'preAssembled') {
          return <PreAssembledCard key="preAssembled" rank={rank} />;
        } else if (item.type === 'custom1') {
          return <CustomSetupCard key="custom1" setup={item.data} rank={rank} />;
        } else if (item.type === 'custom2') {
          return <CustomSetupCard key="custom2" setup={item.data} rank={rank} />;
        }
        return null;
      })}

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