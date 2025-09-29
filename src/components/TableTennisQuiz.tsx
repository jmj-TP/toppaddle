import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "./QuestionCard";
import RecommendationDisplay from "./RecommendationDisplay";
import { getRecommendation, type QuizAnswers } from "@/utils/ratingSystem";

const questions = [
  {
    id: 1,
    question: "What is your current table tennis skill level?",
    options: [
      { value: "Beginner", label: "Beginner (just starting out or learning basics)" },
      { value: "Intermediate", label: "Intermediate (comfortable with basic techniques)" },
      { value: "Advanced", label: "Advanced (experienced player with refined skills)" }
    ],
    key: "Level" as keyof QuizAnswers
  },
  {
    id: 2,
    question: "How would you describe your overall playstyle?",
    options: [
      { value: "Offensive player", label: "Offensive player (I love fast smashes and powerful topspin)" },
      { value: "Allround player", label: "Allround player (I mix attack and control)" },
      { value: "Defensive player", label: "Defensive player (I focus on control and placement)" }
    ],
    key: "Playstyle" as keyof QuizAnswers
  },
  {
    id: 3,
    question: "How do you usually play with your forehand?",
    options: [
      { value: "Fast & aggressive", label: "Fast & aggressive" },
      { value: "Spin & topspin", label: "Spin & topspin" },
      { value: "Calm & controlled", label: "Calm & controlled" },
      { value: "Both sides the same / not sure", label: "Both sides the same / not sure" }
    ],
    key: "Forehand" as keyof QuizAnswers
  },
  {
    id: 4,
    question: "How do you usually play with your backhand?",
    options: [
      { value: "Fast & aggressive", label: "Fast & aggressive" },
      { value: "Spin & topspin", label: "Spin & topspin" },
      { value: "Calm & controlled", label: "Calm & controlled" },
      { value: "Both sides the same / not sure", label: "Both sides the same / not sure" }
    ],
    key: "Backhand" as keyof QuizAnswers
  },
  {
    id: 5,
    question: "How much power do you want in your racket?",
    options: [
      { value: "A lot of power", label: "A lot of power (fast, strong shots)" },
      { value: "Balanced", label: "Balanced (a mix of speed and control)" },
      { value: "Control is more important", label: "Control is more important than power" },
      { value: "I don't know", label: "I don't know / doesn't matter" }
    ],
    key: "Power" as keyof QuizAnswers
  },
  {
    id: 6,
    question: "Which handle type do you prefer?",
    options: [
      { value: "Classic Shakehand", label: "Classic Shakehand (simple & universal)" },
      { value: "Shakehand Flared", label: "Shakehand Flared (more grip, very popular)" },
      { value: "Shakehand Straight", label: "Shakehand Straight (precise control)" },
      { value: "Penhold", label: "Penhold (like holding a pen, offensive style)" },
      { value: "Not sure", label: "Not sure / whatever is comfortable" }
    ],
    key: "Grip" as keyof QuizAnswers
  },
  {
    id: 7,
    question: "What is your total budget for Blade + Rubbers or a Pre-Assembled Racket?",
    options: [
      { value: "Under 50 USD", label: "Under 50 USD" },
      { value: "50–100 USD", label: "50–100 USD" },
      { value: "100–150 USD", label: "100–150 USD" },
      { value: "Over 150 USD", label: "Over 150 USD" }
    ],
    key: "Budget" as keyof QuizAnswers
  },
  {
    id: 8,
    question: "Do you want a ready-to-play racket (pre-assembled), or do you want a custom setup (blade + separate rubbers)?",
    options: [
      { value: "Ready-to-play racket", label: "Ready-to-play racket (perfect for beginners, no gluing needed)" },
      { value: "Custom setup", label: "Custom setup (separate blade and rubbers)" },
      { value: "Not sure", label: "Not sure → default to ready-to-play racket" }
    ],
    key: "AssemblyPreference" as keyof QuizAnswers
  }
];

const TableTennisQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestion];
    const newAnswers = { ...answers, [question.key]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Generate recommendation when quiz is complete
      const rec = getRecommendation(newAnswers as QuizAnswers);
      setRecommendation(rec);
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setHasStarted(false);
    setRecommendation(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-soft)" }}>
        <Card className="w-full max-w-2xl p-8 text-center shadow-lg border-2 border-primary/20">
          <div className="mb-6">
            <div className="text-6xl mb-4">🏓</div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Table Tennis Quiz Assistant
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Find your perfect table tennis racket with our interactive quiz!
            </p>
            <div className="bg-secondary/50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-primary mb-3">What you'll discover:</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Your ideal playstyle match</li>
                <li>• Perfect grip and power level</li>
                <li>• Budget-friendly recommendations</li>
                <li>• Custom vs ready-to-play options</li>
              </ul>
            </div>
          </div>
          <Button 
            onClick={() => setHasStarted(true)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  // Quiz completion screen with recommendations
  if (isComplete && recommendation) {
    return <RecommendationDisplay recommendation={recommendation} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-soft)" }}>
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
        
        <QuestionCard
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default TableTennisQuiz;