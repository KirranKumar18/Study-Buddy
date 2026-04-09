import { FeatureCard } from "./FeatureCard";
import { Brain, Sparkles, Target, Calendar, Zap, Trophy } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "RAG-Powered Explanations",
      description: "Get detailed explanations with citations from your own study materials using advanced AI retrieval.",
      gradient: "primary" as const,
    },
    {
      icon: Target,
      title: "Adaptive Quizzes",
      description: "Take quizzes that automatically adjust difficulty based on your mastery level and performance.",
      gradient: "secondary" as const,
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI generates personalized daily study sessions that fit your exam date and time constraints.",
      gradient: "primary" as const,
    },
    {
      icon: Zap,
      title: "Spaced Repetition",
      description: "Review concepts at scientifically-optimized intervals to maximize long-term retention.",
      gradient: "secondary" as const,
    },
    {
      icon: Sparkles,
      title: "Important Questions",
      description: "AI analyzes past papers to identify and rank the most critical questions for your exam.",
      gradient: "primary" as const,
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Earn XP, level up, and maintain streaks to stay motivated throughout your study journey.",
      gradient: "secondary" as const,
    },
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Everything You Need to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Ace Your Exams</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Combining cutting-edge AI with proven learning science to create the ultimate study companion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
