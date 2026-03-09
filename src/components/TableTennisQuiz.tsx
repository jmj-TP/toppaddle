import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import QuestionCard from "./QuestionCard";
import RecommendationDisplay from "./RecommendationDisplay";
import HandleSelector from "./HandleSelector";
import MediumHandsSelector from "./MediumHandsSelector";
import BrandSelector from "./BrandSelector";
import { getRecommendation, type QuizAnswers, type Inventory } from "@/utils/ratingSystem";
import { useQuizStore } from "@/stores/quizStore";
import { getInventoryAction } from "@/app/actions/inventory";
import BudgetSlider from "./BudgetSlider";

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
    question: "Do you want a pre-assembled racket from the manufacturer, or a custom setup (blade + rubbers) assembled by topPaddle?",
    options: [
      { value: "Ready-to-play racket", label: "Pre-Assembled from Manufacturer" },
      { value: "Custom setup", label: "Custom Setup (We Assemble)" },
      { value: "Not sure", label: "Not Sure" }
    ],
    key: "AssemblyPreference" as keyof QuizAnswers
  },
  {
    id: 10,
    question: "Which brands do you prefer?",
    options: [], // Will use BrandSelector component instead
    key: "Brand" as keyof QuizAnswers,
    isBrandSelector: true
  },
  {
    id: 11,
    question: "What is your total budget?",
    options: [],
    key: "Budget" as keyof QuizAnswers
  }
];

interface TableTennisQuizProps {
  onQuizStatusChange: (isActive: boolean) => void;
}

