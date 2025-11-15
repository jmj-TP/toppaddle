import { Check } from "lucide-react";

const EssentialMembershipSection = () => {
  const benefits = [
    "Access to the Improvement Tool",
    "Full Paddle Configurator",
    "Setup Comparison Tool",
    "5% discount in the shop"
  ];

  return (
    <section className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Essential Membership
            </h2>
            <p className="font-body text-lg lg:text-xl text-muted-foreground">
              For players who want smarter improvement tools.
            </p>
          </div>

          <div className="bg-background rounded-2xl p-8 lg:p-12 shadow-lg">
            <div className="mb-8">
              <h3 className="font-headline text-xl lg:text-2xl font-bold text-foreground mb-6">
                Includes:
              </h3>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-coral flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="font-body text-base lg:text-lg text-muted-foreground">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="font-headline text-xl lg:text-2xl font-bold text-foreground mb-4">
                Price:
              </h3>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl lg:text-5xl font-bold text-foreground">
                  $9.99
                </div>
                <div className="text-muted-foreground font-body text-lg">per month</div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 font-body italic">
                This is an alternative plan — not an upsell to Premium.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EssentialMembershipSection;
