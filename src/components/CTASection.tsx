import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onStartQuiz: () => void;
}

const CTASection = ({ onStartQuiz }: CTASectionProps) => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Athletic background with asymmetric design */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-coral/10 to-transparent" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            Ready to Elevate Your Game?
          </h2>
          <p className="font-body text-xl lg:text-2xl text-primary-foreground/80 max-w-2xl mx-auto">
            Join players who are already experiencing zero-downtime performance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={onStartQuiz}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              Start the Quiz Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
