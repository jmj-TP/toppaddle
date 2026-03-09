import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/10 border-t border-border/50">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={(logo as any).src || logo} alt="TopPaddle Logo" className="h-8 w-8" />
              <h3 className="font-headline text-xl font-bold">TopPaddle</h3>
            </div>
            <p className="font-body text-sm text-sidebar-foreground/70 leading-relaxed">
              Extensive experience in table tennis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-headline text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="font-body text-sm text-sidebar-foreground/70 transition-colors hover:text-accent"
                >
                  Quiz
                </Link>
              </li>
              <li>
                <Link
                  href="/configurator"
                  className="font-body text-sm text-sidebar-foreground/70 transition-colors hover:text-accent"
                >
                  Configurator
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="font-body text-sm text-sidebar-foreground/70 transition-colors hover:text-accent"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-body text-sm text-sidebar-foreground/70 transition-colors hover:text-accent"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-headline text-sm font-semibold uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="font-body text-sm text-sidebar-foreground/70 transition-colors hover:text-accent"
                >
                  Terms & Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="font-body text-sm text-sidebar-foreground/70 transition-colors hover:text-accent"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sidebar-foreground/10 pt-8">
          <p className="font-body text-center text-sm text-sidebar-foreground/50">
            © {currentYear} TopPaddle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
