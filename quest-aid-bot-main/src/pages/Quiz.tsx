import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuestionCard } from "@/components/QuestionCard";
import { ResultsModal } from "@/components/ResultsModal";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import confetti from "canvas-confetti";

interface Question {
  id: string;
  type: "mcq" | "short_answer";
  stem: string;
  choices?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  difficulty: string;
}

const mockQuestions: Question[] = [
  {
    id: "q1",
    type: "mcq",
    stem: "Which law explains why seatbelts are necessary in cars?",
    choices: [
      "First Law (Inertia)",
      "Second Law (F=ma)",
      "Third Law (Action-Reaction)",
      "Law of Gravitation"
    ],
    correctAnswer: 0,
    explanation: "Newton's First Law states that objects in motion stay in motion unless acted upon by an external force. When a car suddenly stops, your body continues moving forward due to inertia.",
    points: 10,
    difficulty: "easy"
  },
  {
    id: "q2",
    type: "short_answer",
    stem: "Calculate the acceleration of a 5kg object when a 20N force is applied to it.",
    correctAnswer: "4",
    explanation: "Using F=ma, we get a = F/m = 20N / 5kg = 4 m/s²",
    points: 15,
    difficulty: "medium"
  },
  {
    id: "q3",
    type: "mcq",
    stem: "What is the SI unit of force?",
    choices: ["Joule", "Newton", "Watt", "Pascal"],
    correctAnswer: 1,
    explanation: "The Newton (N) is the SI unit of force, named after Isaac Newton.",
    points: 10,
    difficulty: "easy"
  }
];

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const score = mockQuestions.reduce((acc, q, i) => {
      const userAnswer = answers[i];
      const isCorrect = userAnswer?.toString().toLowerCase() === q.correctAnswer.toString().toLowerCase() ||
                       userAnswer === q.correctAnswer;
      return acc + (isCorrect ? q.points : 0);
    }, 0);

    const maxScore = mockQuestions.reduce((acc, q) => acc + q.points, 0);
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Newton's Laws Quiz</h1>
              <p className="text-muted-foreground mt-1">
                Question {currentQuestion + 1} of {mockQuestions.length}
              </p>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              <span className={timeLeft < 60 ? "text-destructive" : ""}>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <Progress value={progress} className="mb-8 h-2" />

          <QuestionCard
            question={mockQuestions[currentQuestion]}
            userAnswer={answers[currentQuestion]}
            onAnswer={handleAnswer}
          />

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2.5 rounded-full border-2 border-border hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              Previous
            </button>
            <div className="flex gap-3">
              {currentQuestion < mockQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-full gradient-primary text-white hover:shadow-glow transition-smooth"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-full gradient-primary text-white hover:shadow-glow transition-smooth"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showResults && (
        <ResultsModal
          questions={mockQuestions}
          answers={answers}
          onClose={() => navigate("/")}
        />
      )}
    </div>
  );
}
