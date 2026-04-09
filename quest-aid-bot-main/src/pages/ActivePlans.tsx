import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Plus, BookOpen, Clock, Target, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

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


export default function ActivePlans() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch('/api/plans/');
        if (!response.ok) {
          throw new Error('Failed to fetch study plans');
        }
        const data: StudyPlan[] = await response.json();
        setPlans(data);
      } catch (error: any) {
        toast.error(error.message || "Could not load plans.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const user = authUser ? {
    name: authUser.username,
    xp: 1250,
    level: 5,
    streak: 7,
  } : undefined;

  // --- 4. Helper functions to read the new data structure ---
  const getNextSession = (plan: StudyPlan) => {
    const today = new Date().toISOString().split('T')[0];
    // Find the first session that is on or after today
    return plan.daily_sessions.find(session => session.date >= today) || plan.daily_sessions[0];
  };

  const getProgress = (plan: StudyPlan) => {
    if (!plan.daily_sessions || plan.daily_sessions.length === 0) {
      return 0;
    }
    const today = new Date().toISOString().split('T')[0];
    // Count sessions that are before today
    const completedSessions = plan.daily_sessions.filter(s => s.date < today).length;
    return Math.floor((completedSessions / plan.daily_sessions.length) * 100);
  };

  const totalSessions = plans.reduce((acc, plan) => acc + (plan.daily_sessions?.length || 0), 0);
  const avgProgress = plans.length > 0
    ? Math.round(plans.reduce((acc, plan) => acc + getProgress(plan), 0) / plans.length)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Active Study Plans</h1>
              <p className="text-muted-foreground">Manage all your study plans in one place</p>
            </div>
            <Button 
              onClick={() => navigate("/create-plan")}
              className="gradient-primary text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Plan
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{plans.length}</div>
              <div className="text-sm text-muted-foreground">Active Plans</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {totalSessions}
              </div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {avgProgress}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Progress</div>
            </Card>
          </div>

          {/* --- 5. Add Loading and Empty States --- */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : plans.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Active Plans</h3>
              <p className="text-muted-foreground mb-6">
                Create your first study plan to get started
              </p>
              <Button 
                onClick={() => navigate("/create-plan")}
                className="gradient-primary text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Plan
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* --- 6. Map over real plan data and use backend properties --- */}
              {plans.map((plan) => {
                // Use backend data structure: exam_date
                const daysUntil = Math.max(0, Math.ceil(
                  (new Date(plan.exam_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                ));
                
                const nextSession = getNextSession(plan);
                const progress = getProgress(plan);
                
                return (
                  <Card key={plan.id} className="p-6 hover:shadow-elegant transition-smooth">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Plan Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{plan.subject}</h3>
                            <p className="text-muted-foreground">
                              {/* Use exam_date */}
                              Exam: {new Date(plan.exam_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                            {daysUntil}d left
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Topics</div>
                            {/* Use daily_sessions.length */}
                            <div className="font-semibold">{plan.daily_sessions?.length || 0}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Sessions</div>
                            {/* Use daily_sessions.length */}
                            <div className="font-semibold">{plan.daily_sessions?.length || 0}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Daily Time</div>
                            {/* Use daily_study_time */}
                            <div className="font-semibold">{plan.daily_study_time || 0}m</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Resources</div>
                            {/* We will implement this later */}
                            <div className="font-semibold">{0} files</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className="font-semibold">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {nextSession && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="text-sm text-muted-foreground mb-1">Next Session</div>
                            {/* Use topic_title */}
                            <div className="font-semibold">{nextSession.topic_title}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(nextSession.date).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 lg:w-48">
                        <Button 
                          // Updated navigation to go to the Session page
                          onClick={() => navigate(`/session?plan=${plan.id}&subject=${encodeURIComponent(plan.subject)}`)}
                          className="w-full gradient-primary text-white group"
                        >
                          View Schedule
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/analytics?plan=${plan.id}`)}
                          className="w-full"
                        >
                          View Analytics
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {/* Edit plan logic here */}}
                          className="w-full"
                        >
                          Edit Plan
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}