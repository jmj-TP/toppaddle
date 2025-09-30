import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-bold">TT Quiz Pro</h3>
            <p className="font-body text-sm text-primary-foreground/80">
              Helping table tennis players find their perfect equipment since 2017.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-headline text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="font-body text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  Take Quiz
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="font-body text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="font-body text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-headline text-sm font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="font-body text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  Terms & Disclaimer
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="font-body text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-headline text-sm font-semibold">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-primary-foreground/80 transition-colors hover:text-accent"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 transition-colors hover:text-accent"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 transition-colors hover:text-accent"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 transition-colors hover:text-accent"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-primary-foreground/20 pt-8">
          <p className="font-body text-center text-sm text-primary-foreground/60">
            © {currentYear} TT Quiz Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
