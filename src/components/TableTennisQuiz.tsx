import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import QuestionCard from "./QuestionCard";
import BudgetSlider from "./BudgetSlider";
import RecommendationDisplay from "./RecommendationDisplay";
import { getRecommendation, type QuizAnswers } from "@/utils/ratingSystem";

const questions = [
  {
    id: 1,
    question: "What is your current table tennis skill level?",
    options: [
      { value: "Beginner", label: "Beginner" },
      { value: "Intermediate", label: "Intermediate" },
      { value: "Advanced", label: "Advanced" }
    ],
    key: "Level" as keyof QuizAnswers
  },
  {
    id: 2,
    question: "How would you describe your overall playstyle?",
    options: [
      { value: "Offensive player", label: "Offensive - Attack every Ball" },
      { value: "Allround player", label: "All-Round" },
      { value: "Defensive player", label: "Defensive - Waiting for error" }
    ],
    key: "Playstyle" as keyof QuizAnswers
  },
  {
    id: 3,
    question: "How do you usually play with your forehand?",
    options: [
      { value: "Fast & aggressive", label: "Fast & Aggressive" },
      { value: "Spin & topspin", label: "I use a lot of Spin" },
      { value: "Calm & controlled", label: "Calm & Controlled" },
      { value: "Both sides the same / not sure", label: "Not Sure" }
    ],
    key: "Forehand" as keyof QuizAnswers
  },
  {
    id: 4,
    question: "How do you usually play with your backhand?",
    options: [
      { value: "Fast & aggressive", label: "Fast & Aggressive" },
      { value: "Spin & topspin", label: "I use a lot of Spin" },
      { value: "Calm & controlled", label: "Calm & Controlled" },
      { value: "Both sides the same / not sure", label: "Same as Forehand" }
    ],
    key: "Backhand" as keyof QuizAnswers
  },
  {
    id: 5,
    question: "How much power do you want in your racket?",
    options: [
      { value: "A lot of power", label: "Maximum Power" },
      { value: "Balanced", label: "Balanced" },
      { value: "Control is more important", label: "Control Focus" },
      { value: "I don't know", label: "Not Sure" }
    ],
    key: "Power" as keyof QuizAnswers
  },
  {
    id: 6,
    question: "What is your hand size?",
    options: [
      { value: "Really small", label: "Really Small" },
      { value: "Medium", label: "Medium (most players)" },
      { value: "Really big", label: "Really Big" }
    ],
    key: "HandSize" as keyof QuizAnswers
  },
  {
    id: 7,
    question: "Do you want to use special rubbers (pimples or anti-spin)?",
    options: [
      { value: "No", label: "No - Standard Rubbers" },
      { value: "Yes", label: "Yes - Special Rubbers" }
    ],
    key: "WantsSpecialRubbers" as keyof QuizAnswers
  },
  {
    id: 8,
    question: "What is your total budget for the Blade?",
    options: [
      { value: "<50$", label: "Under $50" },
      { value: "<100$", label: "Under $100" },
      { value: "<160$", label: "Under $160" },
      { value: "161+", label: "$161+" }
    ],
    key: "Budget" as keyof QuizAnswers
  },
  {
    id: 9,
    question: "What is your racket weight preference?",
    options: [
      { value: "Lightweight", label: "Lightweight" },
      { value: "Medium", label: "Medium" },
      { value: "Heavy", label: "Heavy" }
    ],
    key: "WeightPreference" as keyof QuizAnswers
  },
  {
    id: 10,
    question: "Do you want a ready-to-play racket (pre-assembled), or a custom setup (blade + separate rubbers)?",
    options: [
      { value: "Ready-to-play racket", label: "Ready-to-Play" },
      { value: "Custom setup", label: "Custom Setup" },
      { value: "Not sure", label: "Not Sure" }
    ],
    key: "AssemblyPreference" as keyof QuizAnswers
  }
];

interface TableTennisQuizProps {
  onQuizStatusChange: (isActive: boolean) => void;
}

