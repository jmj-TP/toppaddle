import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TableTennisQuiz from "@/components/TableTennisQuiz";
import SEO from "@/components/SEO";

const Quiz = () => {
  const [isQuizActive, setIsQuizActive] = useState(true);

  const handleQuizStatusChange = (isActive: boolean) => {
    setIsQuizActive(isActive);
  };

  return (
    <>
      <SEO 
        title="Take the Quiz - Table Tennis Racket Recommendations"
        description="Answer questions about your playing style and preferences to get personalized table tennis paddle recommendations matched to your skill level."
        canonical="https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/quiz/start"
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="flex-1">
          <TableTennisQuiz onQuizStatusChange={handleQuizStatusChange} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Quiz;
