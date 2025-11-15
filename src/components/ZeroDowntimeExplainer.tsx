const ZeroDowntimeExplainer = () => {
  const steps = [
    "You request new rubbers.",
    "We immediately build and ship you a fresh racket.",
    "You keep training and competing with no break.",
    "When the new racket arrives, you send the old one back."
  ];

  return (
    <section className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-3xl lg:text-5xl font-bold text-center mb-16">
            How Zero-Downtime Works
          </h2>

          <div className="space-y-8 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent">
                  <span className="text-2xl font-bold text-accent">{index + 1}</span>
                </div>
                <p className="font-body text-lg lg:text-xl text-primary-foreground/90 pt-2">
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center space-y-3 pt-8">
            <p className="font-headline text-xl lg:text-2xl font-bold">
              Perfect before tournaments. Perfect for serious players.
            </p>
            <p className="font-headline text-xl lg:text-2xl font-bold text-accent">
              Always fresh. Always ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZeroDowntimeExplainer;
