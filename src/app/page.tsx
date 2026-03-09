import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ConfiguratorShowcase from "@/components/ConfiguratorShowcase";
import QuizShowcase from "@/components/QuizShowcase";
import ComparatorShowcase from "@/components/ComparatorShowcase";
import ValuePropositionSection from "@/components/ValuePropositionSection";
import EquipmentGallery from "@/components/EquipmentGallery";
import BlogPreview from "@/components/BlogPreview";
import StructuredData from "@/components/StructuredData";
import FAQSection from "@/components/FAQSection";

export const metadata: Metadata = {
    title: "Best Table Tennis Paddles 2025 | Paddle Reviews & Buyer's Guide",
    description: "Find the best table tennis paddle for your level and style. Expert reviews, head-to-head comparisons, and a free personalised recommendation quiz. Beginners to pros — free forever.",
    keywords: [
        "best table tennis paddle",
        "table tennis paddle review",
        "ping pong paddle buying guide",
        "table tennis rubber comparison",
        "custom table tennis racket",
        "table tennis equipment",
    ].join(", "),
    openGraph: {
        title: "Best Table Tennis Paddles 2025 | TopTableTennisPaddle",
        description: "Expert paddle reviews, free personalised quiz, and a pro-grade configurator. Find the right equipment for your game.",
        url: "/",
        siteName: "TopTableTennisPaddle",
        type: "website",
    },
    alternates: {
        canonical: "/",
    },
};

export default function Home() {
    const faqs = [
        {
            question: "How do I choose the right table tennis paddle?",
            answer: "The best paddle depends on your skill level, playing style, and budget. Beginners should focus on control and consistency, while advanced players may prefer faster, spin-heavy setups. Use our free Paddle Quiz to get a shortlist matched to your answers in under two minutes."
        },
        {
            question: "What's the difference between pre-assembled and custom rackets?",
            answer: "Pre-assembled rackets come ready to play and are ideal for beginners to intermediate players. Custom rackets let you choose your blade and rubbers separately, giving you full control over speed, spin, and feel — perfect for players who know exactly what they want."
        },
        {
            question: "How much should I spend on a table tennis paddle?",
            answer: "Beginners can find quality paddles for $30–$80. Intermediate players typically invest $80–$150, while advanced and competitive players often spend $150–$300+ on custom setups with professional-grade blades and rubbers."
        },
        {
            question: "What do Speed, Spin, and Control ratings mean?",
            answer: "Speed measures how fast the ball travels off the paddle. Spin shows how much rotation you can generate for topspin, backspin, and serves. Control reflects how predictable and forgiving the paddle is. Beginners benefit from high control, while advanced players balance all three based on their playing style."
        },
        {
            question: "How often should I replace my table tennis rubbers?",
            answer: "With regular play (3–5 times per week) rubbers typically last 3–6 months before grip and tackiness noticeably decline. Proper cleaning after every session extends their life significantly."
        },
        {
            question: "Is TopPaddle free to use?",
            answer: "Yes — completely free, always. TopPaddle's quiz, configurator, comparison tool, and guides are all free with no sign-up required. We are independently funded and our recommendations are never influenced by manufacturers."
        },
    ];

    const structuredDataItems = [
        {
            type: 'Organization' as const,
            name: 'TopTableTennisPaddle',
            url: 'https://www.toptabletennispaddle.com',
            logo: 'https://www.toptabletennispaddle.com/logo.png',
        },
        {
            type: 'BreadcrumbList' as const,
            items: [
                { name: 'Home', url: 'https://www.toptabletennispaddle.com/' }
            ]
        },
        {
            type: 'FAQPage' as const,
            questions: faqs,
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <StructuredData data={structuredDataItems} />
            <Header />
            <main className="flex-1">
                <HeroSection />
                <ConfiguratorShowcase />
                <QuizShowcase />
                <ComparatorShowcase />
                <EquipmentGallery />
                <ValuePropositionSection />
                <FAQSection faqs={faqs} />
                <BlogPreview />
            </main>
            <Footer />
        </div>
    );
}
