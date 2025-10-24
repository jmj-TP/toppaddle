import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏓</span>
              <h3 className="font-headline text-xl font-bold">TopPaddle</h3>
            </div>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              Over 20 years of experience in table tennis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-headline text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-body text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  Quiz
                </Link>
              </li>
              <li>
                <Link
                  to="/configurator"
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-body text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  Configurator
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-body text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-body text-sm text-primary-foreground/70 transition-colors hover:text-accent"
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
                  to="/terms"
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-body text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  Terms & Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-body text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <p className="font-body text-center text-sm text-primary-foreground/50">
            © {currentYear} TopPaddle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
