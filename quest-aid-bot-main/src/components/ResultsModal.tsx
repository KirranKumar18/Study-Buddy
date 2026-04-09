import { CheckCircle, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  stem: string;
  correctAnswer: string | number;
  explanation: string;
  points: number;
  choices?: string[];
}

interface ResultsModalProps {
  questions: Question[];
  answers: (string | number)[];
  onClose: () => void;
}

export const ResultsModal = ({ questions, answers, onClose }: ResultsModalProps) => {
  const results = questions.map((q, i) => {
    const userAnswer = answers[i];
    const isCorrect = userAnswer?.toString().toLowerCase() === q.correctAnswer.toString().toLowerCase() ||
                     userAnswer === q.correctAnswer;
    return {
      question: q,
      userAnswer,
      isCorrect,
      pointsEarned: isCorrect ? q.points : 0
    };
  });

  const totalScore = results.reduce((acc, r) => acc + r.pointsEarned, 0);
  const maxScore = questions.reduce((acc, q) => acc + q.points, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);
  const xpEarned = Math.round(totalScore * 1.5);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-scale-in">
        <div className="p-8 border-b border-border">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground text-lg mb-6">
              You scored {totalScore} out of {maxScore} points
            </p>
            
            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full font-semibold text-lg">
              <span>+{xpEarned} XP</span>
              <span className="text-2xl">🎉</span>
            </div>
          </div>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <h3 className="font-bold text-xl mb-6">Question Breakdown</h3>
          <div className="space-y-6">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border-2 ${
                  result.isCorrect
                    ? "border-success/20 bg-success/5"
                    : "border-destructive/20 bg-destructive/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {result.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-3">{result.question.stem}</p>
                    
                    {result.question.choices && (
                      <div className="space-y-2 mb-3">
                        <p className="text-sm text-muted-foreground">
                          Your answer: {result.question.choices[result.userAnswer as number] || "Not answered"}
                        </p>
                        <p className="text-sm font-medium text-success">
                          Correct answer: {result.question.choices[result.question.correctAnswer as number]}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 p-4 bg-background/50 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{result.question.explanation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {result.pointsEarned}/{result.question.points}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-border flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 gradient-primary text-white"
          >
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
};
