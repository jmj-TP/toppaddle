import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const handleOptions = [
  {
    name: "Straight",
    value: "Shakehand Straight",
    desc: "No taper, consistent thickness.",
    svg: (
      <svg viewBox="0 0 20 100" className="h-16 w-4">
        <rect x="6" y="0" width="8" height="100" rx="2" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "Straight Incline",
    value: "Classic Shakehand",
    desc: "Slight taper, more grip stability.",
    svg: (
      <svg viewBox="0 0 20 100" className="h-16 w-4">
        <polygon points="6,0 14,0 10,100 10,100" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "Anatomic",
    value: "Penhold",
    desc: "Curved to fit palm, very secure.",
    svg: (
      <svg viewBox="0 0 20 100" className="h-16 w-4">
        <path d="M7 0 h6 v30 q2 10 -2 20 q4 10 -2 20 v30 h-6z" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "Flared",
    value: "Shakehand Flared",
    desc: "Wider at bottom, most popular choice.",
    svg: (
      <svg viewBox="0 0 20 100" className="h-16 w-4">
        <path d="M8 0 h4 v70 q4 10 -4 30 q-8 -20 -4 -30 v-70z" fill="currentColor" />
      </svg>
    )
  }
];

interface HandleSelectorProps {
  onSelect: (value: string) => void;
}

export default function HandleSelector({ onSelect }: HandleSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelection = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <h2 className="text-xl font-semibold text-foreground">Choose Your Handle Type</h2>
      <TooltipProvider>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl">
          {handleOptions.map((handle) => (
            <Tooltip key={handle.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleSelection(handle.value)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    selected === handle.value
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-foreground">{handle.svg}</div>
                  <span className="text-sm font-medium text-foreground">{handle.name}</span>
                  {handle.name === "Flared" && (
                    <span className="text-xs text-primary font-medium">Most Popular</span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{handle.desc}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
