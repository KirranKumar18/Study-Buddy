import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlanCardProps {
  id: string;
  subject: string;
  examDate: string;
  progress: number;
  nextSession?: {
    topic: string;
    date: string;
    time?: string;
  };
  totalSessions: number;
  sessionsCompleted?: number;
}

export const PlanCard = ({ id, subject, examDate, progress, nextSession, totalSessions, sessionsCompleted }: PlanCardProps) => {
  const navigate = useNavigate();
  const daysUntilExam = Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleStartSession = () => {
    // Update study hours
    const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
      totalStudyHours: 0,
      questionsAnswered: 0,
      averageScore: 0,
      activePlans: 0
    }));
    
    // Navigate to session
    navigate(`/session?plan=${id}&subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(nextSession?.topic || 'Introduction')}`);
  };

  return (
    <Card className="p-6 hover:shadow-elegant transition-smooth group cursor-pointer">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">{subject}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{daysUntilExam} days until exam</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            progress < 30 ? 'bg-destructive/10 text-destructive' :
            progress < 70 ? 'bg-warning/10 text-warning' :
            'bg-success/10 text-success'
          }`}>
            {progress}% Complete
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{sessionsCompleted || 0} / {totalSessions} sessions</span>
          </div>
        </div>

        {nextSession && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">NEXT SESSION</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{nextSession.topic}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{nextSession.date}{nextSession.time ? ` at ${nextSession.time}` : ''}</span>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={handleStartSession}
                className="gradient-primary text-white rounded-full group-hover:shadow-glow transition-smooth"
              >
                Start
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
