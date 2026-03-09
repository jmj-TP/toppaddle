'use client';

import { ClipboardList, Wrench, BarChart2, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

const ValuePropositionSection = () => {
  return (
    <section className="py-32 bg-[#FAFBFC] relative overflow-hidden" aria-labelledby="features-heading">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="mb-20 space-y-4 max-w-3xl">
          <h2
            id="features-heading"
            className="font-headline text-5xl lg:text-6xl font-black text-gray-900 tracking-tight"
          >
            Smarter Tools. <br />
            <span className="text-primary">Better Equipment.</span>
          </h2>
          <p className="text-xl text-gray-600 font-medium leading-relaxed">
            Stop relying on marketing hype. We provide the tools you need to analyze, compare, and perfectly match tabletop tennis equipment to your exact playstyle.
          </p>
        </div>

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">

          {/* Card 1: Quiz (Large Span) */}
          <div className="relative group md:col-span-2 row-span-1 rounded-[2.5rem] bg-white border border-gray-100 p-10 overflow-hidden shadow-card hover:shadow-xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                <ClipboardList className="w-8 h-8" strokeWidth={2} />
              </div>
              <h3 className="font-headline text-2xl font-bold text-gray-900 mb-3">
                Personalised Paddle Quiz
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                Six algorithm-free questions about your style, level, and budget. Get a shortlist built on decades of real player experience.
              </p>
              <div className="mt-auto">
                <Link href="/quiz" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors">
                  Take the Quiz <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            {/* Decorative Graphic */}
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
          </div>

          {/* Card 2: Racket Builder */}
          <div className="relative group md:col-span-1 row-span-1 rounded-[2.5rem] bg-gray-900 text-white p-10 overflow-hidden shadow-card hover:shadow-xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-gray-800 text-gray-200 border border-gray-700 flex items-center justify-center mb-6">
                <Wrench className="w-7 h-7" strokeWidth={2} />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-3">
                Racket Builder
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm mb-6">
                Explore combinations of pro blades and rubbers and see how they calculate out.
              </p>
              <div className="mt-auto">
                <Link href="/configurator" className="inline-flex items-center text-white font-bold hover:text-gray-300 transition-colors">
                  Explore Builder <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Compare */}
          <div className="relative group md:col-span-1 row-span-1 rounded-[2.5rem] bg-white border border-gray-100 p-10 overflow-hidden shadow-card hover:shadow-xl transition-all duration-500">
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 shadow-inner">
                <BarChart2 className="w-7 h-7" strokeWidth={2} />
              </div>
              <h3 className="font-headline text-2xl font-bold text-gray-900 mb-3">
                Side-by-Side
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm mb-6">
                Put any setups next to each other on a radar chart for true specs.
              </p>
              <div className="mt-auto">
                <Link href="/compare" className="inline-flex items-center text-orange-600 font-bold hover:text-orange-800 transition-colors">
                  Compare <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 4: Deep Dives (Large Span) */}
          <div className="relative group md:col-span-2 row-span-1 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-500">
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8" strokeWidth={2} />
              </div>
              <h3 className="font-headline text-3xl font-bold mb-3">
                Equipment Deep-Dives
              </h3>
              <p className="text-white/80 font-medium leading-relaxed mb-6 max-w-md">
                Honest, detailed breakdowns of blades and rubbers. Who they suit, what to pair them with, and what the specs actually mean on the table.
              </p>
              <div className="mt-auto">
                <Link href="/blog" className="inline-flex items-center bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-md w-fit">
                  Read the Guides <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            {/* Visual Flair */}
            <div className="absolute -right-12 -top-12 w-64 h-64 border-[40px] border-white/10 rounded-full opacity-50 blur-sm pointer-events-none" />
          </div>

        </div>

        {/* E-E-A-T Statement */}
        <div className="mt-20 pt-10 border-t border-gray-200 flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-bold tracking-widest uppercase mb-4">
            Independent & Unbiased
          </div>
          <p className="text-xl text-gray-700 font-medium leading-relaxed max-w-3xl">
            TopPaddle is <strong className="text-gray-900 border-b-2 border-primary/30 pb-0.5">100% independent</strong>. All equipment recommendations are based on hands-on testing and expert knowledge — never influenced by manufacturers or affiliate payments. Our goal is simple: help you play better.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
