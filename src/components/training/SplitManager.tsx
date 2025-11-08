import { useState } from 'react';
import { CustomStroke, TechniqueSplit } from '@/types/strokes';
import { useTrainingStore } from '@/stores/trainingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SplitManagerProps {
  stroke: CustomStroke;
}

export const SplitManager = ({ stroke }: SplitManagerProps) => {
  const updateCustomStroke = useTrainingStore((state) => state.updateCustomStroke);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for the technique detail.',
        variant: 'destructive',
      });
      return;
    }

    const newSplit: TechniqueSplit = {
      id: `split-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    updateCustomStroke(stroke.id, {
      splits: [...stroke.splits, newSplit],
    });

    toast({
      title: 'Detail added! ✨',
      description: `${name} has been added to ${stroke.name}.`,
    });

    setName('');
    setDescription('');
    setIsDialogOpen(false);
  };

  const handleDelete = (splitId: string, splitName: string) => {
    updateCustomStroke(stroke.id, {
      splits: stroke.splits.filter((s) => s.id !== splitId),
    });

    toast({
      title: 'Detail removed',
      description: `${splitName} has been removed.`,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-muted-foreground">Technique Details</h5>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-3 h-3 mr-1" />
              Add Detail
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Technique Detail</DialogTitle>
              <DialogDescription>
                Break down {stroke.name} into specific aspects to track
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="split-name">Detail Name *</Label>
                <Input
                  id="split-name"
                  placeholder="e.g., Stay Low, Use Wrist, Follow Through"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="split-description">Notes (Optional)</Label>
                <Textarea
                  id="split-description"
                  placeholder="Add specific notes about this aspect..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  maxLength={150}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Add Detail
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {stroke.splits.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          No technique details yet. Add details to track specific aspects.
        </p>
      ) : (
        <div className="space-y-2">
          {stroke.splits.map((split) => (
            <div
              key={split.id}
              className="flex items-start justify-between p-2 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{split.name}</p>
                {split.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{split.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(split.id, split.name)}
                className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
