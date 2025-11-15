import { Zap, Wrench, Award } from "lucide-react";

const ValuePropositionSection = () => {
  const values = [
    {
      icon: Zap,
      title: "Zero-Downtime Racket Service",
      description: "Play uninterrupted, year-round, with always-ready equipment."
    },
    {
      icon: Wrench,
      title: "Pro-Grade Equipment Tools",
      description: "Use the Quiz, Configurator, and Comparison Tool to optimize your perfect setup."
    },
    {
      icon: Award,
      title: "US-Based Pro Assembly",
      description: "Every racket is professionally assembled, balanced, and tournament-ready."
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:gap-16 md:grid-cols-3 max-w-7xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="text-center md:text-left space-y-4">
                <div className="inline-flex p-4 rounded-full bg-accent/10 mb-2">
                  <Icon className="h-8 w-8 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="font-headline text-2xl lg:text-3xl font-bold text-foreground">
                  {value.title}
                </h3>
                <p className="font-body text-base lg:text-lg text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
