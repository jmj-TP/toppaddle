import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onStartQuiz: () => void;
}

const CTASection = ({ onStartQuiz }: CTASectionProps) => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-headline text-3xl font-bold md:text-4xl mb-6">
          Ready to Find Your Perfect Racket?
        </h2>
        <p className="font-body text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Take our quick quiz and discover equipment recommendations tailored to your playing style
        </p>
        <Button
          onClick={onStartQuiz}
          size="lg"
          variant="accent"
          className="px-10 py-6 text-lg font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-[var(--shadow-accent)]"
        >
          Start the Quiz Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
