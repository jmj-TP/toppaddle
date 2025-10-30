import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { Blade, Rubber } from "@/data/products";
import ProductInfo from "./ProductInfo";

interface ComponentSelectorProps {
  title: string;
  subtitle?: string;
  products: (Blade | Rubber)[];
  selectedProduct: Blade | Rubber;
  onSelect: (product: Blade | Rubber) => void;
  onFilterClick?: () => void;
}

export const ComponentSelector = ({
  title,
  subtitle,
  products,
  selectedProduct,
  onSelect,
  onFilterClick
}: ComponentSelectorProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedForInfo, setSelectedForInfo] = useState<Blade | Rubber | null>(null);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const currentProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const getName = (product: Blade | Rubber) => {
    if ('Blade_Name' in product) return product.Blade_Name;
    return product.Rubber_Name;
  };

  const getLevel = (product: Blade | Rubber) => {
    if ('Blade_Level' in product) return product.Blade_Level;
    return product.Rubber_Level;
  };

  const getPrice = (product: Blade | Rubber) => {
    if ('Blade_Price' in product) return product.Blade_Price;
    return product.Rubber_Price;
  };

  const getStats = (product: Blade | Rubber) => {
    if ('Blade_Speed' in product) {
      return {
        speed: product.Blade_Speed,
        spin: product.Blade_Spin,
        control: product.Blade_Control,
        power: product.Blade_Power,
      };
    }
    return {
      speed: product.Rubber_Speed,
      spin: product.Rubber_Spin,
      control: product.Rubber_Control,
      power: product.Rubber_Power,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-1">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {onFilterClick && (
          <Button
            variant="outline"
            size="lg"
            onClick={onFilterClick}
            className="rounded-full gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={getName(product)}
            name={getName(product)}
            level={getLevel(product)}
            price={getPrice(product)}
            stats={getStats(product)}
            selected={getName(selectedProduct) === getName(product)}
            onClick={() => onSelect(product)}
            onInfoClick={(e) => {
              e.stopPropagation();
              setSelectedForInfo(product);
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="rounded-full w-10 h-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="rounded-full w-10 h-10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Product Info Modal */}
      {selectedForInfo && (
        <ProductInfo
          product={selectedForInfo}
          onClose={() => setSelectedForInfo(null)}
        />
      )}
    </div>
  );
};
