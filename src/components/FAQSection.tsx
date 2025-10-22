import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StructuredData from "./StructuredData";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  description?: string;
}

const FAQSection = ({ faqs, title = "Frequently Asked Questions", description }: FAQSectionProps) => {
  return (
    <section className="py-16 bg-secondary/20">
      <StructuredData
        data={{
          type: 'FAQPage',
          questions: faqs,
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-headline text-3xl font-bold text-foreground text-center mb-4">
            {title}
          </h2>
          {description && (
            <p className="font-body text-lg text-muted-foreground text-center mb-8">
              {description}
            </p>
          )}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="font-headline text-lg font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
