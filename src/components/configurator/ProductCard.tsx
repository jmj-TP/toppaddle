import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface ProductCardProps {
  name: string;
  level: string;
  price: number;
  image?: string;
  onClick?: () => void;
}

export const ProductCard = ({ name, level, price, image, onClick }: ProductCardProps) => {
  return (
    <Card
      className="group cursor-pointer border border-border hover:border-accent/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="text-xs font-medium">
            {level}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>
        <p className="text-lg font-semibold text-accent">${price.toFixed(2)}</p>
      </div>
    </Card>
  );
};
