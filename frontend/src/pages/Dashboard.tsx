import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { getSession, isAuthenticated, logout } from '@/lib/auth';
import { getSummary } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { CalendarIcon, LogOut, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [summaryText, setSummaryText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Memoize session to prevent infinite re-renders
  // Only recalculate if localStorage actually changes
  const session = useMemo(() => getSession(), []);
  const teamId = session?.team_id;
  const isManager = session?.role === 'manager';

  // Auth guard - runs once on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    if (!isManager) {
      navigate('/submit', { replace: true });
    }
  }, [navigate, isManager]);

  // Fetch summary when date changes - use primitive teamId, not the session object
  useEffect(() => {
    const loadSummary = async () => {
      if (!teamId) return;
      setIsLoading(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const data = await getSummary(teamId, dateStr);
        setSummaryText(data.summary || '');
      } catch (error) {
        console.error('Error loading summary:', error);
        setSummaryText('');
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [selectedDate, teamId]);

  // Early return if not authenticated or not a manager
  if (!session || !isManager) {
    return null;
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl py-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b pb-8 border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Manager Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
              AI-generated daily performance summaries for your team.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[260px] h-11 justify-start text-left font-semibold border-2 hover:border-blue-500 transition-colors',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
                  {selectedDate ? format(selectedDate, 'PPPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              className="h-11 px-4 text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:bg-red-900/20 font-medium"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex gap-4">
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        ) : summaryText ? (
          <Card className="shadow-2xl border-none overflow-hidden bg-white dark:bg-slate-800">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 py-6">
              <div className="flex items-center space-x-2">
                <Info className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Team Summary - {format(selectedDate, 'MMM d, yyyy')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
              <div
                className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 text-lg"
                dangerouslySetInnerHTML={{ __html: summaryText.replace(/\n/g, '<br />') }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="bg-white dark:bg-slate-700 p-4 rounded-full shadow-sm mb-4">
              <CalendarIcon className="h-12 w-12 text-slate-300 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No summary generated</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs text-center">
              Our AI hasn't processed the updates for this date yet, or no updates were submitted.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
