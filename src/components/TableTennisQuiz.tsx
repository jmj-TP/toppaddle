import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import QuestionCard from "./QuestionCard";
import RecommendationDisplay from "./RecommendationDisplay";
import HandleSelector from "./HandleSelector";
import MediumHandsSelector from "./MediumHandsSelector";
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
    question: <>How do you usually play with your <span className="underline">forehand</span>?</>,
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
    question: <>How do you usually play with your <span className="underline">backhand</span>?</>,
    options: [
      { value: "Fast & aggressive", label: "Fast & Aggressive" },
      { value: "Spin & topspin", label: "I use a lot of Spin" },
      { value: "Calm & controlled", label: "Calm & Controlled" },
      
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
    question: "Do you want a special handle type?",
    options: [
      { value: "No", label: "No - Normal Handle" },
      { value: "Yes", label: "Yes - Special Handle" }
    ],
    key: "WantsSpecialHandle" as keyof QuizAnswers
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
    question: "What is your racket weight preference?",
    options: [
      { value: "Lightweight", label: "Lightweight" },
      { value: "Medium", label: "Medium" },
      { value: "Heavy", label: "Heavy" }
    ],
    key: "WeightPreference" as keyof QuizAnswers
  },
  {
    id: 9,
    question: "Do you want a ready-to-play racket (pre-assembled), or a custom setup (blade + rubbers)?",
    options: [
      { value: "Ready-to-play racket", label: "Ready-to-Play" },
      { value: "Custom setup", label: "Custom Setup" },
      { value: "Not sure", label: "Not Sure" }
    ],
    key: "AssemblyPreference" as keyof QuizAnswers
  },
  {
    id: 10,
    question: "Which brand do you prefer?",
    options: [
      { value: "All Brands", label: "All Brands" },
      { value: "ANDRO", label: "ANDRO" },
      { value: "BUTTERFLY", label: "BUTTERFLY" },
      { value: "JOOLA", label: "JOOLA" },
      { value: "DHS", label: "DHS" }
    ],
    key: "Brand" as keyof QuizAnswers
  },
  {
    id: 11,
    question: "What is your total budget?",
    options: [
      { value: "<50$", label: "Under $50" },
      { value: "<100$", label: "Under $100" },
      { value: "<120$", label: "Under $120" },
      { value: "<140$", label: "Under $140" },
      { value: "more", label: "More Options" }
    ],
    key: "Budget" as keyof QuizAnswers
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
  const [showHandleSelector, setShowHandleSelector] = useState(false);
  const [showMediumHandsSelector, setShowMediumHandsSelector] = useState(false);
  const [showWeightQuestion, setShowWeightQuestion] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<number[]>([]);

  // More budget options follow-up question
  const moreBudgetQuestion = {
    id: 11.5,
    question: "Please select your exact budget range:",
    options: [
      { value: "<160$", label: "Under $160" },
      { value: "<180$", label: "Under $180" },
      { value: "<200$", label: "Under $200" },
      { value: "<250$", label: "Under $250" },
      { value: "<300$", label: "Under $300" },
      { value: "No limit", label: "No Limit" }
    ],
    key: "Budget" as keyof QuizAnswers
  };

  // Forehand special rubber follow-up question
  const forehandSpecialQuestion = {
    id: 7.5,
    question: <>Which rubber type for your <span className="underline">forehand</span>?</>,
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
    question: <>Which rubber type for your <span className="underline">backhand</span>?</>,
    options: [
      { value: "Normal", label: "Normal Inverted" },
      { value: "Short Pimples", label: "Short Pimples" },
      { value: "Long Pimples", label: "Long Pimples" },
      { value: "Anti", label: "Anti-Spin" }
    ],
    key: "BackhandRubberStyle" as keyof QuizAnswers
  };

  // Handle selector follow-up (shown when user wants special handle)
  const handleSelectorQuestion = {
    id: 6.5,
    question: "What is your hand size?",
    options: [],
    key: "HandSize" as keyof QuizAnswers,
    isHandleSelector: true
  };

  // Medium hands selector follow-up
  const mediumHandsQuestion = {
    id: 6.6,
    question: "Which handle shape do you prefer?",
    options: [],
    key: "Grip" as keyof QuizAnswers,
    isMediumHandsSelector: true
  };


  const handleAnswer = (answer: string) => {
    const question = 
      currentQuestion === 11.5 ? moreBudgetQuestion : 
      currentQuestion === 7.5 ? forehandSpecialQuestion :
      currentQuestion === 7.6 ? backhandSpecialQuestion :
      currentQuestion === 6.5 ? handleSelectorQuestion :
      currentQuestion === 6.6 ? mediumHandsQuestion :
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

    // Check if user wants special handle (question 6)
    if (currentQuestion === 5 && answer === "No") {
      // Set default handle and skip handle selector
      const updatedAnswers = {
        ...newAnswers,
        Grip: "Shakehand Flared"
      };
      setAnswers(updatedAnswers);
      setCurrentQuestion(6); // Go to special rubbers question
      return;
    }

    // If user wants special handle, show handle selector
    if (currentQuestion === 5 && answer === "Yes") {
      setShowHandleSelector(true);
      setCurrentQuestion(6.5);
      return;
    }

    // Handle selector follow-up - route based on hand size
    if (currentQuestion === 6.5) {
      setShowHandleSelector(false);
      
      if (answer === "Small Hands Special") {
        // Really small hands - set grip and move to special rubbers
        const updatedAnswers = { ...newAnswers, Grip: "Small Hands Special" };
        setAnswers(updatedAnswers);
        setCurrentQuestion(6); // Go to special rubbers question
      } else if (answer === "Anatomic") {
        // Really large hands - set grip and move to special rubbers
        const updatedAnswers = { ...newAnswers, Grip: "Anatomic" };
        setAnswers(updatedAnswers);
        setCurrentQuestion(6); // Go to special rubbers question
      } else if (answer === "Medium Hands") {
        // Medium hands - show flared vs straight selector
        setShowMediumHandsSelector(true);
        setCurrentQuestion(6.6);
      }
      return;
    }

    // Medium hands selector follow-up - move to special rubbers
    if (currentQuestion === 6.6) {
      setShowMediumHandsSelector(false);
      setCurrentQuestion(6); // Go to special rubbers question
      return;
    }

    // Check if user wants special rubbers at all (question 6)
    if (currentQuestion === 6 && answer === "No") {
      // Set both to Normal and skip special rubber questions
      const updatedAnswers = {
        ...newAnswers,
        ForehandRubberStyle: "Normal",
        BackhandRubberStyle: "Normal"
      };
      setAnswers(updatedAnswers);
      // Go to weight question (index 7) if Advanced, otherwise skip to assembly (index 8)
      if (answers.Level === "Advanced") {
        setShowWeightQuestion(true);
        setCurrentQuestion(7);
      } else {
        setAnswers({ ...updatedAnswers, WeightPreference: "Medium" });
        setCurrentQuestion(8);
      }
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
      // Go to weight question (index 7) if Advanced, otherwise skip to assembly (index 8)
      if (answers.Level === "Advanced") {
        setShowWeightQuestion(true);
        setCurrentQuestion(7);
      } else {
        const updatedAnswers = { ...newAnswers, WeightPreference: "Medium" };
        setAnswers(updatedAnswers);
        setCurrentQuestion(8);
      }
      return;
    }

    // Handle weight question (only for advanced) - move to assembly preference
    if (currentQuestion === 7 && showWeightQuestion) {
      setShowWeightQuestion(false);
      setCurrentQuestion(8); // Go to assembly preference (index 8)
      return;
    }

    // After assembly preference (question 8), go to brand or budget
    if (currentQuestion === 8) {
      // Show brand question only for Intermediate and Advanced
      if (answers.Level === "Intermediate" || answers.Level === "Advanced") {
        setCurrentQuestion(9); // Go to brand question (index 9)
      } else {
        // Beginners skip brand question, set default and go to budget
        const updatedAnswers = { ...newAnswers, Brand: "All Brands" };
        setAnswers(updatedAnswers);
        setCurrentQuestion(10); // Go to budget question (index 10)
      }
      return;
    }

    // After brand question (question 9), go to budget question (question 10)
    if (currentQuestion === 9) {
      setCurrentQuestion(10); // Go to budget question (index 10)
      return;
    }

    // Check if user selected "more" on budget question (now question 10)
    if (currentQuestion === 10 && answer === "more") {
      setShowPremiumBudget(true);
      setCurrentQuestion(11.5);
      return;
    }

    // Handle more budget options follow-up - this completes the quiz
    if (currentQuestion === 11.5) {
      setShowPremiumBudget(false);
      // Generate recommendation when quiz is complete
      const completeQuizAnswers = newAnswers as QuizAnswers;
      setCompleteAnswers(completeQuizAnswers);
      const rec = getRecommendation(completeQuizAnswers);
      setRecommendation(rec);
      setIsComplete(true);
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
    if (currentQuestion === 11.5) {
      setShowPremiumBudget(false);
    } else if (currentQuestion === 9) {
      setShowWeightQuestion(false);
    } else if (currentQuestion === 7.5) {
      setShowForehandSpecial(false);
    } else if (currentQuestion === 7.6) {
      setShowBackhandSpecial(false);
    } else if (currentQuestion === 6.5) {
      setShowHandleSelector(false);
    } else if (currentQuestion === 6.6) {
      setShowMediumHandsSelector(false);
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
    setShowHandleSelector(false);
    setShowMediumHandsSelector(false);
    setShowWeightQuestion(false);
    setQuestionHistory([]);
    onQuizStatusChange(false);
  };

  // Calculate actual number of questions answered (including current)
  const questionsAnswered = questionHistory.length + 1;
  
  // Calculate total expected questions based on current answers
  let totalQuestions = 11; // Base questions: all 11 main questions
  
  // Subtract questions that will be skipped based on current answers
  if (answers.Forehand === "Both sides the same / not sure") {
    totalQuestions -= 1; // Skip backhand question
  }
  
  if ("WantsSpecialHandle" in answers) {
    if (answers.WantsSpecialHandle === "Yes") {
      totalQuestions += 1; // Add handle selector question
      // Add one more if medium hands is selected
      if ("HandSize" in answers && answers.HandSize === "Medium Hands") {
        totalQuestions += 1;
      }
    }
  }
  
  if ("WantsSpecialRubbers" in answers) {
    if (answers.WantsSpecialRubbers === "Yes") {
      totalQuestions += 2; // Add forehand and backhand rubber style questions
    }
  }
  
  if (answers.Level === "Beginner") {
    totalQuestions -= 1; // Skip brand question
  }
  
  if (answers.Level !== "Advanced" && answers.Level !== undefined) {
    totalQuestions -= 1; // Skip weight question
  }
  
  if (answers.Budget === "more") {
    totalQuestions += 1; // Add premium budget question
  }
  
  // Ensure we never show more answered than total
  const safeAnswered = Math.min(questionsAnswered, totalQuestions);
  const progress = (safeAnswered / totalQuestions) * 100;

  // Quiz completion screen with recommendations
  if (isComplete && recommendation) {
    return (
      <RecommendationDisplay 
        recommendation={recommendation} 
        onRestart={handleRestart} 
        assemblyPreference={answers.AssemblyPreference}
        playerLevel={answers.Level}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-soft)" }}>
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {safeAnswered} of {totalQuestions}
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
        
        {currentQuestion === 6.5 ? (
          <Card className="p-8 backdrop-blur-sm bg-card/50 border-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">What is your hand size?</h2>
            <HandleSelector onSelect={handleAnswer} />
          </Card>
        ) : currentQuestion === 6.6 ? (
          <Card className="p-8 backdrop-blur-sm bg-card/50 border-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Which handle shape do you prefer?</h2>
            <MediumHandsSelector onSelect={handleAnswer} />
          </Card>
        ) : (
          <QuestionCard
            question={
              currentQuestion === 11.5 ? moreBudgetQuestion : 
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