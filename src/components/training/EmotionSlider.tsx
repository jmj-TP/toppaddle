import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface EmotionSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

const EMOTION_LABELS = [
  { value: 1, label: 'Holding racket for first time', emoji: '🫣' },
  { value: 2, label: 'Struggling', emoji: '😰' },
  { value: 3, label: 'Below average', emoji: '😐' },
  { value: 4, label: 'Solid performance', emoji: '💪' },
  { value: 5, label: 'Good session', emoji: '😊' },
  { value: 6, label: 'Excellent!', emoji: '🔥' },
  { value: 7, label: 'Playing like Fan Zhendong', emoji: '🏆' },
];

export const EmotionSlider = ({
  value,
  onChange,
  label,
  min = 1,
  max = 7,
}: EmotionSliderProps) => {
  const currentEmotion = EMOTION_LABELS.find((e) => e.value === value) || EMOTION_LABELS[3];

  const getGradientColor = (val: number) => {
    if (val <= 2) return 'from-red-500 to-red-400';
    if (val <= 4) return 'from-yellow-500 to-yellow-400';
    if (val <= 5) return 'from-green-400 to-green-500';
    return 'from-green-500 to-emerald-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentEmotion.emoji}</span>
          <span className="text-sm text-muted-foreground">{currentEmotion.label}</span>
        </div>
      </div>
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          min={min}
          max={max}
          step={1}
          className={cn('w-full')}
        />
        <div
          className={cn(
            'absolute top-0 left-0 h-2 rounded-full -z-10 transition-all duration-300 bg-gradient-to-r',
            getGradientColor(value)
          )}
          style={{
            width: `${((value - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
