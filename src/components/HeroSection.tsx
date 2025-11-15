import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import tableTennisImg from "@/assets/table-tennis.png";

interface HeroSectionProps {
  onStartQuiz: () => void;
}

const HeroSection = ({ onStartQuiz }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[100svh] flex items-center bg-background overflow-hidden">
      {/* Subtle motion streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent transform rotate-12 blur-sm" />
        <div className="absolute bottom-1/3 left-0 w-[500px] h-[2px] bg-gradient-to-r from-transparent via-coral/20 to-transparent transform -rotate-6 blur-sm" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Content - 8 columns on mobile, asymmetric on desktop */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] text-foreground">
                A Smarter Way to Play{" "}
                <span className="inline-block bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                  Table Tennis.
                </span>
              </h1>
              <p className="font-body text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                America's first zero-downtime racket service with pro-grade performance tools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                <a 
                  href="https://forms.gle/7NUWdYu2aJHJh4Dr8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Join the Waitlist
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              
              <Button
                onClick={onStartQuiz}
                size="lg"
                variant="outline"
                className="border-2 border-primary/20 hover:border-accent hover:bg-accent/5 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
              >
                Take the Quiz
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Zero Downtime Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Pro-Grade Equipment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>US-Based Support</span>
              </div>
            </div>
          </div>

          {/* Right Image - Premium paddle silhouette */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              {/* Spotlight effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-coral/10 rounded-3xl blur-3xl" />
              
              {/* Image container */}
              <div className="relative">
                <img
                  src={tableTennisImg}
                  alt="Professional table tennis paddle"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
