import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 lg:p-20 shadow-elegant">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          
          <div className="relative text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Start Your Journey</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-white">
              Ready to Transform Your Study Habits?
            </h2>
            
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of students who are already studying smarter with AI-powered personalization.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full text-lg px-8 py-6 shadow-elegant group">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            <p className="text-sm text-white/70 pt-4">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
