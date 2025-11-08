import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, User } from "lucide-react";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import { CartDrawer } from "./CartDrawer";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Quiz", href: "/quiz" },
    { name: "Configurator", href: "/configurator" },
    { name: "Compare", href: "/compare" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Terms", href: "/terms" },
  ];

  if (isAuthenticated) {
    navigation.splice(1, 0, { name: "Dashboard", href: "/dashboard" });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar-background/95 backdrop-blur-md shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center space-x-2">
            <img src={logo} alt="TopPaddle Logo" className="h-8 w-8" />
            <span className="font-headline text-xl font-bold text-sidebar-foreground">
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
                    : "text-sidebar-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <CartDrawer />
            <DarkModeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link to="/auth/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center gap-2">
            <CartDrawer />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-background/90"
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
                      : "text-sidebar-foreground"
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
