import { Shield, Award, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-headline text-4xl font-bold md:text-5xl">
                About TopPaddle
              </h1>
              <p className="font-body mt-6 text-lg text-primary-foreground/90">
                Helping table tennis players find their perfect equipment since 2017
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-headline text-3xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="font-body mt-6 text-lg leading-relaxed text-muted-foreground">
                With 8 years of table tennis experience, our mission is simple: make 
                it easy for every player, from beginner to advanced, to find the perfect racket 
                that matches their playing style and skill level.
              </p>
              <p className="font-body mt-4 text-lg leading-relaxed text-muted-foreground">
                We understand that choosing the right equipment can be overwhelming. That's why 
                we created this intelligent quiz system that considers your experience, playing 
                style, and preferences to recommend the best options for you.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-xl">8 Years Playing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-sm text-muted-foreground">
                    Years of table tennis experience
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-xl">Thousands Helped</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-sm text-muted-foreground">
                    Players trust our recommendations
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-xl">Personalized Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-sm text-muted-foreground">
                    Tailored to your unique playing style
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Shield className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-xl">Transparent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-sm text-muted-foreground">
                    Clear affiliate disclosure and honest reviews
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Affiliate Transparency */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-8">
              <div className="flex items-start space-x-4">
                <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="font-headline text-xl font-semibold text-foreground">
                    Our Commitment to Transparency
                  </h3>
                  <p className="font-body mt-4 text-muted-foreground">
                    We participate in affiliate programs, which means we may earn a small 
                    commission when you purchase through our links. However, this never 
                    influences our recommendations. We only suggest products we genuinely 
                    believe will benefit your game.
                  </p>
                  <p className="font-body mt-4 text-muted-foreground">
                    Your trust is our priority. Every recommendation is based on real 
                    experience, thorough research, and honest assessment of equipment quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl font-bold">
              Ready to Find Your Perfect Racket?
            </h2>
            <p className="font-body mt-4 text-lg text-primary-foreground/90">
              Take our quiz and get personalized recommendations in minutes
            </p>
            <Link to="/">
              <Button
                variant="accent"
                size="lg"
                className="mt-8 font-body shadow-[var(--shadow-accent)]"
              >
                Start the Quiz
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
