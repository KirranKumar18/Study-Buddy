import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out StudyBuddy",
    features: [
      "1 active study plan",
      "5 quizzes per month",
      "Basic flashcards",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "For serious students",
    features: [
      "Unlimited study plans",
      "Unlimited quizzes",
      "Advanced analytics",
      "Spaced repetition",
      "Revision pack exports",
      "Priority support",
      "Ad-free experience",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Premium",
    price: "$19.99",
    period: "per month",
    description: "Maximum learning potential",
    features: [
      "Everything in Pro",
      "AI tutor chat",
      "Video recommendations",
      "Custom study schedules",
      "Group study features",
      "1-on-1 coaching session",
      "Early access to features",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your learning needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 relative ${
                  plan.popular ? "border-primary border-2 shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular ? "gradient-primary text-white" : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Can I cancel anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Cancel your subscription at any time with no penalties.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Is there a free trial?</h3>
                <p className="text-sm text-muted-foreground">
                  Pro and Premium plans include a 14-day free trial.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards and PayPal.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Do you offer student discounts?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Contact support with your student ID for 20% off.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
