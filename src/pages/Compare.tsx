import { useState } from 'react';
import { useComparisonStore } from '@/stores/comparisonStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RadarComparisonChart } from '@/components/comparison/RadarComparisonChart';
import { BarComparisonChart } from '@/components/comparison/BarComparisonChart';
import { InsightsSection } from '@/components/comparison/InsightsSection';
import { VerdictSection } from '@/components/comparison/VerdictSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';

const Compare = () => {
  const { paddles, removePaddle, clearComparison } = useComparisonStore();
  const [highlightedPaddle, setHighlightedPaddle] = useState<string | null>(null);
  const [considerPrice, setConsiderPrice] = useState(false);
  const navigate = useNavigate();

  if (paddles.length === 0) {
    return (
      <>
        <SEO 
          title="Compare Table Tennis Paddles"
          description="Compare up to 3 custom table tennis paddles side by side. Analyze performance stats, price, and get detailed insights to make the best choice."
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                <ArrowRight className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold">No Paddles to Compare</h1>
              <p className="text-muted-foreground">
                Head to the configurator to create custom paddles and add them to comparison.
              </p>
              <Button onClick={() => navigate('/configurator')} size="lg">
                Go to Configurator
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Compare Table Tennis Paddles"
        description="Compare up to 3 custom table tennis paddles side by side. Analyze performance stats, price, and get detailed insights."
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Paddle Comparison</h1>
              <p className="text-muted-foreground mt-2">
                Compare up to {3 - paddles.length} more {3 - paddles.length === 1 ? 'paddle' : 'paddles'}
              </p>
            </div>
            {paddles.length > 0 && (
              <Button variant="outline" onClick={clearComparison}>
                Clear All
              </Button>
            )}
          </div>

          {/* Paddle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paddles.map((paddle) => (
              <Card
                key={paddle.id}
                className={`p-6 cursor-pointer transition-all ${
                  highlightedPaddle === paddle.id ? 'ring-2 ring-primary' : ''
                }`}
                onMouseEnter={() => setHighlightedPaddle(paddle.id)}
                onMouseLeave={() => setHighlightedPaddle(null)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{paddle.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePaddle(paddle.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <img
                  src={paddle.image}
                  alt={paddle.name}
                  className="w-full h-40 object-contain mb-4 bg-muted rounded-lg"
                />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold">${paddle.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-semibold">{paddle.weight}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-semibold">{paddle.level}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Price Toggle */}
          <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-lg">
            <Switch
              id="price-toggle"
              checked={considerPrice}
              onCheckedChange={setConsiderPrice}
            />
            <Label htmlFor="price-toggle" className="cursor-pointer">
              Consider Price Influence
            </Label>
          </div>

          {/* Radar Chart */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Performance Overview</h2>
            <RadarComparisonChart paddles={paddles} highlightedPaddle={highlightedPaddle} />
          </Card>

          {/* Bar Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-4">
              <BarComparisonChart paddles={paddles} stat="speed" label="Speed" />
            </Card>
            <Card className="p-4">
              <BarComparisonChart paddles={paddles} stat="control" label="Control" />
            </Card>
            <Card className="p-4">
              <BarComparisonChart paddles={paddles} stat="power" label="Power" />
            </Card>
            <Card className="p-4">
              <BarComparisonChart paddles={paddles} stat="spin" label="Spin" />
            </Card>
          </div>

          {/* Verdict Section */}
          <VerdictSection paddles={paddles} considerPrice={considerPrice} />

          {/* Insights Section */}
          <InsightsSection paddles={paddles} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Compare;
