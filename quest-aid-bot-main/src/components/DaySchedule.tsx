import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Lock, Clock, Bell } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// 1. Define the shape of the session data we expect from the parent
interface DayTask {
  id: number;
  date: string;
  topic_title: string;
  // We'll calculate duration and completion status
}

interface DayScheduleProps {
  planId: string;
  subject: string;
  sessions: DayTask[]; // <-- Receive sessions as a prop
}

// Helper to format session duration (we'll make it static for now)
const getDuration = (index: number) => {
  return 45 + (index % 3) * 5; // e.g., 45, 50, 55
}

export const DaySchedule = ({ planId, subject, sessions }: DayScheduleProps) => {
  const navigate = useNavigate();
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [completedStatus, setCompletedStatus] = useState<Record<string, boolean>>({});
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // 2. Load completion status from localStorage
    // In a real app, this would also come from the API
    const savedProgress = JSON.parse(localStorage.getItem(`schedule_progress_${planId}`) || '{}');
    setCompletedStatus(savedProgress);

    // Check if reminders are enabled
    const remindersPref = localStorage.getItem(`reminders_${planId}`);
    setRemindersEnabled(remindersPref === 'true');
  }, [planId]);

  const enableReminders = async () => {
    // (This function remains the same as your original)
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem(`reminders_${planId}`, 'true');
        setRemindersEnabled(true);
        
        sessions.forEach((task) => {
          if (!completedStatus[task.date] && task.date >= today) {
            const taskTime = new Date(task.date);
            taskTime.setHours(9, 0, 0, 0); // Set reminder for 9 AM
            
            const now = new Date();
            const timeUntilReminder = taskTime.getTime() - now.getTime();
            
            if (timeUntilReminder > 0) {
              setTimeout(() => {
                new Notification('Study Reminder', {
                  body: `Time to study: ${task.topic_title}`,
                  icon: '/favicon.ico'
                });
              }, timeUntilReminder);
            }
          }
        });
        
        toast.success("Study reminders enabled! You'll be notified at 9 AM each day.");
      } else {
        toast.error("Please enable notifications in your browser settings.");
      }
    } else {
      toast.error("Notifications not supported in this browser.");
    }
  };

  const handleStartDay = (task: DayTask, dayNumber: number) => {
    const isToday = task.date === today;
    const isPast = task.date < today;

    if (isPast && !completedStatus[task.date]) {
      toast.error("This day has passed. Focus on today's task!");
      return;
    }

    if (completedStatus[task.date]) {
      toast.info("You've already completed this day! Feel free to review.");
    }

    // 3. Navigate to the new day-specific study page
    navigate(`/session/day?plan=${planId}&subject=${encodeURIComponent(subject)}&date=${task.date}&dayNumber=${dayNumber}`);
  };
  
  // 4. Calculate progress from real data
  const completedDays = sessions.filter(s => s.date < today).length;
  const progressPercentage = (completedDays / sessions.length) * 100;

  return (
    <Card className="p-8 gradient-card">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-2xl font-bold">{sessions.length}-Day Study Schedule</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 text-secondary border-secondary/20">
              <Calendar className="w-3.5 h-3.5" />
              {completedDays}/{sessions.length} Days Completed
            </Badge>
            {!remindersEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={enableReminders}
                className="flex items-center gap-1.5 hover-lift"
              >
                <Bell className="w-3.5 h-3.5" />
                Enable Reminders
              </Button>
            )}
          </div>
        </div>
        <Progress value={progressPercentage} className="mb-3 h-3" />
        <p className="text-sm text-muted-foreground">
          {progressPercentage.toFixed(0)}% Complete - Keep up the great work!
        </p>
      </div>

      <div className="space-y-4">
        {/* 5. Map over the sessions prop */}
        {sessions.map((task, index) => {
          const dayNumber = index + 1;
          const isToday = task.date === today;
          const isPast = task.date < today;
          const isCompleted = completedStatus[task.date] || isPast; // Mark past days as "completed" visually
          
          return (
            <Card
              key={task.id}
              className={`p-6 transition-smooth hover-lift ${
                isToday ? 'border-primary border-2 shadow-glow bg-primary/5' : ''
              } ${isCompleted && !isToday ? 'bg-success/5 border-success/20 opacity-70' : ''}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant={isToday ? "default" : "outline"}
                      className={isToday ? "bg-primary shadow-card" : ""}
                    >
                      Day {dayNumber}
                    </Badge>
                    {isToday && (
                      <Badge className="bg-accent/10 text-accent border-accent/20 animate-pulse">
                        Today
                      </Badge>
                    )}
                    {isCompleted && !isToday && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{task.topic_title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {getDuration(index)} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <Button
                  variant={isToday ? "default" : (isCompleted ? "outline" : "default")}
                  size="sm"
                  onClick={() => handleStartDay(task, dayNumber)}
                  className={isToday ? "gradient-primary shadow-glow" : ""}
                >
                  {isCompleted ? (isToday ? "Start" : "Review") : "Start"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};