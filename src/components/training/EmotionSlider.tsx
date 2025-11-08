import { Slider } from '@/components/ui/slider';
import { getEmotionLabel } from '@/types/strokes';

interface EmotionSliderProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export const EmotionSlider = ({ value, onChange, max = 100 }: EmotionSliderProps) => {
  return (
    <div className="space-y-2">
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={1}
        max={max}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>1</span>
        <div className="flex flex-col items-center">
          <span className="text-center font-medium text-foreground">{value}</span>
          <span className="text-center text-xs">{getEmotionLabel(value)}</span>
        </div>
        <span>{max}</span>
      </div>
    </div>
  );
};
