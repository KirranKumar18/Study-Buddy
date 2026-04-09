import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Brain, Target, Users, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">About StudyBuddy</h1>
            <p className="text-xl text-muted-foreground">
              Transforming how students learn with AI-powered study tools
            </p>
          </div>

          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              StudyBuddy was created with a simple yet powerful mission: to make effective, personalized learning accessible to every student. We believe that with the right tools and guidance, anyone can achieve their academic goals and unlock their full potential.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By combining cutting-edge AI technology with proven learning science, we've built a platform that adapts to each student's unique needs, learning style, and pace. Our goal is not just to help students pass exams, but to foster genuine understanding and a lifelong love of learning.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Intelligence</h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes your study materials and creates personalized learning paths tailored to your needs.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Goal-Oriented Approach</h3>
              <p className="text-muted-foreground">
                Set your exam dates and goals, and we'll create a strategic study plan to help you achieve them.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-2">Student-First Design</h3>
              <p className="text-muted-foreground">
                Built with input from thousands of students to ensure the best possible learning experience.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-xl font-bold mb-2">Science-Backed Methods</h3>
              <p className="text-muted-foreground">
                Leveraging spaced repetition, active recall, and adaptive learning for maximum retention.
              </p>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              StudyBuddy was born out of personal experience. Our founders struggled with ineffective study methods during their own academic journeys and knew there had to be a better way. After years of research into learning science and cognitive psychology, combined with breakthroughs in AI technology, StudyBuddy was created.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              What started as a simple tool has grown into a comprehensive learning platform trusted by students worldwide. We're constantly evolving, listening to our community, and pushing the boundaries of what's possible in educational technology.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
