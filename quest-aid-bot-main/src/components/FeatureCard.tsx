import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: "primary" | "secondary";
}

export const FeatureCard = ({ icon: Icon, title, description, gradient = "primary" }: FeatureCardProps) => {
  const gradientClass = gradient === "primary" ? "gradient-primary" : "gradient-secondary";
  
  return (
    <Card className="p-6 hover:shadow-elegant transition-smooth group cursor-pointer border-border/50">
      <div className={`w-14 h-14 rounded-2xl ${gradientClass} flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
};
