import { Gauge, Target, Shield, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Blade, Rubber } from "@/data/products";

interface ComponentStatsCardProps {
  component: Blade | Rubber | null;
  type: "blade" | "rubber";
}

const ComponentStatsCard = ({ component, type }: ComponentStatsCardProps) => {
  if (!component) {
    return (
      <Card className="p-4 mt-2 bg-muted/50">
        <p className="text-sm text-muted-foreground text-center">No component selected</p>
      </Card>
    );
  }

  const StatBar = ({ label, value, Icon }: { label: string; value: number; Icon: any }) => (
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <span className="text-xs font-medium min-w-[50px]">{label}:</span>
      <div className="flex-1 bg-muted dark:bg-secondary/30 rounded-full h-1.5">
        <div 
          className="bg-primary dark:bg-accent rounded-full h-1.5 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold min-w-[25px]">{value}</span>
    </div>
  );

  const stats = type === "blade" 
    ? {
        speed: (component as Blade).Blade_Speed,
        spin: (component as Blade).Blade_Spin,
        control: (component as Blade).Blade_Control,
        power: (component as Blade).Blade_Power,
      }
    : {
        speed: (component as Rubber).Rubber_Speed,
        spin: (component as Rubber).Rubber_Spin,
        control: (component as Rubber).Rubber_Control,
        power: (component as Rubber).Rubber_Power,
      };

  return (
    <Card className="p-3 mt-2 bg-card backdrop-blur-sm border-2 border-border">
      <div className="space-y-1">
        <StatBar label="Speed" value={stats.speed} Icon={Gauge} />
        <StatBar label="Spin" value={stats.spin} Icon={Target} />
        <StatBar label="Control" value={stats.control} Icon={Shield} />
        <StatBar label="Power" value={stats.power} Icon={Star} />
      </div>
    </Card>
  );
};

export default ComponentStatsCard;
