import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import tableTennisImg from "@/assets/table-tennis.png";

interface HeroSectionProps {
  onStartQuiz: () => void;
}

const HeroSection = ({ onStartQuiz }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Table Tennis Icon */}
          <div className="mb-8 animate-fade-in">
            <img 
              src={tableTennisImg} 
              alt="Table tennis paddles and ball" 
              className="w-32 h-32 md:w-40 md:h-40 mx-auto"
            />
          </div>

          {/* Headline */}
          <h1 className="font-headline text-4xl font-bold text-foreground md:text-5xl lg:text-6xl mb-6 max-w-4xl animate-fade-in">
            Find Your Perfect Paddle in One Quiz
          </h1>

          {/* Subheading */}
          <p className="font-body text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl animate-fade-in">
            Custom recommendations based on your style, skill, and budget — fast, accurate, and fun.
          </p>

          {/* CTA Button */}
          <Button
            onClick={onStartQuiz}
            size="lg"
            variant="accent"
            className="px-10 py-6 text-lg font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-[var(--shadow-accent)] animate-fade-in"
          >
            Take the Quiz
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Sub-CTA Text */}
          <p className="mt-4 text-sm text-muted-foreground animate-fade-in">
            Takes less than 2 minutes — no sign-up required.
          </p>

        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default HeroSection;
