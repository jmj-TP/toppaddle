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
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const StrokeManager = () => {
  const customStrokes = useTrainingStore((state) => state.customStrokes);
  const addCustomStroke = useTrainingStore((state) => state.addCustomStroke);
  const deleteCustomStroke = useTrainingStore((state) => state.deleteCustomStroke);

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {strokes.map((stroke) => (
                    <GlassCard key={stroke.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium truncate">{stroke.name}</h5>
                          {stroke.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {stroke.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(stroke.id, stroke.name)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
