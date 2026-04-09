import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles, Target } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Study <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Smarter</span>,
              Not Harder
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Transform your exam preparation with AI-generated study plans, intelligent quizzes that adapt to your level, and spaced repetition that ensures you remember everything.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gradient-primary text-white rounded-full text-lg px-8 py-6 shadow-elegant hover:shadow-glow transition-smooth group">
                Create Your Study Plan
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-lg px-8 py-6 border-2">
                See How It Works
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">AI-Powered</div>
                  <div className="text-sm text-muted-foreground">Smart Explanations</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Adaptive</div>
                  <div className="text-sm text-muted-foreground">Personalized Quizzes</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
            <img 
              src={heroImage} 
              alt="Students studying with AI assistance" 
              className="relative rounded-3xl shadow-elegant w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
