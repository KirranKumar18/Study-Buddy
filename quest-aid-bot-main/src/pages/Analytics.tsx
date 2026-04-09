import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Clock, Target, Brain, BookOpen, CheckCircle } from "lucide-react";

const studyHoursData = [
  { date: "Nov 1", hours: 2.5, target: 2 },
  { date: "Nov 2", hours: 3, target: 2 },
  { date: "Nov 3", hours: 1.5, target: 2 },
  { date: "Nov 4", hours: 2.8, target: 2 },
  { date: "Nov 5", hours: 2.2, target: 2 },
  { date: "Nov 6", hours: 3.5, target: 2 },
  { date: "Nov 7", hours: 2.7, target: 2 },
];

const quizScoresData = [
  { subject: "Physics", score: 87 },
  { subject: "Math", score: 92 },
  { subject: "Chemistry", score: 78 },
  { subject: "Biology", score: 85 },
];

const topicMasteryData = [
  { topic: "Newton's Laws", mastery: 85, questions: 45 },
  { topic: "Calculus", mastery: 92, questions: 60 },
  { topic: "Organic Chemistry", mastery: 73, questions: 38 },
  { topic: "Genetics", mastery: 88, questions: 42 },
  { topic: "Thermodynamics", mastery: 65, questions: 30 },
];

const activityData = [
  { name: "Study Sessions", value: 45, color: "hsl(var(--primary))" },
  { name: "Quizzes", value: 32, color: "hsl(var(--accent))" },
  { name: "Reviews", value: 58, color: "hsl(var(--success))" },
];

const weeklyProgressData = [
  { week: "Week 1", completed: 12, planned: 15 },
  { week: "Week 2", completed: 14, planned: 15 },
  { week: "Week 3", completed: 13, planned: 15 },
  { week: "Week 4", completed: 15, planned: 15 },
];

export default function Analytics() {
  const user = {
    name: "Alex",
    xp: 2450,
    level: 8,
    streak: 12,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Progress Analytics</h1>
          <p className="text-muted-foreground text-lg">Track your learning journey and insights</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="mastery">Mastery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Study Time</p>
                    <p className="text-3xl font-bold mt-2">24.5h</p>
                    <p className="text-sm text-success font-semibold mt-1">↑ 12% this week</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Avg Quiz Score</p>
                    <p className="text-3xl font-bold mt-2">87%</p>
                    <p className="text-sm text-success font-semibold mt-1">↑ 5% improvement</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Topics Mastered</p>
                    <p className="text-3xl font-bold mt-2">12/18</p>
                    <p className="text-sm text-muted-foreground mt-1">67% complete</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-success" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Current Streak</p>
                    <p className="text-3xl font-bold mt-2">{user.streak} days</p>
                    <p className="text-sm text-warning font-semibold mt-1">🔥 Keep it up!</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Study Hours Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studyHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual Hours" />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Activity Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Weekly Goal Progress</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" />
                    <Bar dataKey="planned" fill="hsl(var(--muted))" name="Planned" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Quiz Performance by Subject</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quizScoresData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--accent))" name="Average Score %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">342</p>
                    <p className="text-sm text-muted-foreground">Questions Answered</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">28</p>
                    <p className="text-sm text-muted-foreground">Sessions Completed</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mastery" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Topic Mastery Levels</h3>
              <div className="space-y-6">
                {topicMasteryData.map((topic) => (
                  <div key={topic.topic}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{topic.topic}</p>
                        <p className="text-sm text-muted-foreground">{topic.questions} questions practiced</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{topic.mastery}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${topic.mastery}%`,
                          background: topic.mastery >= 80
                            ? "hsl(var(--success))"
                            : topic.mastery >= 60
                            ? "hsl(var(--primary))"
                            : "hsl(var(--warning))",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