const TableTennisQuiz = ({ onQuizStatusChange }: TableTennisQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [completeAnswers, setCompleteAnswers] = useState<QuizAnswers | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showPremiumBudget, setShowPremiumBudget] = useState(false);
  const [showForehandSpecial, setShowForehandSpecial] = useState(false);
  const [showBackhandSpecial, setShowBackhandSpecial] = useState(false);
  const [showWeightQuestion, setShowWeightQuestion] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<number[]>([]);
  const [budgetAmount, setBudgetAmount] = useState<number>(0);

  // Premium budget follow-up question
  const premiumBudgetQuestion = {
    id: 9.5,
    question: "Please select your exact budget range:",
    options: [
      { value: "<200$", label: "Under $200" },
      { value: "<250$", label: "Under $250" },
      { value: "<300$", label: "Under $300" },
      { value: "<360$", label: "Under $360" },
      { value: "No limit", label: "No Limit" }
    ],
    key: "Budget" as keyof QuizAnswers
  };

  // Forehand special rubber follow-up question
  const forehandSpecialQuestion = {
    id: 7.5,
    question: "Which rubber type for your forehand?",
    options: [
      { value: "Normal", label: "Normal" },
      { value: "Short Pimples", label: "Short Pimples" },
      { value: "Long Pimples", label: "Long Pimples" },
      { value: "Anti", label: "Anti-Spin" }
    ],
    key: "ForehandRubberStyle" as keyof QuizAnswers
  };

  // Backhand special rubber follow-up question
  const backhandSpecialQuestion = {
    id: 7.6,
    question: "Which rubber type for your backhand?",
    options: [
      { value: "Normal", label: "Normal" },
      { value: "Short Pimples", label: "Short Pimples" },
      { value: "Long Pimples", label: "Long Pimples" },
      { value: "Anti", label: "Anti-Spin" }
    ],
    key: "BackhandRubberStyle" as keyof QuizAnswers
  };


  const handleAnswer = (answer: string) => {
    const question = 
      currentQuestion === 9.5 ? premiumBudgetQuestion : 
      currentQuestion === 7.5 ? forehandSpecialQuestion :
      currentQuestion === 7.6 ? backhandSpecialQuestion :
      questions[currentQuestion];
    
    const newAnswers = { ...answers, [question.key]: answer };
    setAnswers(newAnswers);

    // Add current question to history before moving forward
    setQuestionHistory([...questionHistory, currentQuestion]);

    // If Beginner is selected, skip special rubbers and set both to Normal
    if (currentQuestion === 0 && answer === "Beginner") {
      const updatedAnswers = {
        ...newAnswers,
        ForehandRubberStyle: "Normal",
        BackhandRubberStyle: "Normal",
        WantsSpecialRubbers: "No"
      };
      setAnswers(updatedAnswers);
    }

    // Check if forehand is "Both sides the same / not sure" (question 3)
    if (currentQuestion === 2 && answer === "Both sides the same / not sure") {
      // Set backhand to same answer and skip question 4
      const updatedAnswers = {
        ...newAnswers,
        Backhand: answer
      };
      setAnswers(updatedAnswers);
      setCurrentQuestion(4); // Skip to question 5 (power question)
      return;
    }

    // Check if user is Beginner - skip special rubbers question entirely
    if (currentQuestion === 5 && answers.Level === "Beginner") {
      setCurrentQuestion(6); // Go to hand size question
      return;
    }

    // Check if user wants special rubbers at all (question 7) - only for non-beginners
    if (currentQuestion === 7 && answer === "No") {
      // Set both to Normal and skip special rubber questions
      const updatedAnswers = {
        ...newAnswers,
        ForehandRubberStyle: "Normal",
        BackhandRubberStyle: "Normal"
      };
      setAnswers(updatedAnswers);
      setCurrentQuestion(8); // Skip to budget question
      return;
    }

    // If user wants special rubbers, show forehand selection
    if (currentQuestion === 7 && answer === "Yes") {
      setShowForehandSpecial(true);
      setCurrentQuestion(7.5);
      return;
    }

    // Handle forehand special rubber follow-up
    if (currentQuestion === 7.5) {
      setShowForehandSpecial(false);
      setShowBackhandSpecial(true);
      setCurrentQuestion(7.6);
      return;
    }

    // Handle backhand special rubber follow-up
    if (currentQuestion === 7.6) {
      setShowBackhandSpecial(false);
      setCurrentQuestion(8);
      return;
    }

    // Handle budget question (question 8)
    if (currentQuestion === 8) {
      // Extract numeric budget value from new budget selector
      let budget = parseInt(answer);
      if (budget >= 10000) {
        budget = 10000; // No limit
      }
      setBudgetAmount(budget);

      // Store exact numeric budget instead of rounded brackets
      const answersWithBudget = {
        ...newAnswers,
        Budget: budget.toString()
      };

      // If budget is less than 60, skip assembly preference and set to ready-to-play
      if (budget < 60) {
        const updatedAnswers = {
          ...answersWithBudget,
          AssemblyPreference: "Ready-to-play racket",
          WeightPreference: "Medium"
        };
        setAnswers(updatedAnswers);
        
        // Complete the quiz
        const completeQuizAnswers = updatedAnswers as QuizAnswers;
        setCompleteAnswers(completeQuizAnswers);
        const rec = getRecommendation(completeQuizAnswers);
        setRecommendation(rec);
        setIsComplete(true);
        return;
      }

      // Check if user is Advanced - show weight question
      if (answers.Level === "Advanced") {
        setAnswers(answersWithBudget);
        setShowWeightQuestion(true);
        setCurrentQuestion(9); // Show weight question (index 9)
      } else {
        // Skip weight question for non-advanced players
        const updatedAnswers = {
          ...answersWithBudget,
          WeightPreference: "Medium"
        };
        setAnswers(updatedAnswers);
        setCurrentQuestion(10); // Go to assembly preference (index 10)
      }
      return;
    }

    // Handle weight question (only for advanced) - move to assembly preference
    if (currentQuestion === 9 && showWeightQuestion) {
      setShowWeightQuestion(false);
      setCurrentQuestion(10); // Go to assembly preference (index 10)
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Generate recommendation when quiz is complete
      const completeQuizAnswers = newAnswers as QuizAnswers;
      setCompleteAnswers(completeQuizAnswers);
      const rec = getRecommendation(completeQuizAnswers);
      setRecommendation(rec);
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (questionHistory.length === 0) return;
    
    const newHistory = [...questionHistory];
    const previousQuestion = newHistory.pop()!;
    setQuestionHistory(newHistory);
    
    // Reset conditional states based on where we're going back
    if (currentQuestion === 9.5) {
      setShowPremiumBudget(false);
    } else if (currentQuestion === 10) {
      setShowWeightQuestion(false);
    } else if (currentQuestion === 7.5) {
      setShowForehandSpecial(false);
    } else if (currentQuestion === 7.6) {
      setShowBackhandSpecial(false);
    }
    
    setCurrentQuestion(previousQuestion);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setCompleteAnswers(null);
    setIsComplete(false);
    setRecommendation(null);
    setShowPremiumBudget(false);
    setShowForehandSpecial(false);
    setShowBackhandSpecial(false);
    setShowWeightQuestion(false);
    setQuestionHistory([]);
    setBudgetAmount(0);
    onQuizStatusChange(false);
  };

  // Calculate progress considering all potential follow-up questions
  const totalExtraQuestions = 
    (showPremiumBudget ? 1 : 0) + 
    (showForehandSpecial ? 1 : 0) + 
    (showBackhandSpecial ? 1 : 0) +
    (showWeightQuestion ? 1 : 0);
  // Subtract 1 from base length since weight is conditional
  const baseQuestions = showWeightQuestion ? questions.length : questions.length - 1;
  const totalQuestions = baseQuestions + totalExtraQuestions;
  const currentProgress = 
    currentQuestion === 9.5 ? 9 : 
    currentQuestion === 7.5 ? 7 :
    currentQuestion === 7.6 ? 7 :
    currentQuestion >= 10 && !showWeightQuestion ? currentQuestion - 1 :
    currentQuestion;
  const progress = (currentProgress / totalQuestions) * 100;

  // Quiz completion screen with recommendations
  if (isComplete && recommendation) {
    return (
      <RecommendationDisplay 
        recommendation={recommendation} 
        onRestart={handleRestart} 
        assemblyPreference={answers.AssemblyPreference}
        budgetAmount={budgetAmount}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-soft)" }}>
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentProgress + 1} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {questionHistory.length > 0 && (
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        
        {currentQuestion === 8 ? (
          <BudgetSlider
            question="What is your total budget for the Blade?"
            onAnswer={handleAnswer}
          />
        ) : (
          <QuestionCard
            question={
              currentQuestion === 9.5 ? premiumBudgetQuestion : 
              currentQuestion === 7.5 ? forehandSpecialQuestion :
              currentQuestion === 7.6 ? backhandSpecialQuestion :
              questions[currentQuestion]
            }
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
};

export default TableTennisQuiz;