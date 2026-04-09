import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FlipCard } from "@/components/FlipCard";
import { QualityButtons } from "@/components/QualityButtons";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockCards = [
  {
    id: "1",
    front: "What is Newton's First Law?",
    back: "An object at rest stays at rest, and an object in motion stays in motion with constant velocity unless acted upon by an external force.",
    mnemonic: "Think: Objects are lazy - they don't change unless forced to",
    topic: "Newton's Laws"
  },
  {
    id: "2",
    front: "State Newton's Second Law as an equation",
    back: "F = ma (Force equals mass times acceleration)",
    mnemonic: "FBI: Force = Base × Increase",
    topic: "Newton's Laws"
  },
  {
    id: "3",
    front: "What is the SI unit of force?",
    back: "Newton (N)",
    mnemonic: "Named after Isaac Newton",
    topic: "Units"
  }
];

export default function Review() {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [ratings, setRatings] = useState<number[]>([]);

  const handleRating = (quality: number) => {
    setRatings([...ratings, quality]);
    
    if (currentCard < mockCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      setShowSummary(true);
      const avgQuality = ratings.reduce((a, b) => a + b, quality) / (ratings.length + 1);
      const xpEarned = Math.round(avgQuality * 5);
      toast.success(`Review complete! +${xpEarned} XP earned`);
    }
  };

  const progress = ((currentCard + 1) / mockCards.length) * 100;

  if (showSummary) {
    const avgQuality = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const cardsAgain = ratings.filter(r => r < 3).length;
    const cardsGood = ratings.filter(r => r >= 3).length;

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-card rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Review Complete! 🎉</h1>
            <p className="text-muted-foreground text-lg mb-8">Great job staying consistent with your reviews</p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-accent/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-primary">{mockCards.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Cards Reviewed</div>
              </div>
              <div className="bg-accent/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-success">{cardsGood}</div>
                <div className="text-sm text-muted-foreground mt-1">Remembered</div>
              </div>
              <div className="bg-accent/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-warning">{cardsAgain}</div>
                <div className="text-sm text-muted-foreground mt-1">Need Review</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-muted-foreground mb-2">Average Quality</div>
              <div className="flex items-center justify-center gap-2">
                <Progress value={(avgQuality / 5) * 100} className="h-3 flex-1" />
                <span className="font-bold">{avgQuality.toFixed(1)}/5</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="gradient-primary text-white"
            >
              Back to Dashboard
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Daily Review</h1>
              <span className="text-muted-foreground">
                {currentCard + 1} of {mockCards.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <FlipCard
            card={mockCards[currentCard]}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />

          {isFlipped && (
            <div className="mt-8 animate-slide-up">
              <QualityButtons onRate={handleRating} />
            </div>
          )}

          {!isFlipped && (
            <Button
              onClick={() => setIsFlipped(true)}
              size="lg"
              className="w-full mt-8 gradient-primary text-white"
            >
              Reveal Answer
            </Button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
