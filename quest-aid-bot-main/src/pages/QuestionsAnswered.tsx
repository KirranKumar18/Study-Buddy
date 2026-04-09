import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, XCircle, TrendingUp, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function QuestionsAnswered() {
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    byDifficulty: {
      easy: { answered: 0, correct: 0 },
      medium: { answered: 0, correct: 0 },
      hard: { answered: 0, correct: 0 }
    },
    byTopic: [] as any[],
    recentQuestions: [] as any[]
  });

  useEffect(() => {
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    const questionsData = JSON.parse(localStorage.getItem('questionsData') || JSON.stringify({
      total: userStats.questionsAnswered || 156,
      correct: 136,
      byDifficulty: {
        easy: { answered: 60, correct: 56 },
        medium: { answered: 68, correct: 58 },
        hard: { answered: 28, correct: 22 }
      },
      byTopic: [
        { subject: 'Physics', answered: 65, accuracy: 88 },
        { subject: 'Mathematics', answered: 54, accuracy: 85 },
        { subject: 'Chemistry', answered: 37, accuracy: 84 }
      ],
      recentQuestions: [
        { 
          question: "What is Newton's Second Law?",
          difficulty: "easy",
          correct: true,
          topic: "Physics",
          date: "2 hours ago"
        },
        { 
          question: "Calculate the integral of x²",
          difficulty: "medium",
          correct: true,
          topic: "Mathematics",
          date: "5 hours ago"
        },
        { 
          question: "Explain Le Chatelier's principle",
          difficulty: "hard",
          correct: false,
          topic: "Chemistry",
          date: "1 day ago"
        }
      ]
    }));
    
    setStats(questionsData);
  }, []);

  const user = {
    name: "Alex",
    xp: 1250,
    level: 5,
    streak: 7,
  };

  const accuracyData = [
    { name: 'Correct', value: stats.correct, color: 'hsl(var(--success))' },
    { name: 'Incorrect', value: stats.total - stats.correct, color: 'hsl(var(--destructive))' }
  ];

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Questions Answered</h1>
            <p className="text-muted-foreground">Track your progress and identify improvement areas</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.correct}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{((stats.correct / stats.total) * 100).toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">+8%</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Accuracy Chart */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Overall Accuracy</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Difficulty Breakdown */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Performance by Difficulty</h2>
              <div className="space-y-6">
                {Object.entries(stats.byDifficulty).map(([difficulty, data]: [string, any]) => {
                  const accuracy = data.answered > 0 ? (data.correct / data.answered * 100).toFixed(0) : 0;
                  return (
                    <div key={difficulty}>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={difficultyColors[difficulty as keyof typeof difficultyColors]}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {data.correct}/{data.answered} correct
                          </span>
                        </div>
                        <span className="font-semibold">{accuracy}%</span>
                      </div>
                      <Progress value={Number(accuracy)} className="h-3" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Subject Performance */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Performance by Subject</h2>
            <div className="space-y-6">
              {stats.byTopic.map((topic, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{topic.subject}</span>
                    <span className="text-muted-foreground">{topic.answered} questions • {topic.accuracy}% accuracy</span>
                  </div>
                  <Progress value={topic.accuracy} className="h-3" />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Questions */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Questions</h2>
            <div className="space-y-4">
              {stats.recentQuestions.map((q, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  {q.correct ? (
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{q.question}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge className={difficultyColors[q.difficulty as keyof typeof difficultyColors]}>
                        {q.difficulty}
                      </Badge>
                      <span>{q.topic}</span>
                      <span>•</span>
                      <span>{q.date}</span>
                    </div>
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
