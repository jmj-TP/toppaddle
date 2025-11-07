import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Gauge, Target, Shield, Star, Settings, DollarSign, Scale, Wrench, GitCompare, ShoppingCart } from "lucide-react";
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
  weight?: number;
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
  const [editWeight, setEditWeight] = useState<number>(200);
  
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
        weight: editWeight,
      };
      
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
    <div className="py-[1.5vh] px-[2vw] bg-muted/30 rounded-xl">
      <div className="flex items-center gap-[1vw] mb-[1vh]">
        <Icon className="w-[4vw] h-[4vw] lg:w-[1.2vw] lg:h-[1.2vw] text-muted-foreground flex-shrink-0" />
        <span className="text-[3.5vw] lg:text-[0.9vw] font-medium text-foreground">{label}</span>
        <span className="text-[3.5vw] lg:text-[0.9vw] font-semibold text-accent ml-auto">{value}</span>
      </div>
      <div className="h-[0.4vh] bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[90vw] lg:max-w-[1200px] mx-auto space-y-[3vh] pb-[20vh]">
      {/* Meta Info Row */}
      <div className="flex flex-wrap items-center gap-[3vw] lg:gap-[2vw] px-[2vw]">
        {isEditMode ? (
          <>
            <div className="flex items-center gap-[2vw]">
              <span className="text-[3.5vw] lg:text-[0.9vw] font-medium text-muted-foreground">Budget</span>
              <Select 
                value={editBudget.toString()} 
                onValueChange={(value) => setEditBudget(parseFloat(value))}
              >
                <SelectTrigger className="w-[25vw] lg:w-[10vw] h-[5vh] lg:h-[4vh] rounded-xl text-[3.5vw] lg:text-[0.9vw]">
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
            <div className="flex items-center gap-[2vw]">
              <span className="text-[3.5vw] lg:text-[0.9vw] font-medium text-muted-foreground">Level</span>
              <Select value={editLevel} onValueChange={setEditLevel}>
                <SelectTrigger className="w-[25vw] lg:w-[10vw] h-[5vh] lg:h-[4vh] rounded-xl text-[3.5vw] lg:text-[0.9vw]">
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
            <div className="text-[6vw] lg:text-[2vw] font-semibold text-foreground">
              ${stats.price.toFixed(2)}
            </div>
            <div className="h-[4vh] w-px bg-border hidden sm:block" />
            <div className="text-[3.5vw] lg:text-[0.9vw] text-muted-foreground">
              {level}
            </div>
            <div className="h-[4vh] w-px bg-border hidden sm:block" />
            <div className="text-[3.5vw] lg:text-[0.9vw] text-muted-foreground">
              {calculateTotalWeight()}
            </div>
          </>
        )}
      </div>

      {/* Stats Bars or Sliders */}
      {isEditMode ? (
        <div className="space-y-[1.5vh]">
          <StatSlider label="Speed" value={editSpeed} icon={Gauge} onChange={setEditSpeed} />
          <StatSlider label="Spin" value={editSpin} icon={Target} onChange={setEditSpin} />
          <StatSlider label="Control" value={editControl} icon={Shield} onChange={setEditControl} />
          <StatSlider label="Power" value={editPower} icon={Star} onChange={setEditPower} />
          
          <StatSlider 
            label="Weight" 
            value={editWeight} 
            icon={Scale} 
            onChange={setEditWeight}
            description="Preferred total weight in grams. Lighter for speed, heavier for power."
            showValue={true}
          />
          
          <div className="flex gap-[2vw] pt-[2vh]">
            <Button
              onClick={handleSavePreferences}
              variant="default"
              className="flex-1 rounded-xl py-[2.5vh] text-[3.5vw] lg:text-[0.9vw] font-semibold"
            >
              Save Preferences
            </Button>
            {!racket && (
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                variant="outline"
                className="flex-1 rounded-xl py-[2.5vh] text-[3.5vw] lg:text-[0.9vw]"
              >
                <Settings className="w-[4vw] h-[4vw] lg:w-[1.2vw] lg:h-[1.2vw] mr-[1vw] lg:mr-[0.5vw]" />
                {showAdvanced ? "Hide Advanced" : "Advanced"}
              </Button>
            )}
          </div>
          
          {showAdvanced && !racket && (
            <div className="mt-[2vh] space-y-[2vh] pt-[2vh] border-t border-border">
              <div className="space-y-[1vh]">
                <h4 className="text-[3.5vw] lg:text-[0.95vw] font-semibold text-foreground mb-[1.5vh]">
                  🔴 Forehand Rubber
                </h4>
                <StatSlider label="Speed" value={editForehandSpeed} icon={Gauge} onChange={setEditForehandSpeed} />
                <StatSlider label="Spin" value={editForehandSpin} icon={Target} onChange={setEditForehandSpin} />
                <StatSlider label="Control" value={editForehandControl} icon={Shield} onChange={setEditForehandControl} />
                <StatSlider label="Power" value={editForehandPower} icon={Star} onChange={setEditForehandPower} />
              </div>
              
              <div className="space-y-[1vh]">
                <h4 className="text-[3.5vw] lg:text-[0.95vw] font-semibold text-foreground mb-[1.5vh]">
                  🏓 Blade
                </h4>
                <StatSlider label="Speed" value={editBladeSpeed} icon={Gauge} onChange={setEditBladeSpeed} />
                <StatSlider label="Spin" value={editBladeSpin} icon={Target} onChange={setEditBladeSpin} />
                <StatSlider label="Control" value={editBladeControl} icon={Shield} onChange={setEditBladeControl} />
                <StatSlider label="Power" value={editBladePower} icon={Star} onChange={setEditBladePower} />
              </div>
              
              <div className="space-y-[1vh]">
                <h4 className="text-[3.5vw] lg:text-[0.95vw] font-semibold text-foreground mb-[1.5vh]">
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
          <div className="grid grid-cols-2 gap-[2vw] lg:gap-[1.5vw]">
            <StatBar label="Speed" value={stats.speed} Icon={Gauge} />
            <StatBar label="Spin" value={stats.spin} Icon={Target} />
            <StatBar label="Control" value={stats.control} Icon={Shield} />
            <StatBar label="Power" value={stats.power} Icon={Star} />
          </div>
          
          <div className="flex justify-center pt-[2vh]">
            <Button
              onClick={handleEditPreferences}
              variant="outline"
              size="sm"
              className="rounded-xl px-[4vw] lg:px-[2vw] py-[2vh] text-[3.5vw] lg:text-[0.85vw]"
            >
              <Settings className="mr-[1vw] lg:mr-[0.5vw] h-[4vw] w-[4vw] lg:h-[1.2vw] lg:w-[1.2vw]" />
              Change Preferences
            </Button>
          </div>
            
          {/* Radar Chart */}
          <div className="mt-[4vh] pt-[3vh] border-t border-border">
            <h3 className="text-[4.5vw] lg:text-[1.2vw] font-semibold mb-[2vh] text-center">Performance Overview</h3>
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
  );
};

export default StatsDisplay;
