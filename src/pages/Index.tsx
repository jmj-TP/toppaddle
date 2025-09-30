import { useState } from "react";
import TableTennisQuiz from "@/components/TableTennisQuiz";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPreview from "@/components/BlogPreview";

const Index = () => {
  const [isQuizActive, setIsQuizActive] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <TableTennisQuiz onQuizStatusChange={setIsQuizActive} />
        {!isQuizActive && <BlogPreview />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
