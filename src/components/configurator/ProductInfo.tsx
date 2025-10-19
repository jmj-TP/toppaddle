import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";

interface ProductInfoProps {
  product: Blade | Rubber | PreAssembledRacket;
  onClose: () => void;
}

const ProductInfo = ({ product, onClose }: ProductInfoProps) => {
  const StatRow = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-accent">{value}</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{getName()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{getLevel()}</Badge>
            <span className="text-lg font-bold text-accent">${getPrice()}</span>
          </div>

          <div className="space-y-3">
            <StatRow label="Speed" value={getSpeed()} />
            <StatRow label="Spin" value={getSpin()} />
            <StatRow label="Control" value={getControl()} />
          </div>

          {'Rubber_Style' in product && (
            <div>
              <span className="text-sm text-muted-foreground">Style: </span>
              <span className="font-medium">{product.Rubber_Style}</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground italic">
            Detailed product description coming soon...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInfo;
