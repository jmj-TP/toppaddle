import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Page Not Found - 404 Error"
        description="The page you're looking for doesn't exist. Return to TopPaddle to find your perfect table tennis racket."
        noindex={true}
      />
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="text-center px-4">
          <h1 className="font-headline text-6xl font-bold text-foreground mb-4">404</h1>
          <p className="font-body text-2xl text-muted-foreground mb-8">Oops! Page not found</p>
          <p className="font-body text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="accent" size="lg" className="shadow-[var(--shadow-accent)]">
              Return to Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
