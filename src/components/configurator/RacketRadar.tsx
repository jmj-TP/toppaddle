import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

interface RacketRadarProps {
  speed: number;
  spin: number;
  control: number;
  power: number;
  weight?: number;
  value?: number;
}

const RacketRadar = ({ speed, spin, control, power, weight, value }: RacketRadarProps) => {
  const [viewMode, setViewMode] = useState<"performance" | "weight" | "value">("performance");

  const performanceData = useMemo(() => [
    { stat: "Speed", value: speed, fullMark: 100 },
    { stat: "Spin", value: spin, fullMark: 100 },
    { stat: "Control", value: control, fullMark: 100 },
    { stat: "Power", value: power, fullMark: 100 },
  ], [speed, spin, control, power]);

  const weightData = useMemo(() => {
    if (!weight) return null;
    const ideal = 185; // Ideal weight in grams
    const score = Math.max(0, 100 - Math.abs(weight - ideal) / ideal * 100);
    return [
      { stat: "Weight", value: Math.round(score), fullMark: 100 },
      { stat: "Balance", value: Math.round(score * 0.9), fullMark: 100 },
      { stat: "Comfort", value: Math.round(score * 1.1), fullMark: 100 },
    ];
  }, [weight]);

  const valueData = useMemo(() => {
    if (!value) return null;
    const score = Math.min(100, (300 - value) / 3); // Lower price = higher value score
    return [
      { stat: "Value", value: Math.round(score), fullMark: 100 },
      { stat: "Quality", value: Math.round((speed + spin + control + power) / 4), fullMark: 100 },
      { stat: "Cost", value: Math.round(100 - score), fullMark: 100 },
    ];
  }, [value, speed, spin, control, power]);

  const currentData = viewMode === "weight" && weightData ? weightData :
                      viewMode === "value" && valueData ? valueData :
                      performanceData;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Card className="p-6 bg-card border-2 border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Racket Overview</h3>
        <div className="flex items-center gap-2">
          {weight && (
            <Button
              variant={viewMode === "weight" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("weight")}
              className="h-8 px-3 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Weight
            </Button>
          )}
          {value && (
            <Button
              variant={viewMode === "value" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("value")}
              className="h-8 px-3 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Value
            </Button>
          )}
          <Button
            variant={viewMode === "performance" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("performance")}
            className="h-8 px-3 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Performance
          </Button>
        </div>
      </div>

      <motion.div
        key={viewMode}
        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-[300px] sm:h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={currentData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="stat" 
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <Radar
              name="Stats"
              dataKey="value"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.3}
              strokeWidth={2}
              animationDuration={prefersReducedMotion ? 0 : 500}
              animationEasing="ease-in-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
};

export default RacketRadar;
