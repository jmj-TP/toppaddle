import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Info } from "lucide-react";

interface ProductCardProps {
  name: string;
  level: string;
  price: number;
  image?: string;
  selected?: boolean;
  stats?: {
    speed?: number;
    spin?: number;
    control?: number;
    power?: number;
  };
  onClick?: () => void;
  onInfoClick?: (e: React.MouseEvent) => void;
}

export const ProductCard = ({ 
  name, 
  level, 
  price, 
  image, 
  selected,
  stats,
  onClick,
  onInfoClick 
}: ProductCardProps) => {
  return (
    <Card
      className={`group cursor-pointer border-2 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-elegant
        ${selected ? 'border-accent shadow-elegant scale-[1.02]' : 'border-border hover:border-accent/30'}`}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted/20 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Package className="w-20 h-20 text-muted-foreground/20 mb-2" />
            <span className="text-xs text-muted-foreground/50">Product image</span>
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          <Badge variant="secondary" className="text-xs font-medium backdrop-blur-sm">
            {level}
          </Badge>
          {onInfoClick && (
            <button
              onClick={onInfoClick}
              className="w-7 h-7 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <Info className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Selected Indicator */}
        {selected && (
          <div className="absolute inset-0 bg-accent/5 border-2 border-accent pointer-events-none" />
        )}
      </div>

      {/* Info Section */}
      <div className="p-5">
        <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2 min-h-[3rem] leading-snug">
          {name}
        </h3>
        
        {/* Stats Mini Preview */}
        {stats && (
          <div className="grid grid-cols-4 gap-1 mb-3">
            {stats.speed !== undefined && (
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground mb-0.5">SPD</div>
                <div className="text-xs font-semibold">{stats.speed}</div>
              </div>
            )}
            {stats.spin !== undefined && (
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground mb-0.5">SPN</div>
                <div className="text-xs font-semibold">{stats.spin}</div>
              </div>
            )}
            {stats.control !== undefined && (
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground mb-0.5">CTL</div>
                <div className="text-xs font-semibold">{stats.control}</div>
              </div>
            )}
            {stats.power !== undefined && (
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground mb-0.5">PWR</div>
                <div className="text-xs font-semibold">{stats.power}</div>
              </div>
            )}
          </div>
        )}
        
        <p className="text-xl font-semibold text-accent">${price.toFixed(2)}</p>
      </div>
    </Card>
  );
};
