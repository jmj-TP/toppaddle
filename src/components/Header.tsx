import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import { CartDrawer } from "./CartDrawer";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Quiz", href: "/quiz" },
    { name: "Configurator", href: "/configurator" },
    { name: "Compare", href: "/compare" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Terms", href: "/terms" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-primary shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center space-x-2">
            <span className="font-headline text-xl font-bold text-primary-foreground">
              TopPaddle
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => window.scrollTo(0, 0)}
                className={`font-body text-sm font-medium transition-colors hover:text-accent ${
                  isActive(item.href)
                    ? "text-accent"
                    : "text-primary-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <CartDrawer />
            <DarkModeToggle />
          </div>

          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center gap-2">
            <CartDrawer />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 text-primary-foreground hover:bg-primary/90"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className={`font-body px-4 py-2 text-sm font-medium transition-colors hover:text-accent ${
                    isActive(item.href)
                      ? "text-accent"
                      : "text-primary-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-2">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
