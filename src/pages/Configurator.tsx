import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlotMachine from "@/components/configurator/SlotMachine";
import StatsDisplay, { type UserPreferences } from "@/components/configurator/StatsDisplay";
import { Button } from "@/components/ui/button";
import { blades, rubbers, preAssembledRackets } from "@/data/products";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";

const Configurator = () => {
  const [searchParams] = useSearchParams();
  const [isPreassembled, setIsPreassembled] = useState(false);
  
  // State for custom mode
  const [selectedBlade, setSelectedBlade] = useState<Blade>(blades[0]);
  const [selectedForehand, setSelectedForehand] = useState<Rubber>(rubbers[0]);
  const [selectedBackhand, setSelectedBackhand] = useState<Rubber>(rubbers[1]);
  
  // State for preassembled mode
  const [selectedRacket, setSelectedRacket] = useState<PreAssembledRacket>(preAssembledRackets[0]);
  
  // Filters
  const [selectedGrip, setSelectedGrip] = useState<string>("ST");
  const [selectedForehandThickness, setSelectedForehandThickness] = useState<string>("2.0mm");
  const [selectedBackhandThickness, setSelectedBackhandThickness] = useState<string>("2.0mm");
  
  // Spin trigger for random reroll
  const [spinTrigger, setSpinTrigger] = useState(0);

  // Load preselected items from quiz results
  useEffect(() => {
    const bladeParam = searchParams.get("blade");
    const fhParam = searchParams.get("fh");
    const bhParam = searchParams.get("bh");
    const racketParam = searchParams.get("racket");
    
    if (racketParam) {
      const racket = preAssembledRackets.find(r => r.Racket_Name === racketParam);
      if (racket) {
        setIsPreassembled(true);
        setSelectedRacket(racket);
      }
    } else if (bladeParam || fhParam || bhParam) {
      const blade = blades.find(b => b.Blade_Name === bladeParam) || blades[0];
      const fh = rubbers.find(r => r.Rubber_Name === fhParam) || rubbers[0];
      const bh = rubbers.find(r => r.Rubber_Name === bhParam) || rubbers[1];
      
      setSelectedBlade(blade);
      setSelectedForehand(fh);
      setSelectedBackhand(bh);
    }
  }, [searchParams]);

  const handleRandomReroll = () => {
    setSpinTrigger(prev => prev + 1);
  };

  const handlePreferencesChange = (preferences: UserPreferences) => {
    // Find best matching products based on preferences
    if (isPreassembled) {
      // Find best matching preassembled racket
      const matchingRackets = preAssembledRackets
        .filter(racket => racket.Racket_Price <= preferences.budget)
        .map(racket => {
          const scoreDiff = 
            Math.abs(racket.Racket_Speed - preferences.speed) +
            Math.abs(racket.Racket_Spin - preferences.spin) +
            Math.abs(racket.Racket_Control - preferences.control) +
            Math.abs((racket.Racket_Speed + racket.Racket_Spin) / 2 - preferences.power);
          return { racket, scoreDiff };
        })
        .sort((a, b) => a.scoreDiff - b.scoreDiff);

      if (matchingRackets.length > 0) {
        const bestMatch = matchingRackets.find(r => r.racket.Racket_Level === preferences.level);
        setSelectedRacket(bestMatch ? bestMatch.racket : matchingRackets[0].racket);
      }
    } else {
      // Find best matching blade + rubbers
      const matchingBlades = blades
        .filter(blade => {
          const estimatedPrice = blade.Blade_Price + 40; // estimate rubber cost
          return estimatedPrice <= preferences.budget && blade.Blade_Level === preferences.level;
        })
        .map(blade => {
          const scoreDiff = 
            Math.abs(blade.Blade_Speed - preferences.speed) +
            Math.abs(blade.Blade_Spin - preferences.spin) +
            Math.abs(blade.Blade_Control - preferences.control);
          return { blade, scoreDiff };
        })
        .sort((a, b) => a.scoreDiff - b.scoreDiff);

      const matchingForehandRubbers = rubbers
        .filter(rubber => {
          const estimatedPrice = (matchingBlades[0]?.blade.Blade_Price || 0) + rubber.Rubber_Price + 20;
          return estimatedPrice <= preferences.budget;
        })
        .map(rubber => {
          const scoreDiff = 
            Math.abs(rubber.Rubber_Speed - preferences.speed) +
            Math.abs(rubber.Rubber_Spin - preferences.spin) +
            Math.abs(rubber.Rubber_Control - preferences.control);
          return { rubber, scoreDiff };
        })
        .sort((a, b) => a.scoreDiff - b.scoreDiff);

      const matchingBackhandRubbers = rubbers
        .filter(rubber => {
          const estimatedPrice = (matchingBlades[0]?.blade.Blade_Price || 0) + 
            (matchingForehandRubbers[0]?.rubber.Rubber_Price || 0) + rubber.Rubber_Price;
          return estimatedPrice <= preferences.budget;
        })
        .map(rubber => {
          const scoreDiff = 
            Math.abs(rubber.Rubber_Speed - preferences.speed) +
            Math.abs(rubber.Rubber_Spin - preferences.spin) +
            Math.abs(rubber.Rubber_Control - preferences.control);
          return { rubber, scoreDiff };
        })
        .sort((a, b) => a.scoreDiff - b.scoreDiff);

      if (matchingBlades.length > 0) {
        setSelectedBlade(matchingBlades[0].blade);
      }
      if (matchingForehandRubbers.length > 0) {
        setSelectedForehand(matchingForehandRubbers[0].rubber);
      }
      if (matchingBackhandRubbers.length > 0) {
        setSelectedBackhand(matchingBackhandRubbers[0].rubber);
      }
    }
  };

  const calculateCustomStats = () => {
    const speed = Math.round((selectedBlade.Blade_Speed + selectedForehand.Rubber_Speed + selectedBackhand.Rubber_Speed) / 3);
    const spin = Math.round((selectedBlade.Blade_Spin + selectedForehand.Rubber_Spin + selectedBackhand.Rubber_Spin) / 3);
    const control = Math.round((selectedBlade.Blade_Control + selectedForehand.Rubber_Control + selectedBackhand.Rubber_Control) / 3);
    const power = Math.round((speed + spin) / 2);
    const totalPrice = selectedBlade.Blade_Price + selectedForehand.Rubber_Price + selectedBackhand.Rubber_Price;
    
    return { speed, spin, control, power, price: totalPrice };
  };

  const stats = isPreassembled 
    ? {
        speed: selectedRacket.Racket_Speed,
        spin: selectedRacket.Racket_Spin,
        control: selectedRacket.Racket_Control,
        power: Math.round((selectedRacket.Racket_Speed + selectedRacket.Racket_Spin) / 2),
        price: selectedRacket.Racket_Price
      }
    : calculateCustomStats();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8 relative">
            <div className="absolute left-0 top-0 flex gap-2">
              <Button
                onClick={() => setIsPreassembled(false)}
                variant={!isPreassembled ? "default" : "outline"}
                className="rounded-full px-6 py-2"
              >
                Custom
              </Button>
              <Button
                onClick={() => setIsPreassembled(true)}
                variant={isPreassembled ? "default" : "outline"}
                className="rounded-full px-6 py-2"
              >
                Preassembled
              </Button>
            </div>
            <h1 className="text-6xl font-bold text-foreground text-center">
              Configurator
            </h1>
          </div>

          {/* Slot Machine and Stats - Single Container */}
          <div className="max-w-7xl mx-auto">
            <SlotMachine
              isPreassembled={isPreassembled}
              selectedBlade={selectedBlade}
              selectedForehand={selectedForehand}
              selectedBackhand={selectedBackhand}
              selectedRacket={selectedRacket}
              onBladeChange={setSelectedBlade}
              onForehandChange={setSelectedForehand}
              onBackhandChange={setSelectedBackhand}
              onRacketChange={setSelectedRacket}
              spinTrigger={spinTrigger}
              selectedGrip={selectedGrip}
              selectedForehandThickness={selectedForehandThickness}
              selectedBackhandThickness={selectedBackhandThickness}
              onGripChange={setSelectedGrip}
              onForehandThicknessChange={setSelectedForehandThickness}
              onBackhandThicknessChange={setSelectedBackhandThickness}
            />

            {/* Stats Display Below Slots */}
            <div className="mt-8">
              <StatsDisplay
                stats={stats}
                level={isPreassembled ? selectedRacket.Racket_Level : selectedBlade.Blade_Level}
                blade={isPreassembled ? null : selectedBlade}
                forehand={isPreassembled ? null : selectedForehand}
                backhand={isPreassembled ? null : selectedBackhand}
                racket={isPreassembled ? selectedRacket : null}
                onRandomReroll={handleRandomReroll}
                onPreferencesChange={handlePreferencesChange}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Configurator;
