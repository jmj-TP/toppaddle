import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Gauge, Target, Shield, Star, Settings, DollarSign, Scale } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";

export interface UserPreferences {
  budget: number;
  level: string;
  speed: number;
  spin: number;
  control: number;
  power: number;
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
}: StatsDisplayProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editBudget, setEditBudget] = useState<number>(250);
  const [editLevel, setEditLevel] = useState(level);
  const [editSpeed, setEditSpeed] = useState(stats.speed);
  const [editSpin, setEditSpin] = useState(stats.spin);
  const [editControl, setEditControl] = useState(stats.control);
  const [editPower, setEditPower] = useState(stats.power);
  
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
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <span className="text-sm font-medium min-w-[60px]">{label}:</span>
      <div className="flex-1 bg-muted dark:bg-secondary/30 rounded-full h-2">
        <div 
          className="bg-primary dark:bg-accent rounded-full h-2 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-semibold min-w-[30px]">{value}</span>
    </div>
  );

  const StatSlider = ({ 
    label, 
    value, 
    Icon, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    Icon: any; 
    onChange: (value: number) => void;
  }) => (
    <div className="flex items-center gap-3 mb-4 py-2">
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <span className="text-sm font-medium min-w-[60px]">{label}:</span>
      <div className="flex-1 px-2 py-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      <span className="text-sm font-semibold min-w-[30px] text-right">{value}</span>
    </div>
  );

  const handleBuyClick = () => {
    if (racket) {
      window.open(racket.Racket_Affiliate_Link, "_blank");
    } else if (blade && forehand && backhand) {
      // Open all three links
      window.open(blade.Blade_Affiliate_Link, "_blank");
      setTimeout(() => window.open(forehand.Rubber_Affiliate_Link, "_blank"), 500);
      setTimeout(() => window.open(backhand.Rubber_Affiliate_Link, "_blank"), 1000);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
        {/* Left Column - Price, Level, and Stats */}
        <div className="space-y-6">
          {/* Meta Stats Row */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {isEditMode ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Budget:</span>
                  <Select 
                    value={editBudget.toString()} 
                    onValueChange={(value) => setEditBudget(parseFloat(value))}
                  >
                    <SelectTrigger className="w-32 h-8">
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Level:</span>
                  <Select value={editLevel} onValueChange={setEditLevel}>
                    <SelectTrigger className="w-32 h-8">
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
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">${stats.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Level: {level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Weight: {calculateTotalWeight()}</span>
                </div>
              </>
            )}
            
            {!isEditMode && (
              <Button
                onClick={handleEditPreferences}
                variant="outline"
                size="sm"
                className="ml-auto hidden lg:flex"
              >
                <Settings className="mr-2 h-4 w-4" />
                Change Preferences
              </Button>
            )}
          </div>

          {/* Stats Bars or Sliders */}
          {isEditMode ? (
            <div className="space-y-2">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  onClick={handleSavePreferences}
                  variant="default"
                  size="sm"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
              
              <StatSlider label="Speed" value={editSpeed} Icon={Gauge} onChange={setEditSpeed} />
              <StatSlider label="Spin" value={editSpin} Icon={Target} onChange={setEditSpin} />
              <StatSlider label="Control" value={editControl} Icon={Shield} onChange={setEditControl} />
              <StatSlider label="Power" value={editPower} Icon={Star} onChange={setEditPower} />
              
              {/* Advanced Button */}
              {!racket && (
                <div className="pt-4 flex justify-center">
                  <Button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {showAdvanced ? "Hide Component Preferences" : "Advanced: Component Preferences"}
                  </Button>
                </div>
              )}
              
              {/* Advanced Component-Specific Stats */}
              {showAdvanced && !racket && (
                  <div className="mt-6 space-y-6 pt-6 border-t-2 border-border">
                    {/* Forehand Rubber */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                        <span className="text-red-500">🔴</span> Forehand Rubber Preferences
                      </h4>
                      <StatSlider label="Speed" value={editForehandSpeed} Icon={Gauge} onChange={setEditForehandSpeed} />
                      <StatSlider label="Spin" value={editForehandSpin} Icon={Target} onChange={setEditForehandSpin} />
                      <StatSlider label="Control" value={editForehandControl} Icon={Shield} onChange={setEditForehandControl} />
                      <StatSlider label="Power" value={editForehandPower} Icon={Star} onChange={setEditForehandPower} />
                    </div>
                    
                    {/* Blade */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                        <span>🏓</span> Blade Preferences
                      </h4>
                      <StatSlider label="Speed" value={editBladeSpeed} Icon={Gauge} onChange={setEditBladeSpeed} />
                      <StatSlider label="Spin" value={editBladeSpin} Icon={Target} onChange={setEditBladeSpin} />
                      <StatSlider label="Control" value={editBladeControl} Icon={Shield} onChange={setEditBladeControl} />
                      <StatSlider label="Power" value={editBladePower} Icon={Star} onChange={setEditBladePower} />
                    </div>
                    
                    {/* Backhand Rubber */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                        <span className="text-blue-500">🔵</span> Backhand Rubber Preferences
                      </h4>
                      <StatSlider label="Speed" value={editBackhandSpeed} Icon={Gauge} onChange={setEditBackhandSpeed} />
                      <StatSlider label="Spin" value={editBackhandSpin} Icon={Target} onChange={setEditBackhandSpin} />
                      <StatSlider label="Control" value={editBackhandControl} Icon={Shield} onChange={setEditBackhandControl} />
                      <StatSlider label="Power" value={editBackhandPower} Icon={Star} onChange={setEditBackhandPower} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <StatBar label="Speed" value={stats.speed} Icon={Gauge} />
                <StatBar label="Spin" value={stats.spin} Icon={Target} />
                <StatBar label="Control" value={stats.control} Icon={Shield} />
                <StatBar label="Power" value={stats.power} Icon={Star} />
              </div>
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
        </div>
      </div>

    </>
  );
};

export default StatsDisplay;
