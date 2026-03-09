import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy – TopTableTennisPaddle.com",
    description: "Learn how TopTableTennisPaddle.com collects, uses, and shares your information when you submit a quote request.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function Privacy() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <h1 className="font-headline text-4xl font-bold text-foreground">
                            Privacy Policy – TopTableTennisPaddle.com
                        </h1>
                        <p className="font-body mt-4 text-sm text-muted-foreground">
                            Last Updated: March 2026
                        </p>

                        <section className="mt-12">
                            <h2 className="font-headline text-2xl font-semibold text-foreground">1. Introduction</h2>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                TopTableTennisPaddle.com ("we," "our," "us") is an informational and lead generation platform. We help players find the right table tennis equipment and connect them with certified retailers who can provide personalized pricing offers.
                            </p>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                This Privacy Policy explains what data we collect, how we use it, and how it is shared with our retail partners.
                            </p>
                        </section>

                        <section className="mt-12">
                            <h2 className="font-headline text-2xl font-semibold text-foreground">2. Information We Collect</h2>
                            <h3 className="font-headline text-xl font-semibold text-foreground mt-6">A. Quote Request Data</h3>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                When you submit a quote request through our "Ask for an offer" form, we collect:
                            </p>
                            <ul className="font-body mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                                <li>Your full name</li>
                                <li>Your email address</li>
                                <li>Your equipment preferences (blade, rubbers, setup type)</li>
                            </ul>

                            <h3 className="font-headline text-xl font-semibold text-foreground mt-6">B. Automatically Collected Data</h3>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                When you visit our website, we may collect anonymous technical information such as browser type, device type, pages visited, and approximate geographic location. This data is used solely to improve the website experience.
                            </p>
                        </section>

                        <section className="mt-12">
                            <h2 className="font-headline text-2xl font-semibold text-foreground">3. How We Use and Share Your Data</h2>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                <strong>When you submit a quote request, your contact details and equipment preferences are shared with certified table tennis retailers</strong> so they can send you personalized pricing offers directly.
                            </p>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                This is the core service we provide. By submitting the form, you give explicit consent to this sharing. We do not share your data with unrelated third parties, advertisers, or data brokers.
                            </p>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                Anonymous browsing data is used only to improve our website and quiz tools.
                            </p>
                        </section>

                        <section className="mt-12">
                            <h2 className="font-headline text-2xl font-semibold text-foreground">4. Cookies & Analytics</h2>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                We may use cookies for site analytics (e.g., Google Analytics) to understand how visitors use our tools. Cookies do not store personally identifiable information. You can disable cookies in your browser settings at any time.
                            </p>
                        </section>

                        <section className="mt-12">
                            <h2 className="font-headline text-2xl font-semibold text-foreground">5. Your Rights</h2>
                            <ul className="font-body mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                                <li>You may request deletion of any personal data you submitted to us.</li>
                                <li>You may request access to or correction of your data.</li>
                                <li>You may opt out of future retailer communications at any time by contacting us.</li>
                                <li>You may disable cookies in your browser at any time.</li>
                            </ul>
                        </section>

                        <section className="mt-12">
                            <h2 className="font-headline text-2xl font-semibold text-foreground">6. Data Security</h2>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                We take reasonable steps to protect your data. Quote requests are transmitted securely. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section className="mt-12">
                            <h2 className="font-headline text-2xl font-semibold text-foreground">7. Children's Privacy</h2>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                This website is not intended for children under 13. We do not knowingly collect personal information from children.
                            </p>
                        </section>

                        <section className="mt-12">
                            <h2 className="font-headline text-2xl font-semibold text-foreground">8. Changes to This Policy</h2>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                We may update this policy at any time. Continued use of the site constitutes acceptance of the updated terms.
                            </p>
                        </section>

                        <section className="mt-12">
                            <h2 className="font-headline text-2xl font-semibold text-foreground">9. Contact Us</h2>
                            <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                                For any questions about this policy or your data, contact us at{" "}
                                <a href="mailto:toppaddlewebsite@gmail.com" className="text-primary hover:underline">
                                    toppaddlewebsite@gmail.com
                                </a>
                            </p>
                        </section>

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
}
