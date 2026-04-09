import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Zap, Flame, Star, Target, Award, TrendingUp } from "lucide-react";

const achievements = [
  { id: 1, name: "First Steps", description: "Complete your first study session", icon: Star, unlocked: true, xp: 50 },
  { id: 2, name: "Quiz Master", description: "Score 100% on any quiz", icon: Trophy, unlocked: true, xp: 100 },
  { id: 3, name: "Week Warrior", description: "Maintain a 7-day streak", icon: Flame, unlocked: true, xp: 150 },
  { id: 4, name: "Knowledge Seeker", description: "Complete 10 study sessions", icon: Target, unlocked: true, xp: 200 },
  { id: 5, name: "Marathon Runner", description: "Study for 50 hours total", icon: TrendingUp, unlocked: false, progress: 48, total: 50 },
  { id: 6, name: "Perfect Score", description: "Get 100% on 5 quizzes", icon: Award, unlocked: false, progress: 3, total: 5 },
  { id: 7, name: "Consistency King", description: "Maintain a 30-day streak", icon: Flame, unlocked: false, progress: 12, total: 30 },
  { id: 8, name: "Expert Level", description: "Reach level 15", icon: Zap, unlocked: false, progress: 8, total: 15 },
];

const streakHistory = [
  { date: "Nov 1", active: true },
  { date: "Nov 2", active: true },
  { date: "Nov 3", active: true },
  { date: "Nov 4", active: true },
  { date: "Nov 5", active: true },
  { date: "Nov 6", active: false },
  { date: "Nov 7", active: true },
  { date: "Nov 8", active: true },
];

const levelMilestones = [
  { level: 1, xp: 0, title: "Novice" },
  { level: 5, xp: 500, title: "Learner" },
  { level: 10, xp: 1500, title: "Scholar" },
  { level: 15, xp: 3000, title: "Expert" },
  { level: 20, xp: 5000, title: "Master" },
  { level: 25, xp: 8000, title: "Grandmaster" },
];

export default function Achievements() {
  const user = {
    name: "Alex",
    xp: 2450,
    level: 8,
    streak: 12,
  };

  const currentLevelXP = levelMilestones.find(m => m.level === user.level)?.xp || 0;
  const nextLevelXP = levelMilestones.find(m => m.level === user.level + 1)?.xp || 3000;
  const xpProgress = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Achievements & Progress</h1>
            <p className="text-muted-foreground text-lg">Track your learning milestones and rewards</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                  {user.level}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">Level {user.level}</h2>
                    <span className="text-sm text-muted-foreground">{user.xp} / {nextLevelXP} XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-3 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {nextLevelXP - user.xp} XP until level {user.level + 1}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent/10 rounded-xl">
                  <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">{user.xp}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-xl">
                  <Flame className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">{user.streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-xl">
                  <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-warning" />
                Streak Calendar
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {streakHistory.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold ${
                      day.active
                        ? "bg-warning text-warning-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day.date.split(" ")[1]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Keep studying daily to maintain your streak! 🔥
              </p>
            </Card>
          </div>

          <Tabs defaultValue="achievements" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="levels">Level System</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card
                      key={achievement.id}
                      className={`p-6 transition-all hover:shadow-lg ${
                        achievement.unlocked ? "border-primary/50" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                            achievement.unlocked
                              ? "gradient-primary"
                              : "bg-muted"
                          }`}
                        >
                          <Icon className={`w-8 h-8 ${achievement.unlocked ? "text-white" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold">{achievement.name}</h3>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                            {achievement.unlocked && (
                              <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                                +{achievement.xp} XP
                              </span>
                            )}
                          </div>
                          {!achievement.unlocked && achievement.progress !== undefined && (
                            <div className="space-y-1">
                              <Progress
                                value={(achievement.progress / achievement.total!) * 100}
                                className="h-2"
                              />
                              <p className="text-xs text-muted-foreground">
                                {achievement.progress} / {achievement.total}
                              </p>
                            </div>
                          )}
                          {achievement.unlocked && (
                            <div className="flex items-center gap-1 text-success text-sm font-semibold mt-2">
                              <Trophy className="w-4 h-4" />
                              Unlocked!
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="levels" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Level Progression</h3>
                <div className="space-y-6">
                  {levelMilestones.map((milestone, index) => (
                    <div key={milestone.level} className="relative">
                      {index !== levelMilestones.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
                      )}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg relative z-10 ${
                            user.level >= milestone.level
                              ? "gradient-primary text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {milestone.level}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold">{milestone.title}</h4>
                              <p className="text-sm text-muted-foreground">Level {milestone.level}</p>
                            </div>
                            <span className="text-sm font-semibold">{milestone.xp} XP</span>
                          </div>
                          {user.level === milestone.level && (
                            <div className="mt-2">
                              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                Current Level
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-accent/5">
                <h3 className="font-bold mb-2">How to Earn XP</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Complete study sessions: <span className="font-semibold text-foreground">25-50 XP</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Finish quizzes: <span className="font-semibold text-foreground">10-100 XP</span> (based on score)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Review flashcards: <span className="font-semibold text-foreground">5-15 XP</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Maintain streaks: <span className="font-semibold text-foreground">5 XP bonus every 3 days</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Unlock achievements: <span className="font-semibold text-foreground">50-200 XP</span></span>
                  </li>
                </ul>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
