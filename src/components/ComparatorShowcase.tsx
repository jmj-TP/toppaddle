'use client';

import { ArrowRight, Scale, ListChecks, Trophy } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ComparatorShowcase = () => {
    const router = useRouter();

    return (
        <section className="relative py-24 overflow-hidden bg-background">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content Side (Left) */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold tracking-wide uppercase">
                            <Scale className="w-4 h-4" />
                            Head-To-Head Stats
                        </div>

                        <h2 className="font-headline text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                            Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 drop-shadow-sm">Everything</span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                            Ready to finalize your purchase but stuck between two setups? Run them through our advanced comparator to visualize the exact differences in price, weight, spin, and speed.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-6 pt-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm">
                                    <ListChecks className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-headline font-semibold text-xl text-foreground mb-1">Detailed Spec Insights</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">We automatically generate insights telling you which setup provides better value or power.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => router.push("/compare")}
                                className="group inline-flex items-center justify-center h-14 px-8 text-lg font-bold rounded-xl bg-foreground text-background shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                Start Comparing
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Visual Showcase Side (Right) */}
                    <div className="relative z-10 flex items-center justify-center mt-12 lg:mt-0 px-4 sm:px-8">
                        <div className="relative w-full">
                            {/* Decorative backing elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-[2.5rem] transform rotate-3 scale-102 shadow-2xl opacity-50 blur-xl" />
                            <div className="absolute inset-0 border border-emerald-500/10 rounded-[2.5rem] transform -rotate-2 bg-white/50 dark:bg-black/20 backdrop-blur-md shadow-premium" />

                            {/* The "App Window" */}
                            <div className="relative w-full overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
                                {/* Window Header */}
                                <div className="bg-muted/50 border-b border-border/50 px-4 py-3 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    <div className="mx-auto flex-1 text-center">
                                        <div className="inline-block px-3 py-1 rounded-md bg-background/80 text-[10px] font-semibold tracking-wider text-muted-foreground border border-border/50">
                                            ADVANCED COMPARATOR
                                        </div>
                                    </div>
                                </div>

                                {/* Image Content */}
                                <div className="bg-white dark:bg-gray-900 border-t border-border/50 relative p-4 pb-0 h-[450px] overflow-hidden">
                                    {/* Main Table Screenshot (offset slightly up) */}
                                    <div className="absolute top-4 left-4 right-4 aspect-[16/10] rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
                                        <Image
                                            src="/images/screenshot-1.png"
                                            alt="Table Tennis Paddle Comparison Tool Table"
                                            fill
                                            className="object-cover object-top opacity-50 filter blur-[2px]"
                                        />
                                        <div className="absolute inset-0 bg-white/20 dark:bg-black/20" />
                                    </div>

                                    {/* Radar Chart Screenshot (Floating over it) */}
                                    <div className="absolute -bottom-8 -left-4 w-[110%] aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border-t border-gray-200 dark:border-gray-800 transform rotate-1 transition-transform hover:rotate-0 duration-500">
                                        <Image
                                            src="/images/screenshot-2.png"
                                            alt="Table Tennis Performance Overview Radar Chart"
                                            fill
                                            className="object-cover object-top"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Glass Badges */}
                            <div className="absolute -right-4 lg:-right-8 top-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-xl z-20 transform rotate-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-foreground">Top Pick</div>
                                        <div className="text-[10px] text-muted-foreground">Best rated blade</div>
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

export default ComparatorShowcase;
