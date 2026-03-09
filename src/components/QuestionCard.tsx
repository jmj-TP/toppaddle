import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface Question {
  id: number;
  question: string | React.ReactNode;
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
          <div
            key={index}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAnswer(option.value);
              }
            }}
            onClick={() => onAnswer(option.value)}
            className="cursor-pointer group relative overflow-hidden flex-1 p-6 h-auto text-left justify-start border-2 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-border hover:border-primary/50 hover:bg-primary/5"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary">
                <span className="text-xl font-bold">{index + 1}</span>
              </div>
              <span className="text-foreground font-medium text-center">
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-muted-foreground text-center mt-2 px-2">
                  {option.description}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuestionCard;