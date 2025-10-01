import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface BudgetSliderProps {
  question: string;
  onAnswer: (answer: string) => void;
}

const BudgetSlider = ({ question, onAnswer }: BudgetSliderProps) => {
  const [budgetValue, setBudgetValue] = useState(90); // Default to middle value
  const [isNoLimit, setIsNoLimit] = useState(false);

  const formatBudget = (value: number) => {
    if (value === 360) return "$360+";
    return `$${value}`;
  };

  const getBudgetLabel = (value: number) => {
    if (value < 50) return "<50$";
    if (value < 100) return "<100$";
    if (value < 160) return "<160$";
    if (value < 200) return "<200$";
    if (value < 250) return "<250$";
    if (value < 300) return "<300$";
    if (value < 360) return "<360$";
    return "361+";
  };

  const handleConfirm = () => {
    if (isNoLimit) {
      onAnswer("No limit");
    } else {
      onAnswer(getBudgetLabel(budgetValue));
    }
  };

  return (
    <Card className="p-8 shadow-lg border-2 border-primary/20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {question}
        </h2>
      </div>
      
      <div className="space-y-6">
        {!isNoLimit ? (
          <>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">
                  {formatBudget(budgetValue)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Drag the slider to set your budget
                </p>
              </div>
              
              <Slider
                value={[budgetValue]}
                onValueChange={(value) => setBudgetValue(value[0])}
                min={20}
                max={360}
                step={10}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$20</span>
                <span>$360+</span>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => setIsNoLimit(true)}
                variant="outline"
                className="w-full"
              >
                I have no budget limit
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">
                No Limit 💎
              </div>
              <p className="text-sm text-muted-foreground">
                We'll show you the best options available
              </p>
            </div>
            
            <Button
              onClick={() => setIsNoLimit(false)}
              variant="outline"
              className="w-full"
            >
              Set a budget instead
            </Button>
          </div>
        )}

        <Button
          onClick={handleConfirm}
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </Card>
  );
};

export default BudgetSlider;
