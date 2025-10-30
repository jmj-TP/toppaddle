import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Gauge, Target, Shield, Star, Settings, DollarSign, Scale, Wrench, GitCompare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import { RadarComparisonChart } from "@/components/comparison/RadarComparisonChart";
import type { ComparisonPaddle } from "@/stores/comparisonStore";
import { StatSlider } from "@/components/configurator/StatSlider";

export interface UserPreferences {
  budget: number;
  level: string;
  speed: number;
  spin: number;
  control: number;
  power: number;
  weight?: number; // Preferred total weight in grams (optional)
  // Component-specific preferences
  forehandSpeed?: number;
  forehandSpin?: number;
  forehandControl?: number;
  forehandPower?: number;
  bladeSpeed?: number;
  bladeSpin?: number;
  bladeControl?: number;
  bladePower?: number;
  backhandSpeed?: number;
  backhandSpin?: number;
  backhandControl?: number;
  backhandPower?: number;
}

interface StatsDisplayProps {
  stats: {
    speed: number;
    spin: number;
    control: number;
    power: number;
    price: number;
  };
  level: string;
  blade: Blade | null;
  forehand: Rubber | null;
  backhand: Rubber | null;
  racket: PreAssembledRacket | null;
  onRandomReroll: () => void;
  onPreferencesChange?: (preferences: UserPreferences) => void;
  onAddToCart?: () => void;
  onAddToCompare?: () => void;
  isPreassembled: boolean;
  assembleForMe: boolean;
  onAssembleChange: (value: boolean) => void;
  sealsService: boolean;
  onSealsChange: (value: boolean) => void;
}

