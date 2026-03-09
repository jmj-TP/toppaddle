import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, LucideIcon } from "lucide-react";

interface StatBarProps {
    label: string;
    value: number;
    icon: LucideIcon;
    tooltip?: string;
}

export const StatBar = ({ label, value, icon: Icon, tooltip }: StatBarProps) => {
    return (
        <TooltipProvider delayDuration={100}>
            <div className="py-2 px-3 bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">
                            {label}
                        </span>
                        {tooltip && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="flex-shrink-0">
                                        <Info className="w-3 h-3 text-muted-foreground hover:text-accent transition-colors" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                    <p className="text-xs">{tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                    <span className="text-xs font-bold text-accent ml-auto">
                        {value}
                    </span>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)] rounded-full"
                        style={{ width: `${value}%` }}
                    />
                </div>
            </div>
        </TooltipProvider>
    );
};
