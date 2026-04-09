import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

// --- 1. Updated interface to match backend schema ---
interface QuizQuestion {
  question: string;
  type?: "mcq" | "short"; // Type is optional, we'll default to mcq
  options: string[];
  correct_answer: string; // Changed from correctAnswer
  difficulty?: "easy" | "medium" | "hard"; // Optional from backend
  marks?: number; // Optional from backend
  explanation: string;
}

interface SessionQuizProps {
  questions: QuizQuestion[]; // <-- 1. Receive questions as a prop
  onQuizComplete: (score: number, totalMarks: number) => void;
  minimumScore?: number;
}

// --- 2. Removed mockQuestions ---

export const SessionQuiz = ({ questions, onQuizComplete, minimumScore = 0 }: SessionQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [score, setScore] = useState(0);

  // Reset quiz if questions change
  useEffect(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimeLeft(900);
  }, [questions]);

  useEffect(() => {
    if (submitted || timeLeft <= 0 || !questions || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, timeLeft, questions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = () => {
    if (!questions || questions.length === 0) return;

    let totalScore = 0;
    questions.forEach((q, index) => {
      // --- 3. Use backend property 'correct_answer' ---
      if (answers[index]?.toLowerCase().trim() === q.correct_answer.toLowerCase()) {
        totalScore += (q.marks || 1); // Default to 1 mark if not provided
      }
    });
    setScore(totalScore);
    setSubmitted(true);

    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    
    // Update stats
    const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
      totalStudyHours: 0,
      questionsAnswered: 0,
      averageScore: 0,
      activePlans: 0
    }));
    
    stats.questionsAnswered = (stats.questionsAnswered || 0) + questions.length;
    const percentage = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;
    stats.averageScore = stats.averageScore === 0 ? percentage : (stats.averageScore + percentage) / 2;
    localStorage.setItem('userStats', JSON.stringify(stats));

    if (onQuizComplete) {
      onQuizComplete(totalScore, totalMarks);
    } else {
      toast.success(`Quiz completed! You scored ${totalScore}/${totalMarks}`);
    }
  };

  const getDifficultyColor = (difficulty: string = "medium") => { // Default difficulty
    switch (difficulty) {
      case "easy": return "bg-success/10 text-success";
      case "medium": return "bg-warning/10 text-warning";
      case "hard": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // --- 4. Handle empty or loading state for questions ---
  if (!questions || questions.length === 0) {
     return (
       <Card className="p-6 text-center">
         <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
         <p className="text-muted-foreground">Loading quiz...</p>
       </Card>
     );
  }

  const currentQ = questions[currentQuestion];
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <Badge variant="outline">
            {answeredCount}/{questions.length} Answered
          </Badge>
        </div>

        <Progress value={(answeredCount / questions.length) * 100} className="mb-6" />

        {!submitted ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getDifficultyColor(currentQ.difficulty)}>
                    {currentQ.difficulty || 'Medium'}
                  </Badge>
                  <Badge variant="outline">{currentQ.marks || 1} marks</Badge>
                </div>
                <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
              </div>
            </div>

            {/* Default to 'mcq' if type isn't specified */}
            {(currentQ.type === "mcq" || !currentQ.type) && currentQ.options ? (
              <RadioGroup
                value={answers[currentQuestion] || ""}
                onValueChange={(value) => handleAnswer(currentQuestion, value)}
              >
                <div className="space-y-3">
                  {currentQ.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-smooth cursor-pointer"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="Type your answer here..."
                value={answers[currentQuestion] || ""}
                onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
                rows={4}
                className="resize-none"
              />
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              {currentQuestion < questions.length - 1 ? (
                <Button
                  variant="default"
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  className="flex-1"
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={answeredCount < questions.length}
                  className="flex-1 gradient-primary"
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`text-center p-8 rounded-xl ${
              ((score / totalMarks)*100) >= minimumScore 
                ? 'bg-success/10 border-2 border-success' 
                : 'bg-destructive/10 border-2 border-destructive'
            }`}>
              <div className="text-6xl font-bold text-primary mb-2">
                {score}/{totalMarks}
              </div>
              <p className="text-lg text-muted-foreground mb-2">
                {((score / totalMarks) * 100).toFixed(1)}% Score
              </p>
              {minimumScore > 0 && (
                <p className={`text-sm font-semibold ${
                  ((score / totalMarks) * 100) >= minimumScore 
                    ? 'text-success' 
                    : 'text-destructive'
                }`}>
                  {((score / totalMarks) * 100) >= minimumScore 
                    ? `✓ Passed! (Required: ${minimumScore}%)` 
                    : `✗ Failed (Required: ${minimumScore}%)`}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Review Answers</h3>
              {questions.map((q, index) => {
                const userAnswer = answers[index];
                // --- 5. Use 'correct_answer' ---
                const isCorrect = userAnswer?.toLowerCase().trim() === q.correct_answer.toLowerCase();
                
                return (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-success mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold mb-2">Q{index + 1}. {q.question}</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            Your answer: <span className={isCorrect ? "text-success" : "text-destructive"}>{userAnswer || "Not answered"}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-muted-foreground">
                              Correct answer: <span className="text-success">{q.correct_answer}</span>
                            </p>
                          )}
                        </div>
                        <div className="mt-2 p-3 bg-accent/5 rounded-lg">
                          <p className="text-xs text-muted-foreground flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{q.marks || 1} marks</Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};