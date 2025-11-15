import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const WaitlistSection = () => {
  const handleJoinWaitlist = () => {
    window.open("https://forms.gle/7NUWdYu2aJHJh4Dr8", "_blank");
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-coral/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-headline text-3xl lg:text-5xl font-bold text-foreground">
            Join the Waitlist
          </h2>
          <p className="font-body text-lg lg:text-xl text-muted-foreground">
            Get early access to America's first zero-downtime racket service.
          </p>
          <Button
            onClick={handleJoinWaitlist}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-lg font-semibold"
          >
            Join the Waitlist
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
