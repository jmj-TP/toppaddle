import { useState, useRef } from "react";
import TableTennisQuiz from "@/components/TableTennisQuiz";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import TrustSection from "@/components/TrustSection";
import BlogPreview from "@/components/BlogPreview";

const Index = () => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);

  const handleStartQuiz = () => {
    setIsQuizActive(true);
    // Scroll to quiz after a brief delay to ensure state updates
    setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {!isQuizActive && (
          <>
            <HeroSection onStartQuiz={handleStartQuiz} />
            <HowItWorks />
            <CTASection onStartQuiz={handleStartQuiz} />
            <TrustSection />
            <BlogPreview />
          </>
        )}
        <div ref={quizRef}>
          <TableTennisQuiz onQuizStatusChange={setIsQuizActive} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
