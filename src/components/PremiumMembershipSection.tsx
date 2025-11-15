import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PremiumMembershipSectionProps {
  onJoinWaitlist: () => void;
}

const PremiumMembershipSection = ({ onJoinWaitlist }: PremiumMembershipSectionProps) => {
  const benefits = [
    "Unlimited rubber replacements (fair use)",
    "Two identical rackets in rotation",
    "Pro-level assembly & balancing",
    "Full access to all performance tools",
    "Priority service",
    "Free care kit & premium packaging",
    "12-month minimum term"
  ];

  return (
    <section className="py-20 lg:py-32 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Premium Membership
            </h2>
            <p className="font-body text-lg lg:text-xl text-muted-foreground">
              For advanced players who want perfect performance, every month.
            </p>
          </div>

          <div className="bg-background rounded-2xl p-8 lg:p-12 shadow-lg mb-8">
            <div className="mb-8">
              <h3 className="font-headline text-xl lg:text-2xl font-bold text-foreground mb-4">
                Experience true zero downtime:
              </h3>
              <div className="space-y-3 text-muted-foreground font-body text-base lg:text-lg">
                <p>You always have two identical rackets in rotation.</p>
                <p>When you request new rubbers, we ship you a fully assembled new racket first.</p>
                <p>Once it arrives, you send back the old one.</p>
                <p className="font-semibold text-foreground">
                  No interruptions. No warm-up period. No compromise before tournaments.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-headline text-xl lg:text-2xl font-bold text-foreground mb-6">
                Included:
              </h3>
              <div className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="font-body text-base lg:text-lg text-muted-foreground">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-8 mb-8">
              <h3 className="font-headline text-xl lg:text-2xl font-bold text-foreground mb-6">
                Pricing:
              </h3>
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div>
                  <div className="text-4xl lg:text-5xl font-bold text-foreground">
                    $1,399
                  </div>
                  <div className="text-muted-foreground font-body">per year</div>
                </div>
                <div className="text-muted-foreground font-body text-lg">or</div>
                <div>
                  <div className="text-4xl lg:text-5xl font-bold text-foreground">
                    $139
                  </div>
                  <div className="text-muted-foreground font-body">per month</div>
                </div>
              </div>
            </div>

            <Button
              onClick={onJoinWaitlist}
              size="lg"
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-lg font-semibold"
            >
              Join the Waitlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumMembershipSection;
