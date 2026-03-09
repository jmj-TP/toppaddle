import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Table Tennis Style Quiz — Find Your Perfect Blade & Rubber Setup",
    description: "Stop guessing. Take the 2-minute Pro-Level Quiz to find the exact blade and rubber combination for your specific playing style. Built by experts for the competitive player.",
    alternates: {
        canonical: "https://toppaddle.com/quiz",
    },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background">
            {children}
        </div>
    );
}
