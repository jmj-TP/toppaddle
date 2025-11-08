import { useState } from 'react';
import { useTrainingStore } from '@/stores/trainingStore';
import { CustomStroke, CATEGORY_LABELS, StrokeCategory } from '@/types/strokes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SplitManager } from './SplitManager';
import { LevelBadge } from './LevelBadge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export const StrokeManager = () => {
  const customStrokes = useTrainingStore((state) => state.customStrokes);
  const playerRating = useTrainingStore((state) => state.playerRating);
  const addCustomStroke = useTrainingStore((state) => state.addCustomStroke);
  const deleteCustomStroke = useTrainingStore((state) => state.deleteCustomStroke);
  const [expandedStrokes, setExpandedStrokes] = useState<Set<string>>(new Set());

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<StrokeCategory>('forehand');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your stroke.',
        variant: 'destructive',
      });
      return;
    }

    addCustomStroke({
      name: name.trim(),
      category,
      description: description.trim() || undefined,
      splits: [],
    });

    toast({
      title: 'Stroke added! 🎯',
      description: `${name} has been added to your portfolio.`,
    });

    setName('');
    setDescription('');
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    deleteCustomStroke(id);
    toast({
      title: 'Stroke removed',
      description: `${name} has been removed from your portfolio.`,
    });
  };

  const toggleStroke = (strokeId: string) => {
    setExpandedStrokes((prev) => {
      const next = new Set(prev);
      if (next.has(strokeId)) {
        next.delete(strokeId);
      } else {
        next.add(strokeId);
      }
      return next;
    });
  };

  const groupedStrokes = customStrokes.reduce((acc, stroke) => {
    if (!acc[stroke.category]) acc[stroke.category] = [];
    acc[stroke.category].push(stroke);
    return acc;
  }, {} as Record<StrokeCategory, CustomStroke[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">My Stroke Portfolio</h3>
          <p className="text-sm text-muted-foreground">
            Create custom strokes to track in your check-ins
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Stroke
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Stroke</DialogTitle>
              <DialogDescription>
                Create a new stroke to track in your training sessions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stroke-name">Stroke Name *</Label>
                <Input
                  id="stroke-name"
                  placeholder="e.g., Pendulum Serve, Banana Flick"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(val) => setCategory(val as StrokeCategory)}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add notes about this stroke..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Add Stroke
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {customStrokes.length === 0 ? (
        <GlassCard>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No custom strokes yet. Add your first stroke to start tracking!
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Stroke
            </Button>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
            const strokes = groupedStrokes[cat as StrokeCategory] || [];
            if (strokes.length === 0) return null;

            return (
              <div key={cat}>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                  {label}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {strokes.map((stroke) => (
                    <GlassCard key={stroke.id}>
                      <Collapsible
                        open={expandedStrokes.has(stroke.id)}
                        onOpenChange={() => toggleStroke(stroke.id)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium truncate">{stroke.name}</h5>
                                <LevelBadge level={stroke.level} playerRating={playerRating} size="sm" />
                              </div>
                              {stroke.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {stroke.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {stroke.splits.length} technique detail{stroke.splits.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform ${
                                      expandedStrokes.has(stroke.id) ? 'rotate-180' : ''
                                    }`}
                                  />
                                </Button>
                              </CollapsibleTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(stroke.id, stroke.name)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <CollapsibleContent>
                            <div className="pt-3 border-t border-border">
                              <SplitManager stroke={stroke} />
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    </GlassCard>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
