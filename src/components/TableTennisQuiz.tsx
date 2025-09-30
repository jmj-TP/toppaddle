import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import QuestionCard from "./QuestionCard";
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
      { value: "Offensive player", label: "Offensive" },
      { value: "Allround player", label: "All-Round" },
      { value: "Defensive player", label: "Defensive" }
    ],
    key: "Playstyle" as keyof QuizAnswers
  },
  {
    id: 3,
    question: "How do you usually play with your forehand?",
    options: [
      { value: "Fast & aggressive", label: "Fast & Aggressive" },
      { value: "Spin & topspin", label: "Spin & Topspin" },
      { value: "Calm & controlled", label: "Calm & Controlled" },
      { value: "Both sides the same / not sure", label: "Same as Backhand" }
    ],
    key: "Forehand" as keyof QuizAnswers
  },
  {
    id: 4,
    question: "How do you usually play with your backhand?",
    options: [
      { value: "Fast & aggressive", label: "Fast & Aggressive" },
      { value: "Spin & topspin", label: "Spin & Topspin" },
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
    question: "Which handle type do you prefer?",
    options: [
      { value: "Normal", label: "Standard Handle" },
      { value: "Special", label: "Specific Handle Type" }
    ],
    key: "HandlePreference" as keyof QuizAnswers
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
    question: "What is your total budget for Blade + Rubbers or a Pre-Assembled Racket?",
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
    question: "Do you want a ready-to-play racket (pre-assembled), or do you want a custom setup (blade + separate rubbers)?",
    options: [
      { value: "Ready-to-play racket", label: "Ready-to-Play" },
      { value: "Custom setup", label: "Custom Setup" },
      { value: "Not sure", label: "Not Sure" }
    ],
    key: "AssemblyPreference" as keyof QuizAnswers
  }
];

const TableTennisQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [completeAnswers, setCompleteAnswers] = useState<QuizAnswers | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showPremiumBudget, setShowPremiumBudget] = useState(false);
  const [showForehandSpecial, setShowForehandSpecial] = useState(false);
  const [showBackhandSpecial, setShowBackhandSpecial] = useState(false);
  const [showHandleSpecial, setShowHandleSpecial] = useState(false);
  const [showWeightQuestion, setShowWeightQuestion] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<number[]>([]);

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
      { value: "Normal", label: "Normal Inverted" },
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
      { value: "Normal", label: "Normal Inverted" },
      { value: "Short Pimples", label: "Short Pimples" },
      { value: "Long Pimples", label: "Long Pimples" },
      { value: "Anti", label: "Anti-Spin" }
    ],
    key: "BackhandRubberStyle" as keyof QuizAnswers
  };

  // Handle type follow-up question
  const handleSpecialQuestion = {
    id: 6.5,
    question: "Which specific handle type do you prefer?",
    options: [
      { value: "Not sure", label: "Not Sure" },
      { value: "Classic Shakehand", label: "Classic Shakehand" },
      { value: "Shakehand Flared", label: "Shakehand Flared" },
      { value: "Shakehand Straight", label: "Shakehand Straight" },
      { value: "Penhold", label: "Penhold" }
    ],
    key: "Grip" as keyof QuizAnswers
  };

  const handleAnswer = (answer: string) => {
    const question = 
      currentQuestion === 9.5 ? premiumBudgetQuestion : 
      currentQuestion === 7.5 ? forehandSpecialQuestion :
      currentQuestion === 7.6 ? backhandSpecialQuestion :
      currentQuestion === 6.5 ? handleSpecialQuestion :
      questions[currentQuestion];
    
    const newAnswers = { ...answers, [question.key]: answer };
    setAnswers(newAnswers);

    // Add current question to history before moving forward
    setQuestionHistory([...questionHistory, currentQuestion]);

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

    // Check if user wants normal handle (question 6)
    if (currentQuestion === 5 && answer === "Normal") {
      // Set grip to "Not sure" and skip handle detail question
      const updatedAnswers = {
        ...newAnswers,
        Grip: "Not sure"
      };
      setAnswers(updatedAnswers);
      setCurrentQuestion(6); // Skip to special rubbers question
      return;
    }

    // If user wants special handle, show handle selection
    if (currentQuestion === 5 && answer === "Special") {
      setShowHandleSpecial(true);
      setCurrentQuestion(6.5);
      return;
    }

    // Handle special handle follow-up
    if (currentQuestion === 6.5) {
      setShowHandleSpecial(false);
      setCurrentQuestion(6);
      return;
    }

    // Check if user wants special rubbers at all (question 7)
    if (currentQuestion === 6 && answer === "No") {
      // Set both to Normal and skip special rubber questions
      const updatedAnswers = {
        ...newAnswers,
        ForehandRubberStyle: "Normal",
        BackhandRubberStyle: "Normal"
      };
      setAnswers(updatedAnswers);
      setCurrentQuestion(7); // Skip to budget question
      return;
    }

    // If user wants special rubbers, show forehand selection
    if (currentQuestion === 6 && answer === "Yes") {
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
      setCurrentQuestion(7);
      return;
    }

    // Check if user selected "161+" on budget question (now question 8)
    if (currentQuestion === 7 && answer === "161+") {
      setShowPremiumBudget(true);
      setCurrentQuestion(9.5);
      return;
    }

    // Handle premium budget follow-up
    if (currentQuestion === 9.5) {
      setShowPremiumBudget(false);
      setCurrentQuestion(8);
      return;
    }

    // Check if user is Advanced after budget question - show weight question
    if (currentQuestion === 8 && answers.Level === "Advanced") {
      setShowWeightQuestion(true);
      setCurrentQuestion(9);
      return;
    }

    // If not advanced, skip weight question and set default
    if (currentQuestion === 8 && answers.Level !== "Advanced") {
      const updatedAnswers = {
        ...newAnswers,
        WeightPreference: "Medium"
      };
      setAnswers(updatedAnswers);
      setCurrentQuestion(10); // Skip to assembly preference
      return;
    }

    // Handle weight question (only for advanced)
    if (currentQuestion === 9) {
      setShowWeightQuestion(false);
      setCurrentQuestion(10);
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
    } else if (currentQuestion === 9) {
      setShowWeightQuestion(false);
    } else if (currentQuestion === 7.5) {
      setShowForehandSpecial(false);
    } else if (currentQuestion === 7.6) {
      setShowBackhandSpecial(false);
    } else if (currentQuestion === 6.5) {
      setShowHandleSpecial(false);
    }
    
    setCurrentQuestion(previousQuestion);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setCompleteAnswers(null);
    setIsComplete(false);
    setHasStarted(false);
    setRecommendation(null);
    setShowPremiumBudget(false);
    setShowForehandSpecial(false);
    setShowBackhandSpecial(false);
    setShowHandleSpecial(false);
    setShowWeightQuestion(false);
    setQuestionHistory([]);
  };

  // Calculate progress considering all potential follow-up questions
  const totalExtraQuestions = 
    (showPremiumBudget ? 1 : 0) + 
    (showForehandSpecial ? 1 : 0) + 
    (showBackhandSpecial ? 1 : 0) +
    (showHandleSpecial ? 1 : 0) +
    (showWeightQuestion ? 1 : 0);
  // Subtract 1 from base length since weight is conditional
  const baseQuestions = showWeightQuestion ? questions.length : questions.length - 1;
  const totalQuestions = baseQuestions + totalExtraQuestions;
  const currentProgress = 
    currentQuestion === 9.5 ? 9 : 
    currentQuestion === 7.5 ? 7 :
    currentQuestion === 7.6 ? 7 :
    currentQuestion === 6.5 ? 6 :
    currentQuestion >= 9 && !showWeightQuestion ? currentQuestion - 1 :
    currentQuestion;
  const progress = (currentProgress / totalQuestions) * 100;

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-soft)" }}>
        <Card className="w-full max-w-2xl p-8 text-center border-border" style={{ boxShadow: "var(--shadow-xl)" }}>
          <div className="mb-6">
            <div className="text-6xl mb-4">🏓</div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Table Tennis Quiz Assistant
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Find your perfect table tennis racket with our interactive quiz!
            </p>
            <div className="bg-secondary p-6 rounded-lg mb-8">
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
            variant="accent"
            className="px-8 py-3 text-lg font-semibold"
          >
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  // Quiz completion screen with recommendations
  if (isComplete && recommendation) {
    return (
      <RecommendationDisplay 
        recommendation={recommendation} 
        onRestart={handleRestart} 
        assemblyPreference={answers.AssemblyPreference}
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
        
        <QuestionCard
          question={
            currentQuestion === 9.5 ? premiumBudgetQuestion : 
            currentQuestion === 7.5 ? forehandSpecialQuestion :
            currentQuestion === 7.6 ? backhandSpecialQuestion :
            currentQuestion === 6.5 ? handleSpecialQuestion :
            questions[currentQuestion]
          }
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default TableTennisQuiz;