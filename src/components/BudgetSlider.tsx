import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface BudgetSliderProps {
  question: string;
  onAnswer: (answer: string) => void;
}

const BudgetSlider = ({ question, onAnswer }: BudgetSliderProps) => {
  const [budget, setBudget] = useState<number>(100);

  const handleConfirm = () => {
    const finalBudget = budget >= 360 ? "No limit" : `<${budget}$`;
    onAnswer(finalBudget);
  };

  const displayBudget = budget >= 360 ? "No limit" : `Under $${budget}`;

  return (
    <Card className="p-8 shadow-lg border-2 border-primary/20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">
          {question}
        </h2>
        <p className="text-muted-foreground text-sm">
          Drag the slider to set your maximum budget
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="text-4xl font-bold text-primary">
            {displayBudget}
          </div>
        </div>

        <Slider
          value={[budget]}
          onValueChange={(value) => setBudget(value[0])}
          min={30}
          max={360}
          step={5}
          className="w-full"
        />

        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>$30</span>
          <span>No limit</span>
        </div>
      </div>

      <Button
        onClick={handleConfirm}
        className="w-full"
        size="lg"
      >
        Continue with {displayBudget}
      </Button>
    </Card>
  );
};

export default BudgetSlider;
