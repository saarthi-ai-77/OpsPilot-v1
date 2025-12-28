import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface UpdateFormProps {
  onSubmit: (data: {
    workDone: string;
    blockers: string;
    confidence: 'Low' | 'Medium' | 'High';
  }) => Promise<void>;
  isLoading: boolean;
}

export function UpdateForm({ onSubmit, isLoading }: UpdateFormProps) {
  const [workDone, setWorkDone] = useState('');
  const [blockers, setBlockers] = useState('');
  const [confidence, setConfidence] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [errors, setErrors] = useState<{ workDone?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { workDone?: string } = {};
    if (workDone.trim().length < 10) {
      newErrors.workDone = 'Please describe your work in at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit({ workDone: workDone.trim(), blockers: blockers.trim(), confidence });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="workDone" className="text-sm font-medium">
          What did you work on today? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="workDone"
          placeholder="Describe what you accomplished today..."
          value={workDone}
          onChange={(e) => setWorkDone(e.target.value)}
          className="min-h-[120px] resize-none"
          disabled={isLoading}
        />
        {errors.workDone && (
          <p className="text-sm text-destructive">{errors.workDone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="blockers" className="text-sm font-medium">
          Any blockers?
        </Label>
        <Textarea
          id="blockers"
          placeholder="Describe any challenges or blockers (optional)..."
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          className="min-h-[80px] resize-none"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confidence" className="text-sm font-medium">
          Confidence Level
        </Label>
        <Select
          value={confidence}
          onValueChange={(v) => setConfidence(v as 'Low' | 'Medium' | 'High')}
          disabled={isLoading}
        >
          <SelectTrigger id="confidence" className="w-full">
            <SelectValue placeholder="Select confidence level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">🔴 Low</SelectItem>
            <SelectItem value="Medium">🟡 Medium</SelectItem>
            <SelectItem value="High">🟢 High</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          How confident are you about completing your current tasks?
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Update'
        )}
      </Button>
    </form>
  );
}
