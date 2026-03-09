'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Guides", href: "/blog" },
    { name: "Reviews", href: "/products" },
    { name: "Quiz", href: "/quiz" },
    { name: "Build a Racket", href: "/configurator" },
    { name: "Compare", href: "/compare" },
    { name: "About", href: "/about" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src={(logo as any).src || logo} alt="TopPaddle Logo" className="h-8 w-8" />
            <span className="font-headline text-xl font-bold text-foreground">
              TopPaddle
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-body text-sm font-medium transition-colors hover:text-primary ${isActive(item.href)
                  ? "text-primary bg-primary/10 px-3 py-1.5 rounded-md"
                  : "text-foreground"
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <DarkModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 text-foreground hover:bg-muted"
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
                  href={item.href}
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className={`font-body px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${isActive(item.href)
                    ? "text-primary bg-primary/10 rounded-md"
                    : "text-foreground"
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
