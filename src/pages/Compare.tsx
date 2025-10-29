import { useState } from 'react';
import { useComparisonStore } from '@/stores/comparisonStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RadarComparisonChart, type PerformanceView } from '@/components/comparison/RadarComparisonChart';
import { BarComparisonChart } from '@/components/comparison/BarComparisonChart';
import { InsightsSection } from '@/components/comparison/InsightsSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, Trophy, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';

const Compare = () => {
  const { paddles, removePaddle, clearComparison } = useComparisonStore();
  const [selectedPaddle, setSelectedPaddle] = useState<string | null>(paddles[0]?.id || null);
  const [performanceView, setPerformanceView] = useState<PerformanceView>('overall');
  const navigate = useNavigate();

  // Calculate best overall and best value
  const bestOverall = paddles.reduce((best, paddle) => {
    const paddleScore = (paddle.speed + paddle.control + paddle.power + paddle.spin) / 4;
    const bestScore = (best.speed + best.control + best.power + best.spin) / 4;
    return paddleScore > bestScore ? paddle : best;
  }, paddles[0]);

  const bestValue = paddles.reduce((best, paddle) => {
    const paddleValue = (paddle.speed + paddle.control + paddle.power + paddle.spin) / (4 * paddle.price);
    const bestValueScore = (best.speed + best.control + best.power + best.spin) / (4 * best.price);
    return paddleValue > bestValueScore ? paddle : best;
  }, paddles[0]);

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
                className="p-6 relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{paddle.name}</h3>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {paddle.id === bestOverall?.id && (
                        <Badge variant="default" className="gap-1">
                          <Trophy className="w-3 h-3" />
                          Best Overall
                        </Badge>
                      )}
                      {paddle.id === bestValue?.id && (
                        <Badge variant="secondary" className="gap-1">
                          <DollarSign className="w-3 h-3" />
                          Best Value
                        </Badge>
                      )}
                    </div>
                  </div>
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
                  {paddle.blade && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blade:</span>
                      <span className="font-medium text-right flex-1 ml-2">{paddle.blade}</span>
                    </div>
                  )}
                  {paddle.forehandRubber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Forehand:</span>
                      <span className="font-medium text-right flex-1 ml-2">{paddle.forehandRubber}</span>
                    </div>
                  )}
                  {paddle.backhandRubber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Backhand:</span>
                      <span className="font-medium text-right flex-1 ml-2">{paddle.backhandRubber}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border">
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

          {/* Interactive Selection Guide */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Click on paddle names in the legend below to select and compare
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: <span className="font-semibold text-primary">
                    {paddles.find(p => p.id === selectedPaddle)?.name || paddles[0]?.name}
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {/* Radar Chart and Insights Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <RadarComparisonChart 
                paddles={paddles} 
                selectedPaddle={selectedPaddle}
                onPaddleSelect={(id) => {
                  setSelectedPaddle(id);
                }}
                performanceView={performanceView}
                onPerformanceViewChange={setPerformanceView}
              />
            </Card>
            <InsightsSection paddles={paddles} selectedPaddleId={selectedPaddle} />
          </div>

          {/* Bar Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-4">
              <BarComparisonChart paddles={paddles} stat="speed" label="Speed" performanceView={performanceView} />
            </Card>
            <Card className="p-4">
              <BarComparisonChart paddles={paddles} stat="control" label="Control" performanceView={performanceView} />
            </Card>
            <Card className="p-4">
              <BarComparisonChart paddles={paddles} stat="power" label="Power" performanceView={performanceView} />
            </Card>
            <Card className="p-4">
              <BarComparisonChart paddles={paddles} stat="spin" label="Spin" performanceView={performanceView} />
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Compare;
