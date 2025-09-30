import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-headline text-4xl font-bold text-foreground">
              Terms & Disclaimer
            </h1>
            <p className="font-body mt-4 text-sm text-muted-foreground">
              Last Updated: January 2025
            </p>

            {/* Affiliate Disclosure */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Affiliate Disclosure
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                TT Quiz Pro participates in various affiliate marketing programs, which means 
                we may earn commissions on purchases made through our links to retailer sites. 
                These commissions come at no additional cost to you and help us maintain and 
                improve our service.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We are committed to providing honest and unbiased recommendations. Our affiliate 
                relationships do not influence the integrity of our quiz results or product 
                recommendations. We only recommend products that we believe will genuinely benefit 
                our users based on their quiz responses and playing style.
              </p>
            </section>

            {/* Quiz Disclaimer */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Quiz Results Disclaimer
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                The recommendations provided by our quiz are based on general guidelines and our 
                experience in table tennis equipment. Individual results and satisfaction may vary 
                based on personal preferences, playing style, and skill development.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                While we strive to provide accurate and helpful recommendations, the quiz results 
                should be used as a starting point for your equipment selection. We recommend 
                trying equipment when possible and consulting with coaches or experienced players 
                before making significant purchases.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Limitation of Liability
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                TT Quiz Pro provides information and recommendations "as is" without warranty of 
                any kind, either express or implied. We do not guarantee specific results from 
                using recommended equipment.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We are not responsible for:
              </p>
              <ul className="font-body mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Product quality, availability, or pricing from third-party retailers</li>
                <li>Shipping, returns, or customer service issues with retailers</li>
                <li>Injuries or damages resulting from equipment use</li>
                <li>Individual satisfaction with recommended products</li>
              </ul>
            </section>

            {/* Use of Service */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Use of Service
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                By using TT Quiz Pro, you acknowledge that:
              </p>
              <ul className="font-body mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>You are using the service at your own risk</li>
                <li>Recommendations are advisory in nature</li>
                <li>You will conduct your own due diligence before purchasing</li>
                <li>You understand we may earn commissions from affiliate links</li>
              </ul>
            </section>

            {/* Product Information */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Product Information Accuracy
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                While we make every effort to ensure product information and specifications are 
                accurate, manufacturers may update their products without notice. Always verify 
                current specifications and features on the retailer's website before purchasing.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Changes to Terms
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We reserve the right to modify these terms at any time. Continued use of the 
                service after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Contact */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Contact Information
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                If you have any questions about these terms, please contact us through our 
                website contact form.
              </p>
            </section>

            {/* Copyright */}
            <section className="mt-12 border-t border-border pt-8">
              <p className="font-body text-center text-sm text-muted-foreground">
                © {currentYear} TT Quiz Pro. All rights reserved.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
