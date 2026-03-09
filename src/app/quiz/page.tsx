'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuizStore } from "@/stores/quizStore";

export default function QuizIntro() {
    const router = useRouter();
    const { isComplete } = useQuizStore();

    // If quiz is complete, redirect to the quiz page to show recommendations
    useEffect(() => {
        if (isComplete) {
            router.replace("/quiz/start");
        }
    }, [isComplete, router]);

    const handleStartQuiz = () => {
        router.push("/quiz/start");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
            <StructuredData
                data={{
                    type: 'BreadcrumbList',
                    items: [
                        { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' },
                        { name: 'Quiz', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/quiz' }
                    ]
                }}
            />
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
                    {/* Background Layer: Custom User Racket Image */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url("/images/quiz-racket-bg.jpg")',
                        }}
                    >
                        {/* Dark overlay to ensure white text readability in both light/dark modes */}
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
                        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                            Find Your Perfect Table Tennis Racket
                        </h1>
                        <p className="font-body text-lg sm:text-xl text-white/95 mb-10 max-w-2xl mx-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                            Answer a few quick questions about your playing style, skill level, and preferences.
                            Our expert algorithm will recommend the ideal paddle setup tailored specifically for you.
                        </p>

                        <Button
                            onClick={handleStartQuiz}
                            size="lg"
                            className="text-lg sm:text-xl px-10 py-6 h-auto shadow-lg hover:shadow-xl transition-all rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Start Quiz Now
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </Button>
                    </div>
                </section>

                <HowItWorks />

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl mb-6">
                            Ready to Find Your Perfect Match?
                        </h2>
                        <p className="font-body text-lg text-muted-foreground mb-8">
                            Join thousands of players who've found their ideal equipment through our quiz
                        </p>
                        <Button
                            onClick={handleStartQuiz}
                            size="lg"
                            className="text-lg px-8 py-6 h-auto"
                        >
                            Take the Quiz
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
