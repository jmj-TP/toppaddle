'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TableTennisQuiz from "@/components/TableTennisQuiz";

export default function Quiz() {
    const [isQuizActive, setIsQuizActive] = useState(true);

    const handleQuizStatusChange = (isActive: boolean) => {
        setIsQuizActive(isActive);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
            <Header />
            <main className="flex-1">
                <TableTennisQuiz onQuizStatusChange={handleQuizStatusChange} />
            </main>
            <Footer />
        </div>
    );
}
