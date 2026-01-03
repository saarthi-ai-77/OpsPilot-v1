import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getSession, isAuthenticated } from '@/lib/auth';
import { submitUpdate } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { UpdateForm } from '@/components/UpdateForm';
import { CheckCircle2, Send } from 'lucide-react';

export default function SubmitUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Memoize session to prevent unnecessary re-renders
  const session = useMemo(() => getSession(), []);

  // Auth guard - runs once on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (data: {
    workDone: string;
    blockers: string;
    confidence: 'Low' | 'Medium' | 'High';
  }) => {
    if (!session) return;

    setIsLoading(true);

    try {
      const result = await submitUpdate({
        member_id: session.member_id,
        team_id: session.team_id,
        work_done: data.workDone,
        blockers: data.blockers,
        confidence: data.confidence,
      });

      if (result.success) {
        setSubmitted(true);
        toast({
          title: 'Update Submitted!',
          description: 'Your daily update has been successfully sent.',
        });
      } else {
        toast({
          title: 'Submission Failed',
          description: result.message || 'There was an error submitting your update.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Network Error',
        description: 'Could not connect to the server. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Early return if not authenticated
  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl py-8">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Daily Standup
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
            Keep your team in the loop. Tell us what's happening.
          </p>
        </div>

        {submitted ? (
          <Alert className="border-green-500/50 bg-green-500/5 dark:bg-green-500/10 py-6">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-400 text-lg font-bold">Success!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300 mt-2">
              Your update for today has been recorded. Your manager will see it in the daily summary.
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="shadow-xl border-t-4 border-t-blue-600">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-xl">What's your status today?</CardTitle>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Briefly share your progress and any hurdles you're facing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateForm onSubmit={handleSubmit} isLoading={isLoading} />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
