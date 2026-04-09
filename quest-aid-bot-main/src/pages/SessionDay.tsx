import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SessionQuiz } from "../components/SessionQuiz";
import { YouTubeVideoCard } from "../components/YouTubeVideoCard";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CheckCircle, ArrowLeft, BookOpen, Target, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

// --- 1. Define data structures from the backend ---
interface VideoLink {
  title: string;
  url: string;
  channel: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface Session {
  date: string;
  topic_title: string;
  topic_summary: string;
  learning_objectives: string[];
}

interface DailyContentResponse {
  session: Session;
  youtube_links: VideoLink[];
  quiz: QuizQuestion[];
}

export default function SessionDay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("study");
  const [videosWatched, setVideosWatched] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // --- 2. State for loading and API data ---
  const [dayData, setDayData] = useState<DailyContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get data from URL
  const dayNumber = searchParams.get('dayNumber') || '1';
  const planId = searchParams.get('plan') || '';
  const subject = searchParams.get('subject') || '';
  const date = searchParams.get('date') || '';

  // --- 3. Fetch data from the backend when page loads ---
  useEffect(() => {
    if (!planId || !date) {
      toast.error("Missing plan or date information.");
      navigate("/active-plans");
      return;
    }

    const fetchDayContent = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch(`/api/plans/${planId}/day/${date}`);
        if (!response.ok) {
          throw new Error("Failed to fetch session content.");
        }
        const data: DailyContentResponse = await response.json();
        setDayData(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDayContent();
  }, [planId, date, navigate]);


  const handleVideosComplete = () => {
    setVideosWatched(true);
    setActiveTab("quiz");
    toast.success("Great! Now complete the quiz to mark this day as finished.");
  };

  const handleQuizComplete = (score: number, totalMarks: number) => {
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

    if (percentage >= 75) {
      setQuizCompleted(true);
      toast.success(`🎉 Excellent! You scored ${percentage.toFixed(0)}%`);
    } else {
      toast.error(`You scored ${percentage.toFixed(0)}%. You need 75% or higher. Try again!`);
    }
  };

  const handleCompleteDay = () => {
    // 4. Update localStorage (we'll move this to the backend later)
    const progressKey = `schedule_progress_${planId}`;
    const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    savedProgress[date] = true;
    localStorage.setItem(progressKey, JSON.stringify(savedProgress));

    // Update study hours
    const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
      totalStudyHours: 0,
      questionsAnswered: 0,
      averageScore: 0,
      activePlans: 0
    }));
    stats.totalStudyHours = (stats.totalStudyHours || 0) + 0.75; // 45 minutes
    localStorage.setItem('userStats', JSON.stringify(stats));

    toast.success(`🎉 Day ${dayNumber} completed! Excellent work!`);
    
    setTimeout(() => {
      navigate(`/session?plan=${planId}&subject=${encodeURIComponent(subject)}`);
    }, 1500);
  };

  // --- 5. Show loading spinner ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 flex justify-center items-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading session...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // --- 6. Show error if data failed to load ---
  if (!dayData) {
     return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
           <h1 className="text-2xl font-bold">Session content not found.</h1>
           <Button onClick={() => navigate(`/session?plan=${planId}&subject=${encodeURIComponent(subject)}`)} className="mt-4">
             Back to Schedule
           </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // --- 7. Use real data in the component ---
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(`/session?plan=${planId}&subject=${encodeURIComponent(subject)}`)}
            className="mb-8 hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schedule
          </Button>

          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">Day {dayNumber}</Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1">
                {new Date(dayData.session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {dayData.session.topic_title}
            </h1>
            <p className="text-muted-foreground text-lg">{subject}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-slide-up">
            <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="study" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-card">
                <BookOpen className="w-4 h-4" />
                Study Content
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-card" disabled={!videosWatched}>
                <Target className="w-4 h-4" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="study" className="space-y-6 animate-scale-in">
              {/* Today's Focus - Use real data */}
              <Card className="p-8 gradient-card border-primary/10 hover-lift">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Today's Focus
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base mb-6">
                  {dayData.session.topic_summary}
                </p>

                <h4 className="font-semibold text-lg mb-3">Learning Objectives:</h4>
                <ul className="space-y-2">
                  {dayData.session.learning_objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{obj}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Study Videos */}
              <Card className="p-8 gradient-card hover-lift">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <ExternalLink className="w-6 h-6 text-secondary" />
                  Recommended Videos
                </h3>
                {dayData.youtube_links && dayData.youtube_links.length > 0 ? (
                  <div className="space-y-4">
                    {dayData.youtube_links.map((video, index) => (
                      <YouTubeVideoCard
                        key={index}
                        video={video}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground text-base mb-2">
                      No videos found for this topic.
                    </p>
                  </div>
                )}
              </Card>
              
              {!videosWatched && (
                <Card className="p-6 gradient-card border-accent/20 hover-lift animate-scale-in">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Ready for the quiz?</h3>
                      <p className="text-sm text-muted-foreground">
                        Make sure you've reviewed the content above
                      </p>
                    </div>
                    <Button onClick={handleVideosComplete} size="lg" className="gradient-primary shadow-glow">
                      I'm Ready
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="animate-scale-in">
              <SessionQuiz
                questions={dayData.quiz} // <-- Pass real quiz questions
                onQuizComplete={handleQuizComplete}
                minimumScore={75}
              />
            </TabsContent>
          </Tabs>

          {(videosWatched && quizCompleted) && (
            <Card className="p-8 mt-6 gradient-card border-success/20 shadow-elegant animate-scale-in">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center shadow-card">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-xl mb-2">Day {dayNumber} Complete!</h3>
                  <p className="text-muted-foreground">
                    Great job! You've finished today's study session.
                  </p>
                </div>
                <Button
                  onClick={handleCompleteDay}
                  size="lg"
                  className="gradient-primary shadow-glow hover-lift"
                >
                  Continue
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}