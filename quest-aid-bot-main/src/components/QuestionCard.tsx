import { Lightbulb } from "lucide-react";

interface Question {
  id: string;
  type: "mcq" | "short_answer";
  stem: string;
  choices?: string[];
  points: number;
  difficulty: string;
}

interface QuestionCardProps {
  question: Question;
  userAnswer?: string | number;
  onAnswer: (answer: string | number) => void;
}

export const QuestionCard = ({ question, userAnswer, onAnswer }: QuestionCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success/10 text-success";
      case "medium":
        return "bg-warning/10 text-warning";
      case "hard":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty.toUpperCase()}
        </span>
        <span className="text-sm text-muted-foreground">{question.points} points</span>
      </div>

      <h2 className="text-2xl font-semibold mb-6 leading-relaxed">{question.stem}</h2>

      {question.type === "mcq" && question.choices && (
        <div className="space-y-3">
          {question.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-smooth ${
                userAnswer === index
                  ? "border-primary bg-primary/5 font-medium"
                  : "border-border hover:border-primary/50 hover:bg-accent/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                    userAnswer === index
                      ? "border-primary bg-primary text-white"
                      : "border-border"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{choice}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {question.type === "short_answer" && (
        <div>
          <textarea
            value={userAnswer as string || ""}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-[150px] p-4 rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-smooth resize-none"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {(userAnswer as string)?.length || 0} characters
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-accent/10 rounded-xl flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-warning mt-0.5" />
        <div>
          <p className="font-semibold text-sm mb-1">Hint</p>
          <p className="text-sm text-muted-foreground">
            Think about the key concepts we discussed in the study session.
          </p>
        </div>
      </div>
    </div>
  );
};
