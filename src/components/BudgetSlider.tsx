import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface BudgetSliderProps {
  question: string;
  onAnswer: (answer: string) => void;
}

const budgetOptions = [
  { value: 50, label: "Under $50", description: "Entry level" },
  { value: 100, label: "Under $100", description: "Good quality" },
  { value: 160, label: "Under $160", description: "Premium" },
  { value: 200, label: "Under $200", description: "High-end" },
  { value: 250, label: "Under $250", description: "Professional" },
  { value: 300, label: "Under $300", description: "Expert" },
  { value: 360, label: "Under $360", description: "Top tier" },
  { value: 10000, label: "No Limit", description: "Best available" },
];

const BudgetSlider = ({ question, onAnswer }: BudgetSliderProps) => {
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setSelectedBudget(value);
  };

  const handleConfirm = () => {
    if (selectedBudget !== null) {
      onAnswer(selectedBudget.toString());
    }
  };

  return (
    <Card className="p-8 shadow-lg border-2 border-primary/20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">
          {question}
        </h2>
        <p className="text-muted-foreground text-sm">
          Select your maximum budget for a complete setup
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {budgetOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              selectedBudget === option.value
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border hover:border-primary/50 hover:bg-accent/5"
            }`}
          >
            {selectedBudget === option.value && (
              <div className="absolute top-2 right-2">
                <Check className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className="font-semibold text-sm mb-1">{option.label}</div>
            <div className="text-xs text-muted-foreground">{option.description}</div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleConfirm}
        disabled={selectedBudget === null}
        className="w-full"
        size="lg"
      >
        Continue with {selectedBudget === 10000 ? "No Limit" : `$${selectedBudget}`}
      </Button>
    </Card>
  );
};

export default BudgetSlider;
