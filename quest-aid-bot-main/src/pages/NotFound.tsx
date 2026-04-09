import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background gradient-hero">
      <div className="text-center space-y-6 animate-slide-up px-4">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Oops! Looks like you've wandered into uncharted territory. Let's get you back on track.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="gradient-primary text-white rounded-full" asChild>
            <a href="/">
              <Home className="mr-2 w-5 h-5" />
              Back to Home
            </a>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full" asChild>
            <a href="/">
              <Search className="mr-2 w-5 h-5" />
              Explore Features
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
