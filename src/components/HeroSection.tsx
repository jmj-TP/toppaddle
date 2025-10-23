import { Button } from "@/components/ui/button";
import { ArrowRight, Settings, HelpCircle } from "lucide-react";
import tableTennisImg from "@/assets/table-tennis.png";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onStartQuiz: () => void;
}

const HeroSection = ({ onStartQuiz }: HeroSectionProps) => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-4 top-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-fade-in">
            Find Your Perfect Table Tennis Paddle
          </h1>
          <p className="font-body text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-3xl mx-auto mb-2">
            Whether you're just starting out or fine-tuning your setup
          </p>
          <p className="font-body text-base text-accent/90 sm:text-lg max-w-2xl mx-auto mb-4 font-medium">
            ✨ Free racket assembly service included - we'll assemble your custom paddle for you!
          </p>
        </div>

        {/* Split Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Quiz Option */}
          <div className="group relative bg-card border-2 border-border hover:border-primary/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10 text-primary mx-auto group-hover:scale-110 transition-transform duration-300">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4 text-center">
                Take the Quiz
              </h2>
              <p className="font-body text-muted-foreground text-center mb-6 min-h-[3rem]">
                Perfect for beginners or anyone unsure what paddle suits their style. Get personalized recommendations in minutes.
              </p>
              <Button
                onClick={onStartQuiz}
                size="lg"
                className="w-full py-6 text-lg font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Configurator Option */}
          <div className="group relative bg-card border-2 border-border hover:border-accent/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-accent/10 text-accent mx-auto group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-8 h-8" />
              </div>
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4 text-center">
                Use Configurator
              </h2>
              <p className="font-body text-muted-foreground text-center mb-6 min-h-[3rem]">
                For advanced players who know the game and want full control over their equipment setup.
              </p>
              <Button
                onClick={() => navigate('/configurator')}
                size="lg"
                variant="accent"
                className="w-full py-6 text-lg font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Open Configurator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="mt-16 flex justify-center animate-fade-in">
          <img
            src={tableTennisImg}
            alt="Table tennis paddle and ball"
            className="max-w-xs sm:max-w-sm md:max-w-md rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
