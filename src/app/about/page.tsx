import { Shield, Award, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About TopTableTennisPaddle — Expert Equipment Guidance",
    description: "Learn about TopTableTennisPaddle's mission to help players find the perfect table tennis equipment through our free quiz, configurator, and comparator tools.",
};

export default function About() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
            <StructuredData
                data={{
                    type: 'BreadcrumbList',
                    items: [
                        { name: 'Home', url: 'https://www.toptabletennispaddle.com/' },
                        { name: 'About', url: 'https://www.toptabletennispaddle.com/about' }
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
                                About TopTableTennisPaddle
                            </h1>
                            <p className="font-body mt-6 text-lg text-primary-foreground/90">
                                Your free table tennis equipment finder
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
                                TopTableTennisPaddle is a free equipment guidance platform built by passionate table tennis players. Our mission is simple: take the guesswork out of choosing the right equipment, so you can focus on improving your game.
                            </p>
                            <p className="font-body mt-4 text-lg leading-relaxed text-muted-foreground">
                                We don't sell products. Instead, we provide free tools — a quiz, a custom setup configurator, and a side-by-side comparator — to help you discover what equipment fits your playing style. When you're ready to buy, we connect you with certified retailers who can offer you the best possible price.
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
                                    <CardTitle className="font-headline text-xl">Expert Playing</CardTitle>
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
                        <Button
                            asChild
                            className="mt-8 font-body shadow-[var(--shadow-accent)] bg-accent hover:bg-accent/90 text-accent-foreground"
                            size="lg"
                        >
                            <Link href="/">
                                Start the Quiz
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
