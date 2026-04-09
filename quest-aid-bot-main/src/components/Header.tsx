import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, Zap, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface HeaderProps {
  user?: {
    name: string;
    xp: number;
    level: number;
    streak: number;
  };
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            StudyBuddy
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/achievements">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold">{user.xp} XP</span>
                </div>
              </Link>
              <Link to="/achievements">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Level {user.level}</span>
                </div>
              </Link>
              <Link to="/achievements">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 hover:bg-warning/20 transition-colors cursor-pointer">
                  <span className="text-lg">🔥</span>
                  <span className="text-sm font-semibold">{user.streak} day streak</span>
                </div>
              </Link>
            </div>
            <Link to="/profile">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold hover:shadow-glow transition-shadow cursor-pointer">
                {user.name[0].toUpperCase()}
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="gradient-primary text-white rounded-full hover:shadow-glow transition-smooth">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
