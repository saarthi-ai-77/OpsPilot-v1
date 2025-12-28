import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart3, Clock, Users, CheckCircle, Shield, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/logo.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <img src={logo} alt="OpsPilot Logo" className="h-8 w-8 object-contain" />
            <span>OpsPilot</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <img src={logo} alt="OpsPilot" className="h-20 w-20 object-contain" />
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Streamline Your Team's <span className="text-primary">Daily Operations</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            OpsPilot helps small teams track daily progress, identify blockers, and get AI-powered insights 
            to keep projects moving forward.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link to="/login" className="gap-2">
                Start Tracking <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything You Need for Daily Ops
            </h2>
            <p className="text-muted-foreground">
              Simple yet powerful tools to keep your team aligned and productive.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Daily Updates</h3>
                <p className="text-muted-foreground">
                  Quick and easy daily check-ins. Team members submit updates in under 2 minutes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <BarChart3 className="h-6 w-6 text-success" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI Summaries</h3>
                <p className="text-muted-foreground">
                  Get intelligent daily summaries that highlight key progress and potential issues.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <Users className="h-6 w-6 text-warning" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Team Visibility</h3>
                <p className="text-muted-foreground">
                  Managers get full visibility into team progress without micromanaging.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-danger/10">
                  <Shield className="h-6 w-6 text-danger" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Blocker Tracking</h3>
                <p className="text-muted-foreground">
                  Identify and address blockers before they derail your projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Confidence Levels</h3>
                <p className="text-muted-foreground">
                  Track team confidence to spot potential issues early and provide support.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Simple & Fast</h3>
                <p className="text-muted-foreground">
                  No complex setup. Get your team up and running in minutes, not days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Streamline Your Operations?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join teams who've simplified their daily standups and status updates.
          </p>
          <Button size="lg" asChild>
            <Link to="/login" className="gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <img src={logo} alt="OpsPilot" className="h-6 w-6 object-contain" />
            <span className="font-semibold">OpsPilot</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OpsPilot. Built for teams that ship.
          </p>
        </div>
      </footer>
    </div>
  );
}