const TableTennisQuiz = ({ onQuizStatusChange }: TableTennisQuizProps) => {
  const {
    answers: storedAnswers,
    completeAnswers: storedCompleteAnswers,
    recommendation: storedRecommendation,
    isComplete: storedIsComplete,
    setAnswers: setStoredAnswers,
    setRecommendation: setStoredRecommendation,
    resetQuiz
  } = useQuizStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(storedAnswers);
  const [completeAnswers, setCompleteAnswers] = useState<QuizAnswers | null>(storedCompleteAnswers);
  const [isComplete, setIsComplete] = useState(storedIsComplete);
  const [recommendation, setRecommendation] = useState<any>(storedRecommendation);
  const [showForehandSpecial, setShowForehandSpecial] = useState(false);
  const [showBackhandSpecial, setShowBackhandSpecial] = useState(false);
  const [showHandleSelector, setShowHandleSelector] = useState(false);
  const [showMediumHandsSelector, setShowMediumHandsSelector] = useState(false);
  const [showWeightQuestion, setShowWeightQuestion] = useState(false);
  const [showBrandSelector, setShowBrandSelector] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [questionHistory, setQuestionHistory] = useState<number[]>([]);
  const [inventory, setInventory] = useState<Inventory | null>(null);

  useEffect(() => {
    getInventoryAction().then(setInventory).catch(err => console.error("Failed to fetch inventory:", err));
  }, []);

  // On mount, check if quiz is already complete and recalculate recommendation with latest scoring
  useEffect(() => {
    if (storedIsComplete && storedCompleteAnswers && inventory) {
      // Always recalculate to get latest scores with current algorithm
      const freshRecommendation = getRecommendation(storedCompleteAnswers, inventory);

      setIsComplete(true);
      setRecommendation(freshRecommendation);
      setCompleteAnswers(storedCompleteAnswers);
      setAnswers(storedCompleteAnswers);
      setStoredRecommendation(freshRecommendation, storedCompleteAnswers);
      onQuizStatusChange(true);
    }
  }, [inventory]);


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

  // Vibration question (shown only if not Beginner)
  const vibrationQuestion = {
    id: 1.1,
    question: "How much vibration do you want to feel in your handle?",
    options: [
      { value: "High Feedback", label: "High Feedback (Feel every hit)" },
      { value: "Muted/Solid", label: "Muted/Solid (Stable, stiff feel)" }
    ],
    key: "Vibration" as keyof QuizAnswers
  };

  // Distance question (shown only if not Beginner)
  const distanceQuestion = {
    id: 1.2,
    question: "Where do you stand during the majority of a rally?",
    options: [
      { value: "At the table", label: "At the table (Quick blocks, short swings)" },
      { value: "Mid-distance", label: "Mid-distance (Full looping exchanges)" }
    ],
    key: "Distance" as keyof QuizAnswers
  };

  // Advanced Forehand question (shown to Intermediate/Advanced only)
  const advancedForehandQuestion = {
    id: 3.5,
    question: <>How do you usually play with your <span className="underline">forehand</span>?</>,
    options: [
      { value: "Power Loop / Smash", label: "Power Loop / Smash", description: "Taking the ball close to the table or mid-distance with maximum speed to finish the point." },
      { value: "Heavy Topspin Opening", label: "Heavy Topspin", description: "Brushing the ball to create massive rotation, opening up angles and forcing errors." },
      { value: "Controlled Drive / Block", label: "Controlled Drive / Block", description: "Using steady, safer strokes to move the opponent and maintain the rally." },
      { value: "Defensive Chop / Push", label: "Defensive Chop / Push", description: "Prioritizing heavy backspin and safety to neutralize attacks on the forehand side." },
      { value: "Both sides the same / not sure", label: "Both sides the same / not sure", description: "I'm not sure or my forehand and backhand are similar." }
    ],
    key: "Forehand" as keyof QuizAnswers
  };

  // Advanced Backhand question (shown to Intermediate/Advanced only)
  const advancedBackhandQuestion = {
    id: 4.5,
    question: <>How do you usually play with your <span className="underline">backhand</span>?</>,
    options: [
      { value: "Offensive Drive/Punch", label: "Offensive Drive/Punch", description: "Close to the table, taking the ball on the rise with a flat trajectory to overpower the opponent." },
      { value: "Topspin Opening", label: "Topspin Opening", description: "Using significant wrist snap to create high rotation, usually against backspin or to start a loop-to-loop rally." },
      { value: "Directional Block", label: "Directional Block", description: "Using the opponent's power against them; focusing on placement and 'absorbing' the pace rather than generating it." },
      { value: "Classic Push / Chop", label: "Classic Push / Chop", description: "Prioritizing heavy backspin and safety; keeping the ball low and short to prevent the opponent from attacking." }
    ],
    key: "Backhand" as keyof QuizAnswers
  };

  // Miss tendency question (shown to all)
  const missTendencyQuestion = {
    id: 4.1,
    question: "When you miss an aggressive topspin shot, where does the ball usually go?",
    options: [
      { value: "Into the net", label: "Mostly into the net" },
      { value: "Off the end of the table", label: "Mostly off the end of the table" },
      { value: "Not sure", label: "Not sure / Mixed" }
    ],
    key: "MissTendency" as keyof QuizAnswers
  };


  const handleAnswer = (answer: string) => {
    const question =
      currentQuestion === 3.5 ? advancedForehandQuestion :
        currentQuestion === 4.5 ? advancedBackhandQuestion :
          currentQuestion === 7.5 ? forehandSpecialQuestion :
            currentQuestion === 7.6 ? backhandSpecialQuestion :
              currentQuestion === 6.5 ? handleSelectorQuestion :
                currentQuestion === 6.6 ? mediumHandsQuestion :
                  currentQuestion === 1.1 ? vibrationQuestion :
                    currentQuestion === 1.2 ? distanceQuestion :
                      currentQuestion === 4.1 ? missTendencyQuestion :
                        questions[currentQuestion];

    const newAnswers = { ...answers, [question.key]: answer };
    setAnswers(newAnswers);
    setStoredAnswers(newAnswers);

    // Add current question to history before moving forward
    setQuestionHistory([...questionHistory, currentQuestion]);

    // After Playstyle (index 1), route to Vibration if not Beginner
    if (currentQuestion === 1) {
      if (answers.Level === "Beginner" || newAnswers.Level === "Beginner") {
        // Skip Vibration and Distance for Beginners, default them
        const updatedAnswers = {
          ...newAnswers,
          Vibration: "High Feedback",
          Distance: "At the table"
        };
        setAnswers(updatedAnswers);
        setCurrentQuestion(2); // Go to Forehand
      } else {
        setCurrentQuestion(1.1); // Go to Vibration
      }
      return;
    }

    // After Vibration, go to Distance
    if (currentQuestion === 1.1) {
      setCurrentQuestion(1.2);
      return;
    }

    // After Distance, go to Advanced Forehand (Since Distance is only shown to non-beginners)
    if (currentQuestion === 1.2) {
      setCurrentQuestion(3.5);
      return;
    }

    // Check if beginner forehand is "Both sides the same / not sure"
    if (currentQuestion === 2 && answer === "Both sides the same / not sure") {
      // Set backhand to same answer and skip Beginner Backhand
      const updatedAnswers = {
        ...newAnswers,
        Backhand: answer
      };
      setAnswers(updatedAnswers);
      setCurrentQuestion(4.1); // Skip to MissTendency question
      return;
    }

    // After Beginner Forehand, go to Beginner Backhand (index 3)
    if (currentQuestion === 2) {
      setCurrentQuestion(3);
      return;
    }

    // Check if advanced forehand is "Both sides the same / not sure"
    if (currentQuestion === 3.5 && answer === "Both sides the same / not sure") {
      const updatedAnswers = {
        ...newAnswers,
        Backhand: answer
      };
      setAnswers(updatedAnswers);
      setCurrentQuestion(4.1); // Skip to MissTendency question
      return;
    }

    // After Advanced Forehand, go to Advanced Backhand
    if (currentQuestion === 3.5) {
      setCurrentQuestion(4.5);
      return;
    }

    // After Backhand (Beginner or Advanced), go to MissTendency (4.1)
    if (currentQuestion === 3 || currentQuestion === 4.5) {
      setCurrentQuestion(4.1);
      return;
    }

    // After MissTendency, go to Power (index 4)
    if (currentQuestion === 4.1) {
      setCurrentQuestion(4);
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
        setShowBrandSelector(true);
        // Initialize selectedBrands from answers if going back
        if (answers.Brand && Array.isArray(answers.Brand)) {
          setSelectedBrands(answers.Brand);
        }
        setCurrentQuestion(9); // Go to brand question (index 9)
      } else {
        // Beginners skip brand question, set default and go to budget
        const updatedAnswers = { ...newAnswers, Brand: [] }; // Empty array = all brands
        setAnswers(updatedAnswers);
        setCurrentQuestion(10); // Go to budget question (index 10)
      }
      return;
    }

    // After brand question (question 9), go to budget question (question 10)
    if (currentQuestion === 9) {
      setShowBrandSelector(false);
      setCurrentQuestion(10); // Go to budget question (index 10)
      return;
    }

    // The budget question (Question 10) completes the quiz
    if (currentQuestion === 10) {
      if (!inventory) return;
      const completeQuizAnswers = newAnswers as QuizAnswers;
      setCompleteAnswers(completeQuizAnswers);
      const rec = getRecommendation(completeQuizAnswers, inventory);
      setRecommendation(rec);
      setIsComplete(true);
      setStoredRecommendation(rec, completeQuizAnswers);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (!inventory) return;
      // Generate recommendation when quiz is complete
      const completeQuizAnswers = newAnswers as QuizAnswers;
      setCompleteAnswers(completeQuizAnswers);
      const rec = getRecommendation(completeQuizAnswers, inventory);
      setRecommendation(rec);
      setIsComplete(true);
      setStoredRecommendation(rec, completeQuizAnswers);
    }
  };

  const handleBack = () => {
    if (questionHistory.length === 0) return;

    const newHistory = [...questionHistory];
    const previousQuestion = newHistory.pop()!;
    setQuestionHistory(newHistory);

    // Reset conditional states based on where we're going back
    if (currentQuestion === 10 && previousQuestion === 9) {
      // Going back to brand selector from budget question
      setShowBrandSelector(true);
      // Restore selected brands from answers
      if (answers.Brand && Array.isArray(answers.Brand)) {
        setSelectedBrands(answers.Brand);
      }
    } else if (currentQuestion === 9) {
      setShowWeightQuestion(false);
      setShowBrandSelector(false);
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

  const handleBrandToggle = (brand: string) => {
    const allBrands = ["ANDRO", "BUTTERFLY", "JOOLA", "DHS"];

    setSelectedBrands(prev => {
      // If empty array (all brands selected), clicking a brand should deselect it
      if (prev.length === 0) {
        // Return all brands except the clicked one
        return allBrands.filter(b => b !== brand);
      }

      // If brand is in the array, remove it
      if (prev.includes(brand)) {
        const newBrands = prev.filter(b => b !== brand);
        // If removing would leave empty, return empty array (all selected)
        return newBrands;
      } else {
        // Add brand
        const newBrands = [...prev, brand];
        // If all brands are now selected, return empty array
        return newBrands.length === allBrands.length ? [] : newBrands;
      }
    });
  };

  const handleBrandContinue = () => {
    const newAnswers = { ...answers, Brand: selectedBrands };
    setAnswers(newAnswers);
    setQuestionHistory([...questionHistory, currentQuestion]);
    setShowBrandSelector(false);
    setCurrentQuestion(10); // Go to budget question
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setCompleteAnswers(null);
    setIsComplete(false);
    setRecommendation(null);
    setShowForehandSpecial(false);
    setShowBackhandSpecial(false);
    setShowHandleSelector(false);
    setShowMediumHandsSelector(false);
    setShowWeightQuestion(false);
    setShowBrandSelector(false);
    setSelectedBrands([]);
    setQuestionHistory([]);
    resetQuiz();
    onQuizStatusChange(false);
  };

  // Calculate actual number of questions answered (including current)
  const questionsAnswered = questionHistory.length + 1;

  // Calculate total expected questions based on current answers
  let totalQuestions = 11; // Base questions: all 11 main questions

  // Subtract questions that will be skipped based on current answers
  if (answers.Level === "Beginner") {
    totalQuestions -= 3; // Skip Vibration (1.1), Distance (1.2), and Brand (9)
  }

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

  if (answers.Level !== "Advanced" && answers.Level !== undefined) {
    totalQuestions -= 1; // Skip weight question
  }

  // Ensure we never show more answered than total
  const safeAnswered = Math.min(questionsAnswered, totalQuestions);
  const progress = (safeAnswered / totalQuestions) * 100;

  const handleUpdatePreferences = (newBudget: string, newBrands: string[]) => {
    if (!inventory) return;
    const updatedAnswers = {
      ...completeAnswers,
      Budget: newBudget,
      Brand: newBrands
    } as QuizAnswers;

    setCompleteAnswers(updatedAnswers);
    setAnswers(updatedAnswers);

    // Regenerate recommendations with new values
    const newRecommendation = getRecommendation(updatedAnswers, inventory);
    setRecommendation(newRecommendation);
  };

  // Quiz completion screen with recommendations
  if (isComplete && recommendation) {
    return (
      <RecommendationDisplay
        recommendation={recommendation}
        onRestart={handleRestart}
        assemblyPreference={answers.AssemblyPreference}
        playerLevel={answers.Level}
        currentAnswers={completeAnswers || undefined}
        onUpdatePreferences={handleUpdatePreferences}
        inventory={inventory}
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
        ) : showBrandSelector && currentQuestion === 9 ? (
          <Card className="p-8 backdrop-blur-sm bg-card/50 border-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Which brands do you prefer?</h2>
            <BrandSelector
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
            />
            <Button
              onClick={handleBrandContinue}
              className="w-full mt-6"
              size="lg"
            >
              Continue
            </Button>
          </Card>
        ) : currentQuestion === 10 ? (
          <BudgetSlider
            question="What is your total budget?"
            onAnswer={handleAnswer}
          />
        ) : (
          <QuestionCard
            question={
              currentQuestion === 3.5 ? advancedForehandQuestion :
                currentQuestion === 4.5 ? advancedBackhandQuestion :
                  currentQuestion === 7.5 ? forehandSpecialQuestion :
                    currentQuestion === 7.6 ? backhandSpecialQuestion :
                      currentQuestion === 1.1 ? vibrationQuestion :
                        currentQuestion === 1.2 ? distanceQuestion :
                          currentQuestion === 4.1 ? missTendencyQuestion :
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