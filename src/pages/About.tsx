import { Shield, Award, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="About TopPaddle - 20+ Years of Table Tennis Experience"
        description="Learn about TopPaddle's mission to help players find the perfect table tennis equipment. 20+ years of experience and honest recommendations."
        canonical="https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/about"
      />
      <StructuredData
        data={{
          type: 'BreadcrumbList',
          items: [
            { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' },
            { name: 'About', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/about' }
          ]
        }}
      />
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
                Over 20 years of experience in table tennis
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
                With over 20 years of table tennis experience, our mission is simple: make 
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
                  <CardTitle className="font-headline text-xl">20+ Years Playing</CardTitle>
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
                    Honest reviews and recommendations
                  </p>
                </CardContent>
              </Card>
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
