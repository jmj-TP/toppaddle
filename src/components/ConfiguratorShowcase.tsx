'use client';

import { ArrowRight, Layers, Cpu, Zap, Beaker } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ConfiguratorShowcase = () => {
    const router = useRouter();

    return (
        <section className="relative py-24 overflow-hidden bg-background">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content Side */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
                            <Beaker className="w-4 h-4" />
                            Pro-Grade Tool
                        </div>

                        <h2 className="font-headline text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                            Build Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm">Ultimate Racket</span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                            Don't guess how a setup will perform. Our custom racket builder simulates real-world physics to instantly calculate the speed, spin, and control of 54,432 blade and rubber combinations.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-6 pt-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                                    <Layers className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-headline font-semibold text-xl text-foreground mb-1">Select Components</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Pair world-class blades with the exact forehand and backhand rubbers you prefer.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-sm">
                                    <Cpu className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-headline font-semibold text-xl text-foreground mb-1">Live Simulation</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Our engine calculates the final weight, speed, and spin dynamically as you build.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-sm">
                                    <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-headline font-semibold text-xl text-foreground mb-1">Compare Instantly</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Save your builds and run head-to-head comparisons to find the perfect synergy.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => router.push("/configurator")}
                                className="group inline-flex items-center justify-center h-14 px-8 text-lg font-bold rounded-xl bg-foreground text-background shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                Launch Builder
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Visual Showcase Side */}
                    <div className="relative z-10 flex items-center justify-center mt-12 lg:mt-0 px-4 sm:px-8">
                        <div className="relative w-full">
                            {/* Decorative backing elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2.5rem] transform rotate-3 scale-102 shadow-2xl opacity-50 blur-xl" />
                            <div className="absolute inset-0 border border-primary/10 rounded-[2.5rem] transform -rotate-2 bg-white/50 dark:bg-black/20 backdrop-blur-md shadow-premium" />

                            {/* The "App Window" */}
                            <div className="relative w-full overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
                                {/* Window Header */}
                                <div className="bg-muted/50 border-b border-border/50 px-4 py-3 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    <div className="mx-auto flex-1 text-center">
                                        <div className="inline-block px-3 py-1 rounded-md bg-background/80 text-[10px] font-semibold tracking-wider text-muted-foreground border border-border/50">
                                            TOPPADDLE OS
                                        </div>
                                    </div>
                                </div>

                                {/* Image Content */}
                                <div className="bg-white dark:bg-gray-900 border-t border-border/50 relative aspect-[16/10]">
                                    <Image
                                        src="/configurator.png"
                                        alt="TopPaddle Configurator Interface"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Floating Glass Badges */}
                            <div className="absolute -right-4 lg:-right-8 top-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-xl z-20 transform rotate-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <span className="text-emerald-600 font-bold text-xs">98</span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-foreground">Speed Rating</div>
                                        <div className="text-[10px] text-muted-foreground">Offensive +</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -left-4 lg:-left-6 bottom-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-xl z-20 transform -rotate-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-xs">88g</span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-foreground">Est. Weight</div>
                                        <div className="text-[10px] text-muted-foreground">Perfect Balance</div>
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

export default ConfiguratorShowcase;
