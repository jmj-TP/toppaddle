import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, Info, Wrench, Package, Star, TrendingUp, DollarSign } from "lucide-react";
import type { Recommendation, CustomSetup } from "@/utils/ratingSystem";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AssemblyComparisonViewProps {
  recommendation: Recommendation;
  onSelectPreAssembled: () => void;
  onSelectCustom: () => void;
}

export default function AssemblyComparisonView({ 
  recommendation, 
  onSelectPreAssembled, 
  onSelectCustom 
}: AssemblyComparisonViewProps) {
  const { preAssembled, customSetup } = recommendation;
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  if (!preAssembled || !customSetup) return null;

  // Calculate prices
  const preAssembledPrice = preAssembled.Racket_Price;
  const customPrice = customSetup.totalPrice;
  
  // Calculate performance scores (average of stats)
  const preAssembledPerf = Math.round((preAssembled.Racket_Speed + preAssembled.Racket_Control + preAssembled.Racket_Spin) / 3);
  const customPerf = Math.round((
    (customSetup.blade.Blade_Speed + customSetup.forehandRubber.Rubber_Speed + customSetup.backhandRubber.Rubber_Speed) / 3 +
    (customSetup.blade.Blade_Control + customSetup.forehandRubber.Rubber_Control + customSetup.backhandRubber.Rubber_Control) / 3 +
    (customSetup.blade.Blade_Spin + customSetup.forehandRubber.Rubber_Spin + customSetup.backhandRubber.Rubber_Spin) / 3
  ) / 3);
  
  // Determine which is better based on score and value
  const preAssembledValueScore = (preAssembled.score / preAssembledPrice) * 100;
  const customValueScore = (customSetup.score / customPrice) * 100;
  
  const isPreAssembledBetter = preAssembledValueScore > customValueScore;
  const scoreDifference = Math.abs(preAssembled.score - customSetup.score);
  
  // Generate recommendation text
  const getRecommendationText = () => {
    if (isPreAssembledBetter) {
      if (scoreDifference > 5) {
        return "The pre-assembled racket from the manufacturer offers excellent value and matches your style significantly better.";
      }
      return "The pre-assembled racket is ready to play immediately and offers great value for your playing style.";
    } else {
      if (scoreDifference > 5) {
        return "The custom setup assembled by topPaddle provides a measurably better match for your specific playing style and preferences.";
      }
      return "The custom setup allows for more precise tuning to your exact preferences, professionally assembled by topPaddle.";
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
          <Info className="w-4 h-4 mr-2" />
          Not Sure? We'll Help You Decide
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent">
          Compare Your Options
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We've analyzed both options for you. Here's a side-by-side comparison to help you choose.
        </p>
      </div>

      {/* Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Our Recommendation</h3>
            <p className="text-muted-foreground">{getRecommendationText()}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                {isPreAssembledBetter ? "Pre-Assembled" : "Custom Setup"} Recommended
              </Badge>
              <span className="text-sm text-muted-foreground">
                {Math.abs(preAssembled.score - customSetup.score).toFixed(1)}% better match
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pre-Assembled Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
            isPreAssembledBetter ? 'ring-2 ring-primary shadow-lg' : ''
          }`}>
            {isPreAssembledBetter && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Best Match
                </Badge>
              </div>
            )}
            
            <CardContent className="p-6 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Package className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Pre-Assembled Racket</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  From manufacturer - ready to play
                </p>
              </div>

              {/* Image */}
              <div className="aspect-square rounded-lg bg-muted/30 overflow-hidden">
                <img
                  src={preAssembled.Racket_Image || "/placeholder.svg"}
                  alt={preAssembled.Racket_Name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Name */}
              <div>
                <h4 className="font-semibold text-lg">{preAssembled.Racket_Name}</h4>
              </div>

              {/* Match Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className="text-2xl font-bold text-primary">
                    {preAssembled.score.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${preAssembled.score}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Speed</span>
                  <span className="font-medium">{preAssembled.Racket_Speed}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Control</span>
                  <span className="font-medium">{preAssembled.Racket_Control}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Spin</span>
                  <span className="font-medium">{preAssembled.Racket_Spin}/10</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-2xl font-bold">${preAssembledPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Pros */}
              <div className="space-y-2 pt-2">
                <h5 className="text-sm font-semibold text-muted-foreground">Why Choose This:</h5>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Assembled by manufacturer</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Arrives ready to play</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Great value for beginners to intermediate</span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <Button 
                onClick={onSelectPreAssembled}
                className="w-full"
                size="lg"
                variant={isPreAssembledBetter ? "default" : "outline"}
              >
                Choose Pre-Assembled
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Custom Setup Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
            !isPreAssembledBetter ? 'ring-2 ring-primary shadow-lg' : ''
          }`}>
            {!isPreAssembledBetter && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Best Match
                </Badge>
              </div>
            )}
            
            <CardContent className="p-6 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Wrench className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Custom Setup</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Blade + rubbers - assembled by topPaddle
                </p>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-lg bg-muted/30 overflow-hidden">
                  <img
                    src={customSetup.blade.Blade_Image || "/placeholder.svg"}
                    alt={customSetup.blade.Blade_Name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="aspect-square rounded-lg bg-muted/30 overflow-hidden">
                  <img
                    src={customSetup.forehandRubber.Rubber_Image || "/placeholder.svg"}
                    alt={customSetup.forehandRubber.Rubber_Name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="aspect-square rounded-lg bg-muted/30 overflow-hidden">
                  <img
                    src={customSetup.backhandRubber.Rubber_Image || "/placeholder.svg"}
                    alt={customSetup.backhandRubber.Rubber_Name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Product Names */}
              <div className="space-y-1 text-sm">
                <div className="font-semibold truncate">{customSetup.blade.Blade_Name}</div>
                <div className="text-muted-foreground truncate">FH: {customSetup.forehandRubber.Rubber_Name}</div>
                <div className="text-muted-foreground truncate">BH: {customSetup.backhandRubber.Rubber_Name}</div>
              </div>

              {/* Match Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className="text-2xl font-bold text-primary">
                    {customSetup.score.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${customSetup.score}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Speed</span>
                  <span className="font-medium">{Math.round((customSetup.blade.Blade_Speed + customSetup.forehandRubber.Rubber_Speed + customSetup.backhandRubber.Rubber_Speed) / 3)}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Control</span>
                  <span className="font-medium">{Math.round((customSetup.blade.Blade_Control + customSetup.forehandRubber.Rubber_Control + customSetup.backhandRubber.Rubber_Control) / 3)}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Spin</span>
                  <span className="font-medium">{Math.round((customSetup.blade.Blade_Spin + customSetup.forehandRubber.Rubber_Spin + customSetup.backhandRubber.Rubber_Spin) / 3)}/10</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-2xl font-bold">${customPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Pros */}
              <div className="space-y-2 pt-2">
                <h5 className="text-sm font-semibold text-muted-foreground">Why Choose This:</h5>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Perfectly tailored to your style</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Professionally assembled by topPaddle</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Maximum performance potential</span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <Button 
                onClick={onSelectCustom}
                className="w-full"
                size="lg"
                variant={!isPreAssembledBetter ? "default" : "outline"}
              >
                Choose Custom Setup
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>Still unsure? Both options are excellent choices. You can always upgrade later.</p>
      </motion.div>
    </div>
  );
}
