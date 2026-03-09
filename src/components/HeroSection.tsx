'use client';

import { ArrowRight, Star, ShieldCheck, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const HeroSection = () => {
  const router = useRouter();

  return (
    <section
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-white"
      aria-label="Find your perfect table tennis paddle"
    >
      {/* Rich Light Background (Moving Meshes & Noise) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft, vibrant atmospheric glows */}
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-blue-100/60 to-purple-100/60 blur-[100px] opacity-70 mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-orange-100/60 to-red-100/60 blur-[100px] opacity-70 mix-blend-multiply" />

        {/* Subtle grid/texture overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-32 pb-20 lg:py-0">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 z-10 relative">

            {/* Trust Badge */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-white/80 backdrop-blur-md shadow-sm text-primary text-sm font-bold tracking-wide uppercase">
                <Trophy className="w-4 h-4" />
                #1 Table Tennis Guide
              </div>
            </div>

            {/* Massive Editorial Headline */}
            <h1 className="font-headline text-6xl sm:text-7xl lg:text-8xl xl:text-[6.5rem] font-black tracking-tighter leading-[0.9] text-gray-900 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Find Your <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-accent drop-shadow-sm pb-2">
                Perfect Paddle.
                {/* Decorative underline */}
                <div className="absolute bottom-1 left-0 w-full h-3 bg-accent/20 -skew-x-12 -z-10 rounded-full" />
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl sm:text-2xl leading-relaxed max-w-2xl text-gray-700 font-medium animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Stop guessing. We use real physics and pro-player data to match you with exactly the right blade and rubbers.
            </p>

            {/* Premium CTAs */}
            <div className="flex flex-col sm:flex-row gap-5 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => router.push("/quiz")}
                className="group relative inline-flex items-center justify-center h-16 px-10 text-xl font-bold rounded-2xl bg-foreground text-background overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                Take the Quiz
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/configurator")}
                className="inline-flex items-center justify-center h-16 px-10 text-xl font-bold rounded-2xl border-2 border-border/60 bg-white shadow-sm text-foreground transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-md"
              >
                Racket Builder
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex flex-col gap-1">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unbiased Reviews</span>
              </div>
              <div className="flex flex-col gap-1">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">54,432 Kombos</span>
              </div>
              <div className="flex flex-col gap-1">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pro Trusted</span>
              </div>
              <div className="flex flex-col gap-1">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Real Expertise</span>
              </div>
            </div>
          </div>

          {/* Right Image/Collage Column */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-[750px] w-full mt-12 lg:mt-0 animate-fade-in flex items-center justify-center" style={{ animationDelay: '0.3s' }}>
            {/* Stylish image backing to replace the plain overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-[3rem] transform rotate-6 scale-105 shadow-2xl backdrop-blur-3xl opacity-60" />

            <div className="relative w-full h-[90%] rounded-[3rem] overflow-hidden border-8 border-white shadow-premium bg-gray-100">
              <Image
                src="/hero-player.png"
                alt="Professional table tennis player"
                fill
                priority
                className="object-cover object-center scale-105 transform hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm font-bold tracking-widest uppercase mb-1 text-white/80">Featured Setup</p>
                <p className="text-2xl font-headline font-bold drop-shadow-md">Timo Boll ALC + Tenergy 05</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
