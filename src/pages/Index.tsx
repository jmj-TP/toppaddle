import { useState, useRef, useEffect } from "react";
import TableTennisQuiz from "@/components/TableTennisQuiz";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import TrustSection from "@/components/TrustSection";
import BlogPreview from "@/components/BlogPreview";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartQuiz = () => {
    // Scroll to top first
    window.scrollTo(0, 0);
    setIsQuizActive(true);
    // Scroll to quiz after a brief delay to ensure state updates
    setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const faqs = [
    {
      question: "How do I choose the right table tennis paddle?",
      answer: "The best paddle depends on your skill level, playing style, and budget. Beginners should focus on control and consistency, while advanced players may prefer faster, spin-oriented setups. Our quiz analyzes your preferences and recommends the perfect match."
    },
    {
      question: "What's the difference between pre-assembled and custom rackets?",
      answer: "Pre-assembled rackets are ready to play and great for beginners to intermediate players. Custom rackets let you choose your blade and rubbers separately, offering more control over speed, spin, and feel - ideal for advanced players who know their preferences."
    },
    {
      question: "How much should I spend on a table tennis paddle?",
      answer: "Beginners can find quality paddles for $30-$80. Intermediate players typically invest $80-$150, while advanced players often spend $150-$300+ on custom setups with professional-grade components."
    },
    {
      question: "What are the key stats: Speed, Spin, and Control?",
      answer: "Speed determines how fast the ball travels. Spin affects how much rotation you can generate for topspin and serves. Control measures how predictable and forgiving the paddle is. Beginners need more control, while advanced players balance all three based on their style."
    },
    {
      question: "How often should I replace my rubbers?",
      answer: "Rubbers typically last 3-6 months with regular play. You'll notice reduced grip and spin when it's time to replace them. Proper cleaning after each session can extend their lifespan."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="What Table Tennis Paddle is Best for You - Find Your Perfect Racket"
        description="Find your perfect table tennis racket with our expert quiz. 8 years of experience helping players choose the right equipment for their playing style."
        canonical="https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/"
      />
      <StructuredData
        data={[
          {
            type: 'Organization',
            name: 'TopPaddle',
            url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com',
            logo: 'https://storage.googleapis.com/gpt-engineer-file-uploads/HtwUMVNMZVQjq52lMqV5sBqHUkh2/uploads/1760547998664-TopPaddleProfile.png',
          },
          {
            type: 'BreadcrumbList',
            items: [
              { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' }
            ]
          }
        ]}
      />
      <Header />
      <main className="flex-1">
        {!isQuizActive && (
          <>
            <HeroSection onStartQuiz={handleStartQuiz} />
            <HowItWorks />
            <CTASection onStartQuiz={handleStartQuiz} />
            <TrustSection />
            <FAQSection faqs={faqs} />
            <BlogPreview />
          </>
        )}
        {isQuizActive && (
          <div ref={quizRef}>
            <TableTennisQuiz onQuizStatusChange={setIsQuizActive} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
