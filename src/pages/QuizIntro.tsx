import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuizStore } from "@/stores/quizStore";

const QuizIntro = () => {
  const navigate = useNavigate();
  const { isComplete } = useQuizStore();

  // If quiz is complete, redirect to the quiz page to show recommendations
  useEffect(() => {
    if (isComplete) {
      navigate("/quiz/start", { replace: true });
    }
  }, [isComplete, navigate]);

  const handleStartQuiz = () => {
    navigate("/quiz/start");
  };

  return (
    <>
      <SEO 
        title="Table Tennis Equipment Quiz - Find Your Perfect Racket"
        description="Take our expert table tennis quiz to discover the perfect paddle for your playing style. Get personalized racket recommendations based on your skill level, budget, and preferences in just minutes."
        canonical="https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/quiz"
      />
      <StructuredData
        data={{
          type: 'BreadcrumbList',
          items: [
            { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' },
            { name: 'Quiz', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/quiz' }
          ]
        }}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl text-center">
              <h1 className="font-headline text-4xl font-bold text-foreground md:text-5xl lg:text-6xl mb-6">
                Find Your Perfect Table Tennis Racket
              </h1>
              <p className="font-body text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Answer a few quick questions about your playing style, skill level, and preferences. 
                Our expert algorithm will recommend the ideal paddle setup tailored specifically for you.
              </p>
              <Button 
                onClick={handleStartQuiz}
                size="lg"
                className="text-lg px-8 py-6 h-auto"
              >
                Start Quiz Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>

          <HowItWorks />

          {/* CTA Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl mb-6">
                Ready to Find Your Perfect Match?
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-8">
                Join thousands of players who've found their ideal equipment through our quiz
              </p>
              <Button 
                onClick={handleStartQuiz}
                size="lg"
                className="text-lg px-8 py-6 h-auto"
              >
                Take the Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default QuizIntro;
