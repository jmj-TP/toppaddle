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
        title="Table Tennis Racket Quiz | Find Your Perfect Paddle"
        description="Take our interactive quiz to find the perfect table tennis racket for your skill level and playing style. Get personalized recommendations in minutes."
        canonical="https://yourdomain.com/quiz"
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
