import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import TrustSection from "@/components/TrustSection";
import BlogPreview from "@/components/BlogPreview";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Zap, Shield, Award, ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  const faqs = [
    {
      question: "How do I choose the right table tennis paddle?",
      answer: "The best paddle depends on your skill level, playing style, and budget. Beginners should focus on control and consistency, while advanced players may prefer faster, spin-oriented setups. Our quiz analyzes your preferences and recommends the perfect match."
    },
    {
      question: "What's the difference between pre-assembled and custom rackets?",
      answer: "Pre-assembled rackets are ready to play and great for beginners to intermediate players. Custom rackets let you choose your blade and rubbers separately, offering more control over speed, spin, and feel - ideal for advanced players who know their preferences."
    },
    {
      question: "How much should I spend on a table tennis paddle?",
      answer: "Beginners can find quality paddles for $30-$80. Intermediate players typically invest $80-$150, while advanced players often spend $150-$300+ on custom setups with professional-grade components."
    },
    {
      question: "What are the key stats: Speed, Spin, and Control?",
      answer: "Speed determines how fast the ball travels. Spin affects how much rotation you can generate for topspin and serves. Control measures how predictable and forgiving the paddle is. Beginners need more control, while advanced players balance all three based on their style."
    },
    {
      question: "How often should I replace my rubbers?",
      answer: "Rubbers typically last 3-6 months with regular play. You'll notice reduced grip and spin when it's time to replace them. Proper cleaning after each session can extend their lifespan."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Find Your Perfect Table Tennis Paddle | TopPaddle"
        description="Discover your ideal table tennis racket with our expert quiz and configurator. 8 years of experience helping players of all levels find their perfect equipment."
        canonical="https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/"
      />
      <StructuredData
        data={[
          {
            type: 'Organization',
            name: 'TopPaddle',
            url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com',
            logo: 'https://storage.googleapis.com/gpt-engineer-file-uploads/HtwUMVNMZVQjq52lMqV5sBqHUkh2/uploads/1760547998664-TopPaddleProfile.png',
          },
          {
            type: 'BreadcrumbList',
            items: [
              { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' }
            ]
          }
        ]}
      />
      <Header />
      <main className="flex-1">
        {/* Pre-launch Banner */}
        <div className="bg-gradient-to-r from-primary via-secondary to-accent border-b-2 border-primary/20">
          <div className="container mx-auto px-4 py-3">
            <p className="text-center text-sm text-white font-medium">
              <span className="font-bold">⚡ Pre-launch Pricing</span> - Final prices update after supplier partnership confirmed
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(247,127,0,0.1),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(21,128,108,0.1),transparent_50%)]" />
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Find Your Perfect Paddle 🏓
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Whether you're starting out or competing at the highest level, we'll help you find equipment that matches your playing style
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-xl mx-auto">
                <Button
                  size="lg"
                  onClick={handleStartQuiz}
                  className="w-full sm:w-auto px-12 py-7 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Take the Quiz
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/configurator")}
                  className="w-full sm:w-auto px-12 py-7 text-lg font-bold rounded-full border-2"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Build Custom
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <Card className="p-8 border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Personalized Matching</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our quiz analyzes your skill level, playing style, and preferences to recommend the perfect equipment
                </p>
              </Card>

              <Card className="p-8 border-2 border-border hover:border-secondary/50 transition-all hover:shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Expert Knowledge</h3>
                <p className="text-muted-foreground leading-relaxed">
                  8 years of experience helping players from beginners to national competitors find their ideal setup
                </p>
              </Card>

              <Card className="p-8 border-2 border-border hover:border-accent/50 transition-all hover:shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Premium Brands</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access to top brands like Butterfly, DHS, JOOLA, and ANDRO with professional-grade components
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-muted/30 to-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Table Tennis Players Love Us</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We make finding the right equipment simple, fun, and accurate
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Perfect Match Every Time</h3>
                    <p className="text-muted-foreground">
                      Our algorithm considers over 20 factors to ensure you get equipment that truly fits your game
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Lightning Fast Results</h3>
                    <p className="text-muted-foreground">
                      Get personalized recommendations in under 2 minutes with our streamlined quiz
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">All Budgets Welcome</h3>
                    <p className="text-muted-foreground">
                      From $30 beginner paddles to $300+ pro setups, we have options for every budget
                    </p>
                  </div>
                </div>
              </div>

              <Card className="p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-border">
                <div className="text-center space-y-6">
                  <div className="text-6xl font-bold text-primary">8+</div>
                  <p className="text-xl font-medium">Years of Expertise</p>
                  <p className="text-muted-foreground">
                    Helping players find their perfect equipment since 2016
                  </p>
                  <Button
                    size="lg"
                    onClick={handleStartQuiz}
                    className="w-full rounded-full font-bold"
                  >
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <HowItWorks />
        <CTASection onStartQuiz={handleStartQuiz} />
        <TrustSection />
        <FAQSection faqs={faqs} />
        <BlogPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
