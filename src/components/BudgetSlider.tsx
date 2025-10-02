import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BudgetSliderProps {
  question: string;
  onAnswer: (answer: string) => void;
}

const BudgetSlider = ({ question, onAnswer }: BudgetSliderProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<"Budget" | "Medium" | "Higher" | null>(null);

  const handleCategorySelect = (selectedCategory: "Budget" | "Medium" | "Higher") => {
    setCategory(selectedCategory);
    setStep(2);
  };

  const handleBudgetSelect = (budget: string) => {
    // Convert budget string to number for storage
    let budgetValue: number;
    if (budget === "No Limit") {
      budgetValue = 999999;
    } else {
      // Extract number from "< $XX" format
      budgetValue = parseInt(budget.replace(/[<$\s]/g, ""));
    }
    onAnswer(budgetValue.toString());
  };

  const handleBack = () => {
    setStep(1);
    setCategory(null);
  };

  const getBudgetOptions = () => {
    if (category === "Budget") {
      return ["< $30", "< $50", "< $70", "< $90"];
    } else if (category === "Medium") {
      return ["< $100", "< $120", "< $140", "< $160"];
    } else if (category === "Higher") {
      return ["< $180", "< $200", "< $250", "< $300", "No Limit"];
    }
    return [];
  };

  return (
    <Card className="p-8 shadow-lg border-2 border-primary/20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">
          {question}
        </h2>
        <p className="text-muted-foreground text-sm">
          {step === 1 ? "Choose your budget category" : "Select your maximum budget"}
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          {["Budget", "Medium", "Higher"].map((cat, index) => (
            <Button
              key={cat}
              onClick={() => handleCategorySelect(cat as "Budget" | "Medium" | "Higher")}
              variant="outline"
              className="w-full p-6 h-auto text-left justify-start border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-foreground font-medium text-lg">{cat}</span>
              </div>
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="mb-2"
          >
            ← Back to categories
          </Button>
          <div className="space-y-4">
            {getBudgetOptions().map((budget, index) => (
              <Button
                key={budget}
                onClick={() => handleBudgetSelect(budget)}
                variant="outline"
                className="w-full p-6 h-auto text-left justify-start border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-foreground font-medium text-lg">{budget}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default BudgetSlider;
