import { Award, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TrustSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl mb-6">
            Expert Guidance You Can Trust
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-12">
            With almost a decade of table tennis experience and countless hours helping players find their perfect equipment, 
            we're passionate about matching you with gear that truly enhances your game.
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-12 max-w-2xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-accent/10 mb-4">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-foreground mb-2">8+ Years</h3>
                <p className="font-body text-sm text-muted-foreground">Experience in Table Tennis</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-accent/10 mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-foreground mb-2">100%</h3>
                <p className="font-body text-sm text-muted-foreground">Passion for the Sport</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-6 max-w-2xl mx-auto">
            <p className="font-body text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Affiliate Disclosure:</span> TopTableTennisPaddle.com is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases at no additional cost to you. Our recommendations are always honest and based on real experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
