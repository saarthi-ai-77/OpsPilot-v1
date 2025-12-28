import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, LayoutDashboard } from 'lucide-react';
import { getUser, logout } from '@/lib/auth';
import { ThemeToggle } from './ThemeToggle';
import logo from '@/assets/logo.png';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <img src={logo} alt="OpsPilot Logo" className="h-6 w-6 object-contain" />
            <span>OpsPilot</span>
          </Link>

          {user && (
            <nav className="flex items-center gap-1">
              <Button
                variant={isActive('/submit') ? 'secondary' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/submit" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Submit</span>
                </Link>
              </Button>

              {user.isManager && (
                <Button
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                </Button>
              )}

              <ThemeToggle />

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </nav>
          )}

          {!user && <ThemeToggle />}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
