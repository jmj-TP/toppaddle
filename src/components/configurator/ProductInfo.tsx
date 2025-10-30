import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import { StatSlider } from "@/components/configurator/StatSlider";
import { Gauge, Target, Shield, Star } from "lucide-react";

interface ProductInfoProps {
  product: Blade | Rubber | PreAssembledRacket;
  onClose: () => void;
}

const ProductInfo = ({ product, onClose }: ProductInfoProps) => {
  const getName = () => {
    if ('Blade_Name' in product) return product.Blade_Name;
    if ('Rubber_Name' in product) return product.Rubber_Name;
    if ('Racket_Name' in product) return product.Racket_Name;
    return '';
  };

  const getLevel = () => {
    if ('Blade_Level' in product) return product.Blade_Level;
    if ('Rubber_Level' in product) return product.Rubber_Level;
    if ('Racket_Level' in product) return product.Racket_Level;
    return '';
  };

  const getPrice = () => {
    if ('Blade_Price' in product) return product.Blade_Price;
    if ('Rubber_Price' in product) return product.Rubber_Price;
    if ('Racket_Price' in product) return product.Racket_Price;
    return 0;
  };

  const getSpeed = () => {
    if ('Blade_Speed' in product) return product.Blade_Speed;
    if ('Rubber_Speed' in product) return product.Rubber_Speed;
    if ('Racket_Speed' in product) return product.Racket_Speed;
    return 0;
  };

  const getSpin = () => {
    if ('Blade_Spin' in product) return product.Blade_Spin;
    if ('Rubber_Spin' in product) return product.Rubber_Spin;
    if ('Racket_Spin' in product) return product.Racket_Spin;
    return 0;
  };

  const getControl = () => {
    if ('Blade_Control' in product) return product.Blade_Control;
    if ('Rubber_Control' in product) return product.Rubber_Control;
    if ('Racket_Control' in product) return product.Racket_Control;
    return 0;
  };

  const getPower = () => {
    if ('Blade_Power' in product) return product.Blade_Power;
    if ('Rubber_Power' in product) return product.Rubber_Power;
    return Math.round((getSpeed() + getSpin()) / 2);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{getName()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">{getLevel()}</Badge>
            <span className="text-2xl font-semibold text-accent">${getPrice()}</span>
          </div>

          <div className="space-y-3">
            <div className="py-3 px-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Speed</span>
                <span className="text-sm font-semibold text-accent ml-auto">{getSpeed()}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${getSpeed()}%` }}
                />
              </div>
            </div>

            <div className="py-3 px-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Spin</span>
                <span className="text-sm font-semibold text-accent ml-auto">{getSpin()}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${getSpin()}%` }}
                />
              </div>
            </div>

            <div className="py-3 px-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Control</span>
                <span className="text-sm font-semibold text-accent ml-auto">{getControl()}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${getControl()}%` }}
                />
              </div>
            </div>

            <div className="py-3 px-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Power</span>
                <span className="text-sm font-semibold text-accent ml-auto">{getPower()}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${getPower()}%` }}
                />
              </div>
            </div>
          </div>

          {'Rubber_Style' in product && (
            <div>
              <span className="text-sm text-muted-foreground">Style: </span>
              <span className="font-medium">{product.Rubber_Style}</span>
            </div>
          )}

          {'Blade_Description' in product && product.Blade_Description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.Blade_Description}
            </p>
          )}
          {'Rubber_Description' in product && product.Rubber_Description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.Rubber_Description}
            </p>
          )}
          {'Racket_Description' in product && product.Racket_Description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.Racket_Description}
            </p>
          )}

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-sm mb-2">Customer Reviews</h3>
            <p className="text-sm text-muted-foreground italic">
              Reviews coming soon. Be the first to review this product!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInfo;