const StatsDisplay = ({
  stats,
  level,
  blade,
  forehand,
  backhand,
  racket,
  onRandomReroll,
  onPreferencesChange,
  onAddToCart,
  onAddToCompare,
  isPreassembled,
  assembleForMe,
  onAssembleChange,
  sealsService,
  onSealsChange,
}: StatsDisplayProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editBudget, setEditBudget] = useState<number>(250);
  const [editLevel, setEditLevel] = useState(level);
  const [editSpeed, setEditSpeed] = useState(stats.speed);
  const [editSpin, setEditSpin] = useState(stats.spin);
  const [editControl, setEditControl] = useState(stats.control);
  const [editPower, setEditPower] = useState(stats.power);
  const [editWeight, setEditWeight] = useState<number>(200); // Default preferred weight in grams (150-250g range)
  
  // Advanced component-specific preferences
  const [editForehandSpeed, setEditForehandSpeed] = useState(forehand?.Rubber_Speed || 50);
  const [editForehandSpin, setEditForehandSpin] = useState(forehand?.Rubber_Spin || 50);
  const [editForehandControl, setEditForehandControl] = useState(forehand?.Rubber_Control || 50);
  const [editForehandPower, setEditForehandPower] = useState(forehand?.Rubber_Power || 50);
  
  const [editBladeSpeed, setEditBladeSpeed] = useState(blade?.Blade_Speed || 50);
  const [editBladeSpin, setEditBladeSpin] = useState(blade?.Blade_Spin || 50);
  const [editBladeControl, setEditBladeControl] = useState(blade?.Blade_Control || 50);
  const [editBladePower, setEditBladePower] = useState(blade?.Blade_Power || 50);
  
  const [editBackhandSpeed, setEditBackhandSpeed] = useState(backhand?.Rubber_Speed || 50);
  const [editBackhandSpin, setEditBackhandSpin] = useState(backhand?.Rubber_Spin || 50);
  const [editBackhandControl, setEditBackhandControl] = useState(backhand?.Rubber_Control || 50);
  const [editBackhandPower, setEditBackhandPower] = useState(backhand?.Rubber_Power || 50);
  
  // Sync state with props when they change
  useEffect(() => {
    setEditLevel(level);
    setEditSpeed(stats.speed);
    setEditSpin(stats.spin);
    setEditControl(stats.control);
    setEditPower(stats.power);
    setEditForehandSpeed(forehand?.Rubber_Speed || 50);
    setEditForehandSpin(forehand?.Rubber_Spin || 50);
    setEditForehandControl(forehand?.Rubber_Control || 50);
    setEditForehandPower(forehand?.Rubber_Power || 50);
    setEditBladeSpeed(blade?.Blade_Speed || 50);
    setEditBladeSpin(blade?.Blade_Spin || 50);
    setEditBladeControl(blade?.Blade_Control || 50);
    setEditBladePower(blade?.Blade_Power || 50);
    setEditBackhandSpeed(backhand?.Rubber_Speed || 50);
    setEditBackhandSpin(backhand?.Rubber_Spin || 50);
    setEditBackhandControl(backhand?.Rubber_Control || 50);
    setEditBackhandPower(backhand?.Rubber_Power || 50);
  }, [stats, level, blade, forehand, backhand]);
  
  const handleEditPreferences = () => {
    setIsEditMode(true);
  };

  const handleSavePreferences = () => {
    if (onPreferencesChange) {
      const preferences: UserPreferences = {
        budget: editBudget,
        level: editLevel,
        speed: editSpeed,
        spin: editSpin,
        control: editControl,
        power: editPower,
        weight: editWeight, // Add weight preference
      };
      
      // Include component-specific preferences if advanced mode is enabled
      if (showAdvanced) {
        preferences.forehandSpeed = editForehandSpeed;
        preferences.forehandSpin = editForehandSpin;
        preferences.forehandControl = editForehandControl;
        preferences.forehandPower = editForehandPower;
        preferences.bladeSpeed = editBladeSpeed;
        preferences.bladeSpin = editBladeSpin;
        preferences.bladeControl = editBladeControl;
        preferences.bladePower = editBladePower;
        preferences.backhandSpeed = editBackhandSpeed;
        preferences.backhandSpin = editBackhandSpin;
        preferences.backhandControl = editBackhandControl;
        preferences.backhandPower = editBackhandPower;
      }
      
      onPreferencesChange(preferences);
    }
    setIsEditMode(false);
    setShowAdvanced(false);
  };

  const calculateTotalWeight = () => {
    if (racket) {
      return '~180g';
    }
    return `${(blade?.Blade_Weight || 85) + (forehand?.Rubber_Weight || 45) + (backhand?.Rubber_Weight || 45)}g`;
  };

  const StatBar = ({ label, value, Icon }: { label: string; value: number; Icon: any }) => (
    <div className="py-3 px-4 bg-muted/30 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-accent ml-auto">{value}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  // No longer needed - removed Amazon affiliate functionality
  const handleBuyClick = () => {
    // Functionality removed - customers now use our integrated shop
  };

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Left Column - Stats and Configuration */}
        <div className="space-y-6">
          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-6 px-4">
            {isEditMode ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Budget</span>
                  <Select 
                    value={editBudget.toString()} 
                    onValueChange={(value) => setEditBudget(parseFloat(value))}
                  >
                    <SelectTrigger className="w-36 h-9 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">&lt;$50</SelectItem>
                      <SelectItem value="90">&lt;$90</SelectItem>
                      <SelectItem value="120">&lt;$120</SelectItem>
                      <SelectItem value="140">&lt;$140</SelectItem>
                      <SelectItem value="160">&lt;$160</SelectItem>
                      <SelectItem value="180">&lt;$180</SelectItem>
                      <SelectItem value="200">&lt;$200</SelectItem>
                      <SelectItem value="230">&lt;$230</SelectItem>
                      <SelectItem value="250">&lt;$250</SelectItem>
                      <SelectItem value="300">&lt;$300</SelectItem>
                      <SelectItem value="999999">No Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Level</span>
                  <Select value={editLevel} onValueChange={setEditLevel}>
                    <SelectTrigger className="w-36 h-9 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-semibold text-foreground">
                  ${stats.price.toFixed(2)}
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="text-sm text-muted-foreground">
                  {level}
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="text-sm text-muted-foreground">
                  {calculateTotalWeight()}
                </div>
              </>
            )}
          </div>

          {/* Stats Bars or Sliders */}
          {isEditMode ? (
            <div className="space-y-3">
              <StatSlider label="Speed" value={editSpeed} icon={Gauge} onChange={setEditSpeed} />
              <StatSlider label="Spin" value={editSpin} icon={Target} onChange={setEditSpin} />
              <StatSlider label="Control" value={editControl} icon={Shield} onChange={setEditControl} />
              <StatSlider label="Power" value={editPower} icon={Star} onChange={setEditPower} />
              
              {/* Weight Preference */}
              <StatSlider 
                label="Weight" 
                value={editWeight} 
                icon={Scale} 
                onChange={setEditWeight}
                description="Preferred total weight in grams. Lighter for speed, heavier for power."
                showValue={true}
              />
              
              {/* Save and Advanced Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSavePreferences}
                  variant="default"
                  className="flex-1 rounded-xl"
                >
                  Save Preferences
                </Button>
                {!racket && (
                  <Button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {showAdvanced ? "Hide Advanced" : "Advanced"}
                  </Button>
                )}
              </div>
              
              {/* Advanced Component-Specific Stats */}
              {showAdvanced && !racket && (
                <div className="mt-4 space-y-4 pt-4 border-t border-border">
                  {/* Forehand Rubber */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      🔴 Forehand Rubber
                    </h4>
                    <StatSlider label="Speed" value={editForehandSpeed} icon={Gauge} onChange={setEditForehandSpeed} />
                    <StatSlider label="Spin" value={editForehandSpin} icon={Target} onChange={setEditForehandSpin} />
                    <StatSlider label="Control" value={editForehandControl} icon={Shield} onChange={setEditForehandControl} />
                    <StatSlider label="Power" value={editForehandPower} icon={Star} onChange={setEditForehandPower} />
                  </div>
                  
                  {/* Blade */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      🏓 Blade
                    </h4>
                    <StatSlider label="Speed" value={editBladeSpeed} icon={Gauge} onChange={setEditBladeSpeed} />
                    <StatSlider label="Spin" value={editBladeSpin} icon={Target} onChange={setEditBladeSpin} />
                    <StatSlider label="Control" value={editBladeControl} icon={Shield} onChange={setEditBladeControl} />
                    <StatSlider label="Power" value={editBladePower} icon={Star} onChange={setEditBladePower} />
                  </div>
                  
                  {/* Backhand Rubber */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      ⚫ Backhand Rubber
                    </h4>
                    <StatSlider label="Speed" value={editBackhandSpeed} icon={Gauge} onChange={setEditBackhandSpeed} />
                    <StatSlider label="Spin" value={editBackhandSpin} icon={Target} onChange={setEditBackhandSpin} />
                    <StatSlider label="Control" value={editBackhandControl} icon={Shield} onChange={setEditBackhandControl} />
                    <StatSlider label="Power" value={editBackhandPower} icon={Star} onChange={setEditBackhandPower} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <StatBar label="Speed" value={stats.speed} Icon={Gauge} />
                <StatBar label="Spin" value={stats.spin} Icon={Target} />
                <StatBar label="Control" value={stats.control} Icon={Shield} />
                <StatBar label="Power" value={stats.power} Icon={Star} />
              </div>
              
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleEditPreferences}
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Change Preferences
                </Button>
              </div>
                
                {/* Radar Chart */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold mb-4 text-center">Performance Overview</h3>
                  <RadarComparisonChart 
                    paddles={[{
                      id: racket ? racket.Racket_Name : `${blade?.Blade_Name}-${forehand?.Rubber_Name}-${backhand?.Rubber_Name}`,
                      name: racket ? racket.Racket_Name : "Custom Paddle",
                      image: "",
                      speed: stats.speed,
                      control: stats.control,
                      power: stats.power,
                      spin: stats.spin,
                      price: stats.price,
                      weight: racket ? 180 : (blade?.Blade_Weight || 85) + (forehand?.Rubber_Weight || 45) + (backhand?.Rubber_Weight || 45),
                      level: level as "Beginner" | "Intermediate" | "Advanced",
                      blade: blade?.Blade_Name,
                      forehandRubber: forehand?.Rubber_Name,
                      backhandRubber: backhand?.Rubber_Name
                    }]}
                  />
                </div>
              </>
            )}
        </div>

        {/* Right Column - Buttons */}
        <div className="flex flex-col gap-3">
          {!isEditMode && (
            <Button
              onClick={handleEditPreferences}
              variant="outline"
              size="lg"
              className="w-full lg:hidden py-6 font-semibold"
            >
              <Settings className="mr-2 h-5 w-5" />
              Change Preferences
            </Button>
          )}
          <Button
            onClick={onRandomReroll}
            size="lg"
            className="w-full text-xl py-8 font-bold shadow-lg hover:shadow-xl transition-all bg-orange-500 hover:bg-orange-600 text-white border-4 border-black rounded-2xl"
          >
            Random Reroll
          </Button>
          {onAddToCart && (
            <>
              {!isPreassembled && (
                <div className="bg-accent/10 border-2 border-accent/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Wrench className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm">Free Professional Assembly</h4>
                      <p className="text-xs text-muted-foreground">
                        TopPaddle offers complimentary professional racket assembly. We'll expertly glue your chosen rubbers to your blade for perfect performance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="assemble" 
                      checked={assembleForMe}
                      onCheckedChange={onAssembleChange}
                    />
                    <Label 
                      htmlFor="assemble" 
                      className="text-sm font-medium cursor-pointer"
                    >
                      Assemble my racket for me (Free)
                    </Label>
                  </div>
                </div>
              )}
              {!isPreassembled && (
                <div className="bg-primary/10 border-2 border-primary/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm">Blade Seals Service ($5.49)</h4>
                      <p className="text-xs text-muted-foreground">
                        Moisture-resistant coating protects wood fibers and makes rubber removal safe and easy.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="seals" 
                      checked={sealsService}
                      onCheckedChange={onSealsChange}
                    />
                    <Label 
                      htmlFor="seals" 
                      className="text-sm font-medium cursor-pointer"
                    >
                      Add blade seals service (+$5.49)
                    </Label>
                  </div>
                </div>
              )}
              <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Pre-launch pricing
                    </p>
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      Final prices will update after our supplier partnership is confirmed.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={onAddToCart}
                size="lg"
                className="w-full text-xl py-8 font-bold shadow-lg hover:shadow-xl transition-all border-4 border-black rounded-2xl"
              >
                Add to Cart
              </Button>
              {onAddToCompare && (
                <Button
                  onClick={onAddToCompare}
                  variant="outline"
                  size="lg"
                  className="w-full text-lg py-6 font-semibold"
                >
                  <GitCompare className="w-5 h-5 mr-2" />
                  Add to Compare
                </Button>
              )}
            </>
          )}
        </div>
      </div>

    </>
  );
};

export default StatsDisplay;
