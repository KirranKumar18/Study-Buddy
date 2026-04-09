import { useState, useEffect } from "react";
import { StatCard } from "./StatCard";
import { PlanCard } from "./PlanCard";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, CheckCircle, Plus, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([
    { icon: Clock, label: "Study Hours", value: "0h", trend: { value: "0%", positive: true } },
    { icon: CheckCircle, label: "Questions Answered", value: "0", trend: { value: "0%", positive: true } },
    { icon: TrendingUp, label: "Average Score", value: "0%", trend: { value: "0%", positive: true } },
    { icon: BookOpen, label: "Active Plans", value: "0" },
  ]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch('/api/plans/');
        
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        
        const apiPlans = await response.json();
        
        // Map backend data to frontend PlanCard format
        const mappedPlans = apiPlans.map((plan: any) => {
          const today = new Date().toISOString().split('T')[0];
          const completedDays = plan.daily_sessions?.filter((s: any) => s.date < today).length || 0;
          const totalSessions = plan.daily_sessions?.length || 0;
          const progress = totalSessions > 0 ? Math.floor((completedDays / totalSessions) * 100) : 0;
          
          return {
            id: plan.id,
            subject: plan.subject,
            examDate: plan.exam_date,
            topics: plan.daily_sessions?.map((s: any) => s.topic_title) || [],
            dailyMinutes: plan.daily_study_time,
            sessionLength: plan.session_length,
            progress,
            sessionsCompleted: completedDays,
            totalSessions,
            nextSession: {
              topic: plan.daily_sessions?.[0]?.topic_title || "First Session",
              date: plan.daily_sessions?.[0]?.date || plan.exam_date,
              time: "9:00 AM"
            }
          };
        });
        
        setPlans(mappedPlans);
        
        // Update stats from localStorage (quiz stats are stored locally)
        const userStats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
          totalStudyHours: 0,
          questionsAnswered: 0,
          averageScore: 0,
          activePlans: 0
        }));
        
        setStats([
          { icon: Clock, label: "Study Hours", value: `${userStats.totalStudyHours}h`, trend: { value: "12%", positive: true } },
          { icon: CheckCircle, label: "Questions Answered", value: userStats.questionsAnswered.toString(), trend: { value: "8%", positive: true } },
          { icon: TrendingUp, label: "Average Score", value: `${userStats.averageScore}%`, trend: { value: "5%", positive: true } },
          { icon: BookOpen, label: "Active Plans", value: mappedPlans.length.toString() },
        ]);
        
      } catch (error: any) {
        console.error("Failed to load plans:", error);
        toast.error("Failed to load study plans");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleStatClick = (label: string) => {
    switch(label) {
      case "Study Hours":
        navigate("/study-hours");
        break;
      case "Questions Answered":
        navigate("/questions-answered");
        break;
      case "Average Score":
        navigate("/average-score");
        break;
      case "Active Plans":
        navigate("/active-plans");
        break;
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.username || "Student"}! 👋</h1>
            <p className="text-muted-foreground text-lg">Let's continue your learning journey</p>
          </div>
          <Button 
            size="lg" 
            className="gradient-primary text-white rounded-full shadow-elegant hover:shadow-glow transition-smooth"
            onClick={() => navigate("/create-plan")}
          >
            <Plus className="mr-2 w-5 h-5" />
            Create New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="animate-scale-in cursor-pointer" 
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleStatClick(stat.label)}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Study Plans</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-border">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Study Plans Yet</h3>
              <p className="text-muted-foreground mb-6">Create your first study plan to get started</p>
              <Button onClick={() => navigate("/create-plan")} className="gradient-primary text-white">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div key={plan.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PlanCard {...plan} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
