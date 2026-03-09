'use client';

import { ArrowRight, Crosshair, Activity, Award, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const QuizShowcase = () => {
    const router = useRouter();

    return (
        <section className="relative py-24 overflow-hidden bg-background">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content Side (Right for alternating rhythm) */}
                    <div className="space-y-8 order-2 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase">
                            <Crosshair className="w-4 h-4" />
                            Personalized Algorithm
                        </div>

                        <h2 className="font-headline text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                            Take the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 drop-shadow-sm">Paddle Quiz</span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                            Stop guessing which blade or rubber fits your playstyle. Answer a few questions about your grip, skill level, and budget to instantly unlock your mathematically perfect setup.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-6 pt-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-sm">
                                    <Activity className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-headline font-semibold text-xl text-foreground mb-1">Tailored for You</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Whether you're a defensive chopper or an aggressive attacker, we match you precisely.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-sm">
                                    <Award className="w-6 h-6 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className="font-headline font-semibold text-xl text-foreground mb-1">Expert Approved</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Recommendations are powered by data from thousands of professional combinations.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => router.push("/quiz")}
                                className="group inline-flex items-center justify-center h-14 px-8 text-lg font-bold rounded-xl bg-foreground text-background shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                Start the Quiz
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Visual Showcase Side (Left for alternating rhythm) */}
                    <div className="relative z-10 flex items-center justify-center mt-12 lg:mt-0 px-4 sm:px-8 order-1 lg:order-1">
                        <div className="relative w-full">
                            {/* Decorative backing elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-[2.5rem] transform -rotate-3 scale-102 shadow-2xl opacity-50 blur-xl" />
                            <div className="absolute inset-0 border border-blue-500/10 rounded-[2.5rem] transform rotate-2 bg-white/50 dark:bg-black/20 backdrop-blur-md shadow-premium" />

                            {/* The "App Window" */}
                            <div className="relative w-full overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
                                {/* Window Header */}
                                <div className="bg-muted/50 border-b border-border/50 px-4 py-3 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    <div className="mx-auto flex-1 text-center">
                                        <div className="inline-block px-3 py-1 rounded-md bg-background/80 text-[10px] font-semibold tracking-wider text-muted-foreground border border-border/50">
                                            PERFORMANCE ANALYSIS
                                        </div>
                                    </div>
                                </div>

                                {/* Image Content */}
                                <div className="bg-blue-50/50 dark:bg-gray-900 border-t border-border/50 relative p-4 h-[420px] overflow-hidden">
                                    {/* Background Question view */}
                                    <div className="absolute top-4 right-[-10%] w-[90%] aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-gray-200/60 dark:border-gray-800 opacity-60 filter blur-[1px]">
                                        <Image
                                            src="/images/screenshot-3.png"
                                            alt="Quiz Question View"
                                            fill
                                            className="object-cover object-top"
                                        />
                                    </div>

                                    {/* Foreground Quiz Title view */}
                                    <div className="absolute bottom-4 left-4 w-[85%] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80 dark:border-gray-700 transform -rotate-2 hover:rotate-0 transition-all duration-500">
                                        <Image
                                            src="/images/screenshot-4.png"
                                            alt="Take the Paddle Quiz Title"
                                            fill
                                            className="object-cover object-left-top"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Glass Badges */}
                            <div className="absolute -left-4 lg:-left-8 top-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-xl z-20 transform -rotate-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-foreground">98% Match</div>
                                        <div className="text-[10px] text-muted-foreground">Perfect for you</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default QuizShowcase;
