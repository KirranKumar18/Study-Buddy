import { Lightbulb } from "lucide-react";

interface Card {
  front: string;
  back: string;
  mnemonic?: string;
  topic: string;
}

interface FlipCardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
}

export const FlipCard = ({ card, isFlipped, onFlip }: FlipCardProps) => {
  return (
    <div
      onClick={onFlip}
      className="relative w-full h-96 cursor-pointer perspective-1000"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full bg-card rounded-2xl shadow-lg p-8 flex flex-col justify-center items-center border-2 border-border">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
              {card.topic}
            </span>
            <h3 className="text-2xl font-bold text-center">{card.front}</h3>
            <p className="text-muted-foreground text-sm mt-8">Click to reveal answer</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-lg p-8 flex flex-col justify-center border-2 border-primary/20">
            <p className="text-lg leading-relaxed mb-6">{card.back}</p>
            
            {card.mnemonic && (
              <div className="mt-auto p-4 bg-background/50 rounded-xl flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Memory Aid</p>
                  <p className="text-sm text-muted-foreground">{card.mnemonic}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
