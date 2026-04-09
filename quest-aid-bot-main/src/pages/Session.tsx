import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DaySchedule } from "@/components/DaySchedule";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

// --- 1. Define the data structures from our backend ---
interface DailySession {
  id: number;
  plan_id: number;
  date: string;
  topic_title: string;
  topic_summary: string;
  learning_objectives: string[];
  youtube_links: any[] | null;
  quiz_data: any[] | null;
}

interface StudyPlan {
  id: number;
  subject: string;
  exam_date: string;
  daily_study_time: number;
  session_length: number;
  notes: string | null;
  daily_sessions: DailySession[];
}

export default function Session() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const planId = searchParams.get('plan');
  
  useEffect(() => {
    if (!planId) {
      toast.error("No plan ID provided.");
      navigate("/active-plans");
      return;
    }

    // --- 2. Fetch the full plan details ---
    const fetchPlanDetails = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch(`/api/plans/${planId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch plan details.");
        }
        const planData: StudyPlan = await response.json();
        setPlan(planData);

        // --- 3. Calculate progress from real data ---
        if (planData.daily_sessions && planData.daily_sessions.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const completedDays = planData.daily_sessions.filter(s => s.date < today).length;
          setProgress(Math.floor((completedDays / planData.daily_sessions.length) * 100));
        }

      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanDetails();

  }, [planId, navigate]);

  // --- 4. Add Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 flex justify-center items-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // --- 5. Add Empty State ---
  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
           <h1 className="text-2xl font-bold">Plan not found</h1>
           <Button onClick={() => navigate('/active-plans')} className="mt-4">Back to Plans</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // --- 6. Use real plan data in JSX ---
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 animate-fade-in">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/active-plans')} // Go back to the plans list
            className="mb-8 hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Plans
          </Button>

          <div className="mb-8 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {plan.subject}
            </h1>
            <p className="text-muted-foreground text-lg">
              Exam Date: {new Date(plan.exam_date).toLocaleDateString()}
            </p>
          </div>

          {/* Progress Section */}
          <Card className="p-8 mb-8 gradient-card border-primary/10 hover-lift animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Your Progress</h3>
              <Badge className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
                <Trophy className="w-4 h-4" />
                {progress.toFixed(0)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="mb-3 h-3" />
            <p className="text-sm text-muted-foreground">
              Keep going! Complete all days to finish this plan.
            </p>
          </Card>

          <div className="animate-slide-up">
            <DaySchedule 
              planId={plan.id.toString()}
              subject={plan.subject}
              sessions={plan.daily_sessions} // <-- Pass the real sessions
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}