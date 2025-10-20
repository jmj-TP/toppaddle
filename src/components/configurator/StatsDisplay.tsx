import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Gauge, Target, Shield, Star, Settings } from "lucide-react";
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
  const [editBudget, setEditBudget] = useState<number>(250);
  const [editLevel, setEditLevel] = useState(level);
  const [editSpeed, setEditSpeed] = useState(stats.speed);
  const [editSpin, setEditSpin] = useState(stats.spin);
  const [editControl, setEditControl] = useState(stats.control);
  const [editPower, setEditPower] = useState(stats.power);
  const handleSavePreferences = () => {
    if (onPreferencesChange) {
      onPreferencesChange({
        budget: editBudget,
        level: editLevel,
        speed: editSpeed,
        spin: editSpin,
        control: editControl,
        power: editPower,
      });
    }
    setIsEditMode(false);
  };

  const StatBar = ({ label, value, Icon }: { label: string; value: number; Icon: any }) => (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
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
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <span className="text-sm font-medium min-w-[60px]">{label}:</span>
      <div className="flex-1">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      <span className="text-sm font-semibold min-w-[30px]">{value}</span>
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
          {/* Price, Level, and Change Preferences Button Row */}
          <div className="flex items-center gap-4">
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
                <div className="h-6 w-px bg-border" />
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
                <div>
                  <span className="text-xl font-bold text-foreground">Price: ${stats.price.toFixed(2)}</span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div>
                  <span className="text-xl font-bold text-foreground">Level: {level}</span>
                </div>
              </>
            )}
            <Button
              onClick={isEditMode ? handleSavePreferences : () => setIsEditMode(true)}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isEditMode ? "Save Preferences" : "Change Preferences"}
            </Button>
          </div>

          {/* Stats Bars or Sliders */}
          <div className="space-y-2">
            {isEditMode ? (
              <>
                <StatSlider label="Speed" value={editSpeed} Icon={Gauge} onChange={setEditSpeed} />
                <StatSlider label="Spin" value={editSpin} Icon={Target} onChange={setEditSpin} />
                <StatSlider label="Control" value={editControl} Icon={Shield} onChange={setEditControl} />
                <StatSlider label="Power" value={editPower} Icon={Star} onChange={setEditPower} />
              </>
            ) : (
              <>
                <StatBar label="Speed" value={stats.speed} Icon={Gauge} />
                <StatBar label="Spin" value={stats.spin} Icon={Target} />
                <StatBar label="Control" value={stats.control} Icon={Shield} />
                <StatBar label="Power" value={stats.power} Icon={Star} />
              </>
            )}
          </div>
        </div>

        {/* Right Column - Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleBuyClick}
            size="lg"
            className="w-full text-xl py-8 font-bold shadow-lg hover:shadow-xl transition-all bg-orange-500 hover:bg-orange-600 text-white border-4 border-black rounded-2xl"
          >
            Add to cart
          </Button>
          <Button
            onClick={onRandomReroll}
            size="lg"
            className="w-full text-xl py-8 font-bold shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 text-white border-4 border-black rounded-2xl"
          >
            Random Reroll
          </Button>
        </div>
      </div>

      {/* Component Details Below */}
      <div className="mt-12">
        {!racket && blade && forehand && backhand && (
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-primary mb-3">Components</h3>
            
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">🏓 Blade</p>
                  <p className="font-medium text-foreground">{blade.Blade_Name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(blade.Blade_Affiliate_Link, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">🔴 Forehand</p>
                  <p className="font-medium text-foreground">{forehand.Rubber_Name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(forehand.Rubber_Affiliate_Link, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">🔵 Backhand</p>
                  <p className="font-medium text-foreground">{backhand.Rubber_Name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(backhand.Rubber_Affiliate_Link, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default StatsDisplay;
