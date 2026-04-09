interface QualityButtonsProps {
  onRate: (quality: number) => void;
}

export const QualityButtons = ({ onRate }: QualityButtonsProps) => {
  const buttons = [
    { label: "Again", quality: 1, color: "bg-destructive hover:bg-destructive/90" },
    { label: "Hard", quality: 3, color: "bg-warning hover:bg-warning/90" },
    { label: "Good", quality: 4, color: "bg-success hover:bg-success/90" },
    { label: "Easy", quality: 5, color: "bg-primary hover:bg-primary/90" }
  ];

  return (
    <div>
      <p className="text-center text-muted-foreground mb-4">How well did you know this?</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {buttons.map((button) => (
          <button
            key={button.quality}
            onClick={() => onRate(button.quality)}
            className={`${button.color} text-white px-6 py-4 rounded-xl font-semibold transition-smooth hover:scale-105 hover:shadow-lg`}
          >
            {button.label}
          </button>
        ))}
      </div>
      <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
        <p>Again: Review in 1 day • Hard: Review in 3 days</p>
        <p>Good: Review in 1 week • Easy: Review in 2 weeks</p>
      </div>
    </div>
  );
};
