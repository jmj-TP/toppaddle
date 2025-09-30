import { MessageSquare, Target, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: "Answer Quick Questions",
      description: "Tell us about your playing style, skill level, and preferences in just a few minutes.",
    },
    {
      icon: Target,
      title: "Get Personalized Recommendations",
      description: "Our algorithm matches you with the perfect blade and rubber combination for your game.",
    },
    {
      icon: ShoppingCart,
      title: "Buy with Confidence",
      description: "Purchase knowing you've chosen equipment that's perfectly suited to your needs.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl mb-4">
            How It Works
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Finding your perfect table tennis equipment is easy with our guided quiz
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group"
            >
              <CardContent className="p-8 text-center">
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-secondary group-hover:text-accent/20 transition-colors">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-6 inline-flex p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <step.icon className="h-10 w-10 text-accent" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="font-headline text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-body text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
