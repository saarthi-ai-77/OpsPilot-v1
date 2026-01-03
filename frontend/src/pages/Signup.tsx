import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { signUpManager, signUpMember, isAuthenticated } from '@/lib/auth';
import { Layout } from '@/components/Layout';
import { Loader2, ArrowRight, Building2, Users2, ShieldCheck } from 'lucide-react';

export default function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('create');
    const navigate = useNavigate();
    const { toast } = useToast();

    // Form states
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        teamName: '',
        teamId: ''
    });

    // Redirect authenticated users away from signup page
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/submit', { replace: true });
        }
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password || !formData.teamName) {
            toast({ title: 'Missing Fields', description: 'Please fill in all fields.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        const result = await signUpManager(formData.email, formData.password, formData.fullName, formData.teamName);

        if (result.success) {
            toast({ title: 'Success!', description: 'Team created. Please check your email to confirm, then login.' });
            navigate('/login');
        } else {
            toast({ title: 'Signup Failed', description: result.error || 'Could not create team.', variant: 'destructive' });
        }
        setIsLoading(false);
    };

    const handleJoinTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password || !formData.teamId) {
            toast({ title: 'Missing Fields', description: 'Please fill in all fields.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        const result = await signUpMember(formData.email, formData.password, formData.fullName, formData.teamId);

        if (result.success) {
            toast({ title: 'Success!', description: 'Joined team. Please check your email to confirm, then login.' });
            navigate('/login');
        } else {
            toast({ title: 'Signup Failed', description: result.error || 'Could not join team.', variant: 'destructive' });
        }
        setIsLoading(false);
    };

    // Don't render if already authenticated (prevents flash)
    if (isAuthenticated()) {
        return null;
    }

    return (
        <Layout>
            <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center py-12 px-4">
                <div className="w-full max-w-xl">
                    <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 h-20 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8">
                            <TabsTrigger
                                value="create"
                                className="rounded-xl flex flex-col gap-1 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
                            >
                                <Building2 className="h-5 w-5" />
                                <span className="font-bold">Create Team</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="join"
                                className="rounded-xl flex flex-col gap-1 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
                            >
                                <Users2 className="h-5 w-5" />
                                <span className="font-bold">Join Team</span>
                            </TabsTrigger>
                        </TabsList>

                        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden relative">
                            <div className="absolute top-4 right-4 text-indigo-500 opacity-20">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <CardContent className="p-8">
                                <TabsContent value="create" className="mt-0">
                                    <form onSubmit={handleCreateTeam} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-sm font-semibold ml-1">Full Name</Label>
                                            <Input id="fullName" placeholder="John Doe" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" value={formData.fullName} onChange={handleInputChange} disabled={isLoading} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold ml-1">Work Email</Label>
                                            <Input id="email" type="email" placeholder="name@company.com" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" value={formData.email} onChange={handleInputChange} disabled={isLoading} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm font-semibold ml-1">Password</Label>
                                            <Input id="password" type="password" placeholder="Min. 6 characters" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" value={formData.password} onChange={handleInputChange} disabled={isLoading} required minLength={6} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="teamName" className="text-sm font-semibold ml-1">Team Name</Label>
                                            <Input id="teamName" placeholder="e.g. Engineering Dept" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" value={formData.teamName} onChange={handleInputChange} disabled={isLoading} required />
                                        </div>
                                        <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg mt-4 group" disabled={isLoading}>
                                            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : <>Launch My Team <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="join" className="mt-0">
                                    <form onSubmit={handleJoinTeam} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-sm font-semibold ml-1">Full Name</Label>
                                            <Input id="fullName" placeholder="John Doe" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" value={formData.fullName} onChange={handleInputChange} disabled={isLoading} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold ml-1">Work Email</Label>
                                            <Input id="email" type="email" placeholder="name@company.com" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" value={formData.email} onChange={handleInputChange} disabled={isLoading} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm font-semibold ml-1">Password</Label>
                                            <Input id="password" type="password" placeholder="Min. 6 characters" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" value={formData.password} onChange={handleInputChange} disabled={isLoading} required minLength={6} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="teamId" className="text-sm font-semibold ml-1">Unique Team ID</Label>
                                            <Input id="teamId" placeholder="Paste shared verification code" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm" value={formData.teamId} onChange={handleInputChange} disabled={isLoading} required />
                                        </div>
                                        <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg mt-4 group" disabled={isLoading}>
                                            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : <>Complete Registration <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </CardContent>
                        </Card>
                    </Tabs>

                    <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
                        Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Sign in</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
