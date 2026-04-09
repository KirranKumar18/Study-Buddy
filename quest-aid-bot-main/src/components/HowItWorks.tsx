import { Card } from "@/components/ui/card";
import { Upload, Brain, Target, Repeat } from "lucide-react";
import aiAnalysis from "@/assets/ai-analysis.jpg";
import dashboardIllustration from "@/assets/dashboard-illustration.jpg";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Materials",
      description: "Add your notes, past papers, and study topics. StudyBuddy extracts and organizes everything.",
    },
    {
      number: "02",
      icon: Brain,
      title: "AI Generates Your Plan",
      description: "Get a personalized study schedule with daily sessions optimized for your exam date.",
    },
    {
      number: "03",
      icon: Target,
      title: "Study & Take Quizzes",
      description: "Learn with AI-powered explanations and adaptive quizzes that match your level.",
    },
    {
      number: "04",
      icon: Repeat,
      title: "Review & Master",
      description: "Use spaced repetition to ensure long-term retention of all concepts.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold">
            How <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">StudyBuddy</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From upload to mastery in four simple steps
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-6 hover:shadow-elegant transition-smooth">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-muted-foreground mb-1">STEP {step.number}</div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
              <img 
                src={aiAnalysis} 
                alt="AI analyzing study materials" 
                className="relative rounded-3xl shadow-elegant w-full"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
              <img 
                src={dashboardIllustration} 
                alt="Study dashboard" 
                className="relative rounded-3xl shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
