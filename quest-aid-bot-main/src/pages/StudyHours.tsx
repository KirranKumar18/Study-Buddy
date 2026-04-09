import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, TrendingUp, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function StudyHours() {
  const [stats, setStats] = useState({
    totalHours: 0,
    thisWeek: 0,
    thisMonth: 0,
    dailyGoal: 2,
    weeklyData: [] as any[],
    topicBreakdown: [] as any[]
  });

  useEffect(() => {
    // Load study hours data
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    const studyHoursData = JSON.parse(localStorage.getItem('studyHoursData') || JSON.stringify({
      totalHours: userStats.totalStudyHours || 0,
      thisWeek: 8.5,
      thisMonth: 32.5,
      weeklyData: [
        { day: 'Mon', hours: 2.5 },
        { day: 'Tue', hours: 1.5 },
        { day: 'Wed', hours: 3.0 },
        { day: 'Thu', hours: 2.0 },
        { day: 'Fri', hours: 2.5 },
        { day: 'Sat', hours: 1.0 },
        { day: 'Sun', hours: 0.5 }
      ],
      topicBreakdown: [
        { subject: 'Physics', hours: 12.5, percentage: 38 },
        { subject: 'Mathematics', hours: 8.5, percentage: 26 },
        { subject: 'Chemistry', hours: 11.5, percentage: 36 }
      ]
    }));
    
    setStats({ ...studyHoursData, dailyGoal: 2 });
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
            <h1 className="text-4xl font-bold mb-2">Study Hours</h1>
            <p className="text-muted-foreground">Track your study time and maintain consistency</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-primary" />
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalHours}h</div>
              <div className="text-sm text-muted-foreground">Total Study Time</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.thisWeek}h</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.thisMonth}h</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{((stats.thisWeek / 7) / stats.dailyGoal * 100).toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Daily Goal Progress</div>
            </Card>
          </div>

          {/* Weekly Chart */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Weekly Study Hours</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Subject Breakdown */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Study Time by Subject</h2>
            <div className="space-y-6">
              {stats.topicBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{item.subject}</span>
                    <span className="text-muted-foreground">{item.hours}h ({item.percentage}%)</span>
                  </div>
                  <Progress value={item.percentage} className="h-3" />
                </div>
              ))}
            </div>
          </Card>

          {/* Monthly Overview */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Monthly Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { month: 'Week 1', hours: 8 },
                { month: 'Week 2', hours: 12 },
                { month: 'Week 3', hours: 7 },
                { month: 'Week 4', hours: 5.5 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
