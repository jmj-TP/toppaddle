import { Button } from "@/components/ui/button";
import { Gauge, Target, Shield, Star, Settings, Scale, SkipForward } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import { RadarComparisonChart } from "@/components/comparison/RadarComparisonChart";
import { StatSlider } from "@/components/configurator/StatSlider";
import { StatBar } from "@/components/ui/StatBar";
import { getRecommendation, findBestCustomSetups, type Inventory, type QuizAnswers } from "@/utils/ratingSystem";
import { useQuizStore } from "@/stores/quizStore";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onRequestQuotes?: () => void;
  onAddToCompare?: () => void;
  isPreassembled: boolean;
  assembleForMe: boolean;
  onAssembleChange: (value: boolean) => void;
  sealsService: boolean;
  onSealsChange: (value: boolean) => void;
  onBladeChange?: (blade: Blade) => void;
  onForehandChange?: (rubber: Rubber) => void;
  onBackhandChange?: (rubber: Rubber) => void;
  inventory: Inventory;
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
  onRequestQuotes: onAddToCart,
  onAddToCompare,
  isPreassembled,
  assembleForMe,
  onAssembleChange,
  sealsService,
  onSealsChange,
  onBladeChange,
  onForehandChange,
  onBackhandChange,
  inventory,
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

  const [radarView, setRadarView] = useState<'overall' | 'forehand' | 'blade' | 'backhand'>('overall');
  const [showValue, setShowValue] = useState(true);
  const [showWeight, setShowWeight] = useState(true);

  const quizStore = useQuizStore();

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
    if (!isPreassembled && onBladeChange && onForehandChange && onBackhandChange) {
      // Build QuizAnswers from preferences with more nuanced logic
      const avgSpeed = showAdvanced
        ? (editForehandSpeed + editBladeSpeed + editBackhandSpeed) / 3
        : editSpeed;
      const avgControl = showAdvanced
        ? (editForehandControl + editBladeControl + editBackhandControl) / 3
        : editControl;
      const avgSpin = showAdvanced
        ? (editForehandSpin + editBladeSpin + editBackhandSpin) / 3
        : editSpin;
      const avgPower = showAdvanced
        ? (editForehandPower + editBladePower + editBackhandPower) / 3
        : editPower;

      // Determine playstyle based on dominant stats
      let playstyle = 'Allround';
      if (avgSpeed > avgControl && avgSpeed > 60) {
        playstyle = 'Offensive';
      } else if (avgControl > avgSpeed && avgControl > 60) {
        playstyle = 'Defensive';
      }

      // Determine forehand style based on forehand stats
      let forehandStyle = 'Spin & topspin';
      const fhSpeed = showAdvanced ? editForehandSpeed : editSpeed;
      const fhControl = showAdvanced ? editForehandControl : editControl;
      const fhSpin = showAdvanced ? editForehandSpin : editSpin;

      if (fhSpeed > Math.max(fhControl, fhSpin) && fhSpeed > 65) {
        forehandStyle = 'Fast & aggressive';
      } else if (fhControl > Math.max(fhSpeed, fhSpin) && fhControl > 65) {
        forehandStyle = 'Calm & controlled';
      }

      // Determine backhand style based on backhand stats
      let backhandStyle = 'Spin & topspin';
      const bhSpeed = showAdvanced ? editBackhandSpeed : editSpeed;
      const bhControl = showAdvanced ? editBackhandControl : editControl;
      const bhSpin = showAdvanced ? editBackhandSpin : editSpin;

      if (bhSpeed > Math.max(bhControl, bhSpin) && bhSpeed > 65) {
        backhandStyle = 'Fast & aggressive';
      } else if (bhControl > Math.max(bhSpeed, bhSpin) && bhControl > 65) {
        backhandStyle = 'Calm & controlled';
      }

      // Determine power preference
      let powerPref = 'Balanced';
      if (avgPower > 70 || avgSpeed > 75) {
        powerPref = 'A lot of power';
      } else if (avgControl > 70) {
        powerPref = 'Control is more important';
      }

      const quizAnswers: QuizAnswers = {
        Level: editLevel,
        Playstyle: playstyle,
        Forehand: forehandStyle,
        Backhand: backhandStyle,
        Power: powerPref,
        HandlePreference: 'Shakehand',
        Grip: blade?.Blade_Grip?.[0] || 'Flared',
        WantsSpecialRubbers: 'No',
        ForehandRubberStyle: forehand?.Rubber_Style || 'Normal',
        BackhandRubberStyle: backhand?.Rubber_Style || 'Normal',
        Brand: [],
        Budget: editBudget === 999999 ? 'No limit' : `<${editBudget}$`,
        WeightPreference: editWeight < 170 ? 'Lightweight' : editWeight > 200 ? 'Heavy' : 'Medium',
        AssemblyPreference: 'Custom setup'
      };

      // Run the matching algorithm
      const customSetups = findBestCustomSetups(quizAnswers, inventory, 1);

      if (customSetups.length > 0) {
        const bestSetup = customSetups[0];
        onBladeChange(bestSetup.blade);
        onForehandChange(bestSetup.forehandRubber);
        onBackhandChange(bestSetup.backhandRubber);

        toast.success("Your setup was optimized to match your preferences.");
      } else {
        toast.error("Could not find matching setup with these preferences");
      }
    }

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

  const cycleRadarView = () => {
    const views: typeof radarView[] = ['forehand', 'blade', 'backhand', 'overall'];
    const currentIndex = views.indexOf(radarView);
    setRadarView(views[(currentIndex + 1) % views.length]);
  };

  const getRadarData = () => {
    if (radarView === 'overall') {
      return [{
        id: racket ? racket.Racket_Name : `${blade?.Blade_Name}-${forehand?.Rubber_Name}-${backhand?.Rubber_Name}`,
        name: racket ? racket.Racket_Name : "Overall setup",
        image: "",
        speed: stats.speed,
        control: stats.control,
        power: stats.power,
        spin: stats.spin,
        price: Math.round(stats.price),
        weight: racket ? 180 : (blade?.Blade_Weight || 85) + (forehand?.Rubber_Weight || 45) + (backhand?.Rubber_Weight || 45),
        level: level as "Beginner" | "Intermediate" | "Advanced",
        blade: blade?.Blade_Name,
        forehandRubber: forehand?.Rubber_Name,
        backhandRubber: backhand?.Rubber_Name
      }];
    } else if (radarView === 'forehand' && forehand) {
      return [{
        id: forehand.Rubber_Name,
        name: `FH Rubber: ${forehand.Rubber_Name}`,
        image: "",
        speed: forehand.Rubber_Speed,
        control: forehand.Rubber_Control,
        power: forehand.Rubber_Power || Math.round((forehand.Rubber_Speed + forehand.Rubber_Spin) / 2),
        spin: forehand.Rubber_Spin,
        price: forehand.Rubber_Price,
        weight: forehand.Rubber_Weight,
        level: level as "Beginner" | "Intermediate" | "Advanced"
      }];
    } else if (radarView === 'blade' && blade) {
      return [{
        id: blade.Blade_Name,
        name: `Blade: ${blade.Blade_Name}`,
        image: "",
        speed: blade.Blade_Speed,
        control: blade.Blade_Control,
        power: blade.Blade_Power || Math.round((blade.Blade_Speed + blade.Blade_Spin) / 2),
        spin: blade.Blade_Spin,
        price: blade.Blade_Price,
        weight: blade.Blade_Weight,
        level: level as "Beginner" | "Intermediate" | "Advanced"
      }];
    } else if (radarView === 'backhand' && backhand) {
      return [{
        id: backhand.Rubber_Name,
        name: `BH Rubber: ${backhand.Rubber_Name}`,
        image: "",
        speed: backhand.Rubber_Speed,
        control: backhand.Rubber_Control,
        power: backhand.Rubber_Power || Math.round((backhand.Rubber_Speed + backhand.Rubber_Spin) / 2),
        spin: backhand.Rubber_Spin,
        price: backhand.Rubber_Price,
        weight: backhand.Rubber_Weight,
        level: level as "Beginner" | "Intermediate" | "Advanced"
      }];
    }
    return [];
  };

  const getRadarSubhead = () => {
    switch (radarView) {
      case 'overall': return 'Overall';
      case 'forehand': return 'FH Rubber';
      case 'blade': return 'Blade';
      case 'backhand': return 'BH Rubber';
    }
  };

  const tooltips = {
    speed: "How fast the ball travels off your paddle",
    spin: "Ability to generate rotation on the ball",
    control: "Precision and consistency in placement",
    power: "Force and impact of your shots",
    value: "Price-to-performance ratio",
    weight: "Total weight in grams"
  };


  return (
    <div className="w-full max-w-[90vw] lg:max-w-[1200px] mx-auto space-y-[3vh] pb-[20vh] overflow-x-hidden">
      {/* Meta Info Row */}
      <div className="flex flex-wrap items-center gap-[clamp(0.5rem,3vw,1rem)] lg:gap-[clamp(0.5rem,2vw,1rem)] px-[2vw]">
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
            <div className="text-[clamp(1.25rem,6vw,2rem)] lg:text-[clamp(1.25rem,2vw,1.75rem)] font-semibold text-[hsl(var(--primary))]">
              ${stats.price.toFixed(2)}
            </div>
            <div className="h-[4vh] w-px bg-border hidden sm:block" />
            <div className="text-[clamp(0.875rem,3.5vw,0.95rem)] lg:text-[clamp(0.875rem,0.9vw,0.95rem)] text-muted-foreground">
              {level}
            </div>
            <div className="h-[4vh] w-px bg-border hidden sm:block" />
            <div className="text-[clamp(0.875rem,3.5vw,0.95rem)] lg:text-[clamp(0.875rem,0.9vw,0.95rem)] text-muted-foreground">
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

              {/* Bottom buttons for Advanced section */}
              <div className="flex gap-[2vw] pt-[2vh]">
                <Button
                  onClick={handleSavePreferences}
                  variant="default"
                  className="flex-1 rounded-xl py-[2.5vh] text-[clamp(0.875rem,3.5vw,0.9rem)] lg:text-[clamp(0.875rem,0.9vw,0.95rem)] font-semibold"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={() => setShowAdvanced(false)}
                  variant="outline"
                  className="flex-1 rounded-xl py-[2.5vh] text-[clamp(0.875rem,3.5vw,0.9rem)] lg:text-[clamp(0.875rem,0.9vw,0.95rem)]"
                >
                  Hide Advanced
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <StatBar label="Speed" value={stats.speed} icon={Gauge} tooltip={tooltips.speed} />
            <StatBar label="Spin" value={stats.spin} icon={Target} tooltip={tooltips.spin} />
            <StatBar label="Control" value={stats.control} icon={Shield} tooltip={tooltips.control} />
            <StatBar label="Power" value={stats.power} icon={Star} tooltip={tooltips.power} />
          </div>

          <div className="flex justify-center pt-[2vh]">
            <Button
              onClick={handleEditPreferences}
              variant="outline"
              size="sm"
              className="rounded-xl px-[clamp(1rem,4vw,2rem)] lg:px-[clamp(1rem,2vw,1.5rem)] py-[2vh] text-[clamp(0.875rem,3.5vw,0.9rem)] lg:text-[clamp(0.875rem,0.85vw,0.9rem)]"
            >
              <Settings className="mr-[clamp(0.25rem,1vw,0.5rem)] lg:mr-[clamp(0.25rem,0.5vw,0.5rem)] h-[clamp(1rem,4vw,1.2rem)] w-[clamp(1rem,4vw,1.2rem)] lg:h-[clamp(1rem,1.2vw,1.2rem)] lg:w-[clamp(1rem,1.2vw,1.2rem)]" />
              Change Preferences
            </Button>
          </div>

          {/* Radar Chart */}
          <div className="mt-[4vh] pt-[3vh] border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-[2vh] gap-[1vh]">
              <div className="text-center sm:text-left">
                <h3 className="text-[clamp(1.125rem,4.5vw,1.5rem)] lg:text-[clamp(1.125rem,1.2vw,1.35rem)] font-semibold text-[hsl(var(--primary))]">
                  Performance Overview
                </h3>
                <p className="text-[clamp(0.75rem,3vw,0.875rem)] lg:text-[clamp(0.75rem,0.8vw,0.85rem)] text-muted-foreground mt-[0.5vh]">
                  {getRadarSubhead()}
                </p>
              </div>
              <div className="flex items-center gap-[clamp(0.5rem,2vw,1rem)] flex-wrap justify-center">
                <Button
                  onClick={cycleRadarView}
                  variant="outline"
                  size="sm"
                  className="rounded-xl px-[clamp(0.75rem,3vw,1.5rem)] py-[1.5vh] text-[clamp(0.75rem,3vw,0.85rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)] hover:bg-accent/10"
                >
                  <SkipForward className="mr-[clamp(0.25rem,1vw,0.5rem)] h-[clamp(0.875rem,3.5vw,1rem)] w-[clamp(0.875rem,3.5vw,1rem)] lg:h-[clamp(0.875rem,1vw,1rem)] lg:w-[clamp(0.875rem,1vw,1rem)]" />
                  Next View
                </Button>
                {radarView === 'overall' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => setShowValue(!showValue)}
                          variant={showValue ? "default" : "outline"}
                          size="sm"
                          className="rounded-xl px-[clamp(0.75rem,3vw,1.5rem)] py-[1.5vh] text-[clamp(0.75rem,3vw,0.85rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)]"
                        >
                          Value
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltips.value}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {radarView === 'overall' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => setShowWeight(!showWeight)}
                          variant={showWeight ? "default" : "outline"}
                          size="sm"
                          className="rounded-xl px-[clamp(0.75rem,3vw,1.5rem)] py-[1.5vh] text-[clamp(0.75rem,3vw,0.85rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)]"
                        >
                          Weight
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltips.weight}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            <div className="transition-all duration-250 motion-reduce:transition-none">
              <RadarComparisonChart
                paddles={getRadarData()}
                includeValue={radarView === 'overall' && showValue}
                includeWeight={radarView === 'overall' && showWeight}
                hideControls={true}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsDisplay;
