import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Option {
  value: string;
  label: string;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
  key: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  return (
    <Card className="p-8 shadow-lg border-2 border-primary/20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {question.question}
        </h2>
      </div>
      
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswer(option.value)}
            variant="outline"
            className="w-full p-6 h-auto text-left justify-start border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm">
                {index + 1}
              </div>
              <span className="text-foreground font-medium">
                {option.label}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuestionCard;