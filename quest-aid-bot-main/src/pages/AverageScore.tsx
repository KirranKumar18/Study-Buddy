import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Target, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function AverageScore() {
  const [stats, setStats] = useState({
    overall: 0,
    thisWeek: 89,
    thisMonth: 86,
    trend: [] as any[],
    bySubject: [] as any[],
    recentScores: [] as any[]
  });

  useEffect(() => {
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    const scoreData = JSON.parse(localStorage.getItem('scoreData') || JSON.stringify({
      overall: userStats.averageScore || 87,
      thisWeek: 89,
      thisMonth: 86,
      trend: [
        { date: 'Week 1', score: 82 },
        { date: 'Week 2', score: 85 },
        { date: 'Week 3', score: 84 },
        { date: 'Week 4', score: 87 },
        { date: 'Week 5', score: 89 }
      ],
      bySubject: [
        { subject: 'Physics', score: 88, improvement: '+5%' },
        { subject: 'Mathematics', score: 85, improvement: '+3%' },
        { subject: 'Chemistry', score: 89, improvement: '+7%' }
      ],
      recentScores: [
        { quiz: 'Physics - Mechanics', score: 92, date: 'Today', outOf: 100 },
        { quiz: 'Math - Calculus', score: 85, date: 'Yesterday', outOf: 100 },
        { quiz: 'Chemistry - Organic', score: 88, date: '2 days ago', outOf: 100 }
      ]
    }));
    
    setStats(scoreData);
  }, []);

  const user = {
    name: "Alex",
    xp: 1250,
    level: 5,
    streak: 7,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Average Score</h1>
            <p className="text-muted-foreground">Monitor your performance and track improvements</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.overall}%</div>
              <div className="text-sm text-muted-foreground">Overall Average</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.thisWeek}%</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.thisMonth}%</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">+5%</div>
              <div className="text-sm text-muted-foreground">Improvement</div>
            </Card>
          </div>

          {/* Score Trend */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Score Trend (Last 5 Weeks)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Subject Performance */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Performance by Subject</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.bySubject}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Subject Details */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Subject Analysis</h2>
            <div className="space-y-6">
              {stats.bySubject.map((subject, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{subject.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-success text-sm font-semibold">{subject.improvement}</span>
                      <span className="text-muted-foreground">{subject.score}%</span>
                    </div>
                  </div>
                  <Progress value={subject.score} className="h-3" />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Scores */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Quiz Scores</h2>
            <div className="space-y-4">
              {stats.recentScores.map((quiz, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">{quiz.quiz}</div>
                    <div className="text-sm text-muted-foreground">{quiz.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{quiz.score}%</div>
                    <div className="text-sm text-muted-foreground">{quiz.score}/{quiz.outOf}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
