import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Terms = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Terms & Disclaimer"
        description="Read TopPaddle's terms of service and disclaimer. Important information about quiz results and product recommendations."
        canonical="https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/terms"
        noindex={true}
      />
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-headline text-4xl font-bold text-foreground">
              Terms of Service – TopTableTennisPaddle.com
            </h1>
            <p className="font-body mt-4 text-sm text-muted-foreground">
              Last Updated: October 2025
            </p>

            {/* Order and Purchase Terms */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Order and Purchase Terms
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                By placing an order through TopTableTennisPaddle.com, you agree to purchase the products at the prices displayed at checkout.
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                All prices are listed in USD and may change without notice.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Customers are responsible for providing accurate shipping information.
              </p>
            </section>

            {/* Payment Terms */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Payment Terms
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                All payments are processed securely through our payment provider.
                We accept major credit cards and other payment methods as displayed at checkout.
                Prices are in USD unless otherwise stated. You agree to pay all charges at the prices in effect when you place your order.
              </p>
            </section>

            {/* Returns & Exchanges */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Returns & Exchanges
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We accept returns within 14 days of delivery for unused products in their original packaging and condition.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                The customer is responsible for return shipping costs unless the item is defective or we sent the wrong product.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Once we receive and inspect the item, we'll issue a refund (excluding original shipping costs).
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Used or damaged items not caused by shipping are not eligible for return.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Please contact us before returning any item so we can provide the proper return instructions.
              </p>
            </section>

            {/* Custom Assembled Rackets */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Custom Assembled Rackets
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Custom-assembled rackets (blade + rubber combinations) are non-returnable and non-refundable unless they arrive damaged or defective.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Customers should double-check their selections (blade type, handle style, rubbers, sponge thickness) before ordering.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                If your custom racket arrives damaged or defective, contact us within 3 days of delivery with photos or a short video showing the issue.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We'll arrange a replacement or refund once the claim is verified.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                These policies match those of our assembly partners and ensure product quality for every customer.
              </p>
            </section>

            {/* Damaged or Defective Items */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Damaged or Defective Items
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                If an item arrives damaged or defective, please contact us within 3 days of delivery.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Include clear photos or a short video of the damage or defect.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We'll review your case and work to provide a replacement or refund. Our goal is to make sure every customer receives their product in perfect condition.
              </p>
            </section>

            {/* Lost or Missing Shipments */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Lost or Missing Shipments
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                If your order hasn't arrived within 15 business days of shipment, please contact us.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We'll open an investigation with the shipping carrier and keep you updated.
                If the shipment is confirmed lost, we'll offer a replacement or full refund.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Please note that shipping times can vary depending on location and carrier delays.
              </p>
            </section>

            {/* Shipping Policy */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Shipping Policy
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We currently ship orders within the United States using reliable carriers such as USPS and UPS.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Orders are usually processed and shipped within 1–3 business days.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Delivery typically takes 3–7 business days, depending on destination.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                You'll receive tracking information by email once your order ships.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We are not responsible for delays caused by carriers, weather, or incorrect shipping information provided by the customer.
              </p>
            </section>

            {/* Product Warranties */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Product Warranties
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Products are covered by manufacturer warranties where applicable.
                We are not responsible for manufacturer defects beyond facilitating warranty claims.
                Custom assembly services are guaranteed for workmanship quality.
              </p>
            </section>

            {/* Quiz Results Disclaimer */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Quiz Results Disclaimer
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Equipment recommendations generated by our quiz are guidelines only.
                Results vary by player, style, and skill level.
                We encourage testing equipment and consulting experienced players before purchasing.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Limitation of Liability
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                TopTableTennisPaddle.com provides products and content "as is".
                To the maximum extent permitted by law, we are not liable for:
              </p>
              <ul className="font-body mt-4 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Injuries or dissatisfaction resulting from product use</li>
                <li>Delays in shipping or delivery</li>
                <li>Product performance or suitability for specific purposes</li>
                <li>Loss of profits or indirect damages</li>
              </ul>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Our total liability for any claim shall not exceed the amount you paid for the product.
              </p>
            </section>

            {/* Product Information Accuracy */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Product Information Accuracy
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We strive to keep product specifications, descriptions, and prices accurate.
                However, errors may occur. If a product is listed at an incorrect price or with incorrect information,
                we reserve the right to refuse or cancel orders for that product.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Intellectual Property & Code Ownership
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                All content, including text, graphics, images, algorithms, and code, is the intellectual property of TopTableTennisPaddle.com.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Some portions of code/algorithm were developed with AI tools (e.g., Lovable).
                All custom logic and configuration belong exclusively to TopTableTennisPaddle.com.
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                You may not copy, reproduce, distribute, or modify any part of this site without written permission.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Changes to Terms
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We may update these terms at any time.
                Continued use constitutes acceptance of updated Terms.
              </p>
            </section>

            {/* Contact */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Contact Us
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                For returns, damaged items, or lost shipments, please email us at{" "}
                <a href="mailto:toppaddlewebsite@gmail.com" className="text-primary hover:underline">
                  toppaddlewebsite@gmail.com
                </a>
              </p>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                We aim to reply within 1–2 business days.
              </p>
            </section>

            {/* Thank You */}
            <section className="mt-12">
              <h2 className="font-headline text-2xl font-semibold text-foreground">
                Thank You
              </h2>
              <p className="font-body mt-4 leading-relaxed text-muted-foreground">
                Thank you for shopping with us! We're a small business that loves table tennis and values your trust.
                We'll always do our best to make sure you're happy with your order.
              </p>
            </section>

            {/* Copyright */}
            <section className="mt-12 border-t border-border pt-8">
              <p className="font-body text-center text-sm text-muted-foreground">
                © {currentYear} TopTableTennisPaddle.com – All rights reserved. Unauthorized copying is prohibited.
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
