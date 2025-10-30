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
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-4 text-foreground">
            Find Your Perfect Paddle
          </h1>
          <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Crafted for every player. From beginner to pro.
          </p>
        </div>

        {/* Apple-style Help Me Choose Banner */}
        <div className="mb-12 max-w-4xl mx-auto">
          <button
            onClick={onStartQuiz}
            className="w-full group bg-card hover:bg-muted/50 border border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-center gap-4">
              <HelpCircle className="w-6 h-6 text-accent flex-shrink-0" />
              <div className="flex-1 text-center">
                <p className="text-lg font-medium text-foreground">
                  Help me choose.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Answer a few questions to find the best paddle for you.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Split Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {/* Quiz Option */}
          <div className="group relative bg-card border border-border rounded-3xl p-10 transition-all duration-300 hover:shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-accent/10 text-accent mx-auto">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h2 className="font-headline text-2xl font-semibold mb-3 text-center">
                Take the Quiz
              </h2>
              <p className="font-body text-muted-foreground text-center mb-8 leading-relaxed">
                Perfect for beginners or anyone unsure what paddle suits their style. Get personalized recommendations.
              </p>
              <Button
                onClick={onStartQuiz}
                size="lg"
                className="w-full py-6 text-base font-medium rounded-xl transition-all duration-300"
              >
                Start Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Configurator Option */}
          <div className="group relative bg-card border border-border rounded-3xl p-10 transition-all duration-300 hover:shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-primary/10 text-primary mx-auto">
                <Settings className="w-7 h-7" />
              </div>
              <h2 className="font-headline text-2xl font-semibold mb-3 text-center">
                Use Configurator
              </h2>
              <p className="font-body text-muted-foreground text-center mb-8 leading-relaxed">
                For advanced players who know their game and want full control over their equipment setup.
              </p>
              <Button
                onClick={() => navigate('/configurator')}
                size="lg"
                variant="outline"
                className="w-full py-6 text-base font-medium rounded-xl transition-all duration-300"
              >
                Open Configurator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image - Apple style clean and centered */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={tableTennisImg}
              alt="Table tennis paddle and ball"
              className="max-w-sm md:max-w-md lg:max-w-lg rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
