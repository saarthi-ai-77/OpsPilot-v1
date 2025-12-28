import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import type { TeamSummary } from '@/lib/api';

interface SummaryCardProps {
  summary: TeamSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const confidenceColor = 
    summary.avgConfidence === 'High' ? 'bg-success text-success-foreground' :
    summary.avgConfidence === 'Medium' ? 'bg-warning text-warning-foreground' :
    summary.avgConfidence === 'Low' ? 'bg-destructive text-destructive-foreground' :
    'bg-muted text-muted-foreground';

  const formattedDate = new Date(summary.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{summary.teamName}</CardTitle>
          <Badge className={confidenceColor}>
            <TrendingUp className="mr-1 h-3 w-3" />
            {summary.avgConfidence} Confidence
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {summary.totalUpdates} update{summary.totalUpdates !== 1 ? 's' : ''}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
            {summary.summary}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
