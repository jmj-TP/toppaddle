import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { ExternalLink, Star, Target, Gauge, Shield, Info, Weight, Settings } from "lucide-react";
import type { Recommendation } from "@/utils/ratingSystem";
import { estimateBladeWeight, estimateRubberWeight } from "@/data/products";
import { useState } from "react";

interface RecommendationDisplayProps {
  recommendation: Recommendation;
  onRestart: () => void;
  assemblyPreference?: string;
  onWeightChange?: (weightRange: { min: number; max: number }) => void;
}

export default function RecommendationDisplay({ recommendation, onRestart, assemblyPreference, onWeightChange }: RecommendationDisplayProps) {
  const { preAssembled, customSetup, totalScore, forehandThickness, forehandThicknessExplanation, backhandThickness, backhandThicknessExplanation } = recommendation;
  
  // Determine which option to show first based on user preference
  const showCustomFirst = assemblyPreference === "Custom setup";
  
  // Weight customization state
  const [weightRange, setWeightRange] = useState([150, 200]);
  const [showWeightCustomizer, setShowWeightCustomizer] = useState(false);
  
  // Calculate current weight
  const currentWeight = customSetup 
    ? estimateBladeWeight(customSetup.blade) + estimateRubberWeight(customSetup.forehandRubber) + estimateRubberWeight(customSetup.backhandRubber)
    : 180;
  
  const handleWeightApply = () => {
    if (onWeightChange) {
      onWeightChange({ min: weightRange[0], max: weightRange[1] });
      setShowWeightCustomizer(false);
    }
  };

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
  const PreAssembledCard = () => preAssembled ? (
    <Card className="border-border" style={{ boxShadow: "var(--shadow-lg)" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🏓 <span>Ready-to-Play Racket</span>
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

  // Custom setup card component
  const CustomSetupCard = () => customSetup ? (
    <Card className="border-border" style={{ boxShadow: "var(--shadow-lg)" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            ⚡ <span>Custom Setup</span>
            <Badge variant="outline">Advanced Choice</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className={`font-bold ${getScoreColor(customSetup.score)}`}>
              {customSetup.score.toFixed(0)}% Match
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Blade */}
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            🏏 Blade: {customSetup.blade.Blade_Name}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <StatBar label="Speed" value={customSetup.blade.Blade_Speed} icon={Gauge} />
              <StatBar label="Control" value={customSetup.blade.Blade_Control} icon={Shield} />
              <StatBar label="Power" value={customSetup.blade.Blade_Power} icon={Star} />
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Level:</span> {customSetup.blade.Blade_Level}
              </div>
              <div className="text-sm">
                <span className="font-medium">Grip:</span> {customSetup.blade.Blade_Grip}
              </div>
              <div className="text-sm">
                <span className="font-medium">Price:</span> 
                <span className="font-bold ml-1">{formatPrice(customSetup.blade.Blade_Price)}</span>
              </div>
              <Button size="sm" asChild variant="accent">
                <a 
                  href={customSetup.blade.Blade_Affiliate_Link} 
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
            🔴 Forehand Rubber: {customSetup.forehandRubber.Rubber_Name}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <StatBar label="Speed" value={customSetup.forehandRubber.Rubber_Speed} icon={Gauge} />
              <StatBar label="Spin" value={customSetup.forehandRubber.Rubber_Spin} icon={Target} />
              <StatBar label="Control" value={customSetup.forehandRubber.Rubber_Control} icon={Shield} />
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
                <span className="font-medium">Level:</span> {customSetup.forehandRubber.Rubber_Level}
              </div>
              <div className="text-sm">
                <span className="font-medium">Price:</span> 
                <span className="font-bold ml-1">{formatPrice(customSetup.forehandRubber.Rubber_Price)}</span>
              </div>
              <Button size="sm" asChild variant="accent">
                <a 
                  href={customSetup.forehandRubber.Rubber_Affiliate_Link} 
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
            🔵 Backhand Rubber: {customSetup.backhandRubber.Rubber_Name}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <StatBar label="Speed" value={customSetup.backhandRubber.Rubber_Speed} icon={Gauge} />
              <StatBar label="Spin" value={customSetup.backhandRubber.Rubber_Spin} icon={Target} />
              <StatBar label="Control" value={customSetup.backhandRubber.Rubber_Control} icon={Shield} />
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
                <span className="font-medium">Level:</span> {customSetup.backhandRubber.Rubber_Level}
              </div>
              <div className="text-sm">
                <span className="font-medium">Price:</span> 
                <span className="font-bold ml-1">{formatPrice(customSetup.backhandRubber.Rubber_Price)}</span>
              </div>
              <Button size="sm" asChild variant="accent">
                <a 
                  href={customSetup.backhandRubber.Rubber_Affiliate_Link} 
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

        {/* Total Price and Weight */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-secondary rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              💰 Total Price: {formatPrice(customSetup.totalPrice)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ✅ Fits your budget perfectly!
            </p>
          </div>
          <Popover open={showWeightCustomizer} onOpenChange={setShowWeightCustomizer}>
            <PopoverTrigger asChild>
              <button className="bg-secondary rounded-lg p-4 text-center hover:bg-secondary/80 transition-colors cursor-pointer">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                  <Weight className="w-6 h-6" />
                  {(() => {
                    const bladeWeight = estimateBladeWeight(customSetup.blade);
                    const fhWeight = estimateRubberWeight(customSetup.forehandRubber);
                    const bhWeight = estimateRubberWeight(customSetup.backhandRubber);
                    const totalWeight = bladeWeight + fhWeight + bhWeight;
                    return `${totalWeight}g`;
                  })()}
                  <Settings className="w-5 h-5 ml-1 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Click to adjust weight preference
                </p>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Customize Weight Range</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Adjust to find rackets in your preferred weight range. Your playing style stays the same.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Weight Range:</span>
                    <span className="text-primary font-bold">{weightRange[0]}g - {weightRange[1]}g</span>
                  </div>
                  <Slider
                    min={140}
                    max={210}
                    step={5}
                    value={weightRange}
                    onValueChange={setWeightRange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>140g (Light)</span>
                    <span>210g (Heavy)</span>
                  </div>
                </div>
                <Button 
                  onClick={handleWeightApply}
                  className="w-full"
                  variant="accent"
                >
                  Find New Recommendations
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  ) : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">
          ✨ Your Perfect Racket Setup! ✨
        </h2>
        <p className="text-muted-foreground">
          Based on your preferences, here are our top recommendations
        </p>
      </div>


      {/* Render recommendations in order based on preference */}
      {showCustomFirst ? (
        <>
          <CustomSetupCard />
          <PreAssembledCard />
        </>
      ) : (
        <>
          <PreAssembledCard />
          <CustomSetupCard />
        </>
      )}

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