import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { login, isAuthenticated } from '@/lib/auth';
import { Layout } from '@/components/Layout';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/submit', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: 'Required Fields',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const result = await login(email.trim(), password.trim());

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in.',
      });
      // Force full page reload to ensure route guards re-evaluate with fresh session
      window.location.href = '/submit';
    } else {
      toast({
        title: 'Sign In Failed',
        description: result.error || 'Invalid credentials.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  // Don't render if already authenticated (prevents flash)
  if (isAuthenticated()) {
    return null;
  }

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-lg">
            Sign in to manage your daily operations
          </p>
        </div>

        <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl p-4">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 group transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
          First time here? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Create an account</Link>
        </div>
      </div>
    </Layout>
  );
}
