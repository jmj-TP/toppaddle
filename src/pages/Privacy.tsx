import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Privacy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Privacy Policy - How We Protect Your Data"
        description="Learn how TopPaddle collects, uses, and protects your information. Our privacy policy covers cookies and analytics."
        canonical="https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/privacy"
        noindex={true}
      />
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-headline text-4xl font-bold text-foreground">
              Privacy Policy – TopTableTennisPaddle.com
            </h1>
            <p className="font-body mt-4 text-sm text-muted-foreground">
              Last Updated: October 2025
            </p>

            {/* Introduction */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                1. Introduction
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                TopTableTennisPaddle.com ("we," "our," "us") values your privacy. This Privacy Policy explains how we collect, use, and protect information when you visit our website.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                By using TopTableTennisPaddle.com, you agree to the terms of this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                2. Information We Collect
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We collect two types of information:
              </p>
              
              <h3 className="font-headline text-xl font-semibold text-foreground mt-6">
                A. Personally Identifiable Information (PII)
              </h3>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Only collected if you voluntarily provide it (e.g., via contact forms or newsletter sign-ups).
              </p>
              <p className="font-body mt-2 leading-relaxed text-muted-foreground">
                Examples: name, email address.
              </p>

              <h3 className="font-headline text-xl font-semibold text-foreground mt-6">
                B. Non-Personally Identifiable Information
              </h3>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Automatically collected when you visit the website:
              </p>
              <ul className="font-body mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
                <li>Pages visited and time spent on the site</li>
                <li>Referring website</li>
                <li>Geographic location (general)</li>
              </ul>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                This information is used to improve website performance and user experience.
              </p>
            </section>

            {/* Cookies & Analytics */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                3. Cookies & Analytics
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We use cookies and similar technologies for:
              </p>
              <ul className="font-body mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Tracking site traffic and visitor behavior via Google Analytics</li>
                <li>Improving quiz functionality and user experience</li>
              </ul>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Note: Cookies do not store personal information.
                You can disable cookies in your browser settings at any time.
              </p>
            </section>

            {/* Third-Party Websites */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                4. Third-Party Websites
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Our site contains links to third-party retailers.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We are not responsible for the privacy practices of external websites.
                Please review their individual privacy policies before providing personal information.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                5. How We Use Your Information
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We may use your information to:
              </p>
              <ul className="font-body mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Improve the website and quiz experience</li>
                <li>Respond to inquiries or support requests</li>
                <li>Send newsletters or updates if you opt-in</li>
                <li>Monitor and analyze traffic patterns</li>
              </ul>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We do not sell or rent personal information.
              </p>
            </section>

            {/* Data Security */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                6. Data Security
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We implement reasonable administrative, technical, and physical safeguards to protect your data.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                7. Children's Privacy
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                TopTableTennisPaddle.com is not intended for children under 13.
                We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                8. Your Rights
              </h2>
              <ul className="font-body mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Opt-out of newsletters or marketing emails at any time.</li>
                <li>Disable cookies in your browser to limit tracking.</li>
                <li>Contact us to request deletion of any personal data you provided.</li>
              </ul>
            </section>

            {/* Updates to Privacy Policy */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                9. Updates to Privacy Policy
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We may update this Privacy Policy at any time.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Changes are effective immediately upon posting. Continued use of the site constitutes acceptance of updated terms.
              </p>
            </section>

            {/* Contact */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                10. Contact Us
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                For questions about this Privacy Policy or your data:{" "}
                <a href="mailto:toppaddlewebsite@gmail.com" className="text-primary hover:underline">
                  toppaddlewebsite@gmail.com
                </a>
              </p>
            </section>

            {/* Copyright */}
            <section className="mt-12 border-t border-border pt-8">
              <p className="font-body text-center text-sm text-muted-foreground">
                © {currentYear} TopTableTennisPaddle.com – All rights reserved.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
