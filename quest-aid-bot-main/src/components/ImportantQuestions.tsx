import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, TrendingUp, FileText } from "lucide-react";

const importantQuestions = [
  {
    id: "q1",
    topic: "Optics",
    question: "Derive the lens maker's formula",
    importanceScore: 0.95,
    difficulty: "hard",
    reason: "Appeared in 5 out of 6 past papers (2019-2024). Fundamental to understanding lens theory.",
    years: ["2019", "2020", "2021", "2022", "2024"],
    estimatedMarks: 10,
    sources: ["physics_2023.pdf", "physics_2024.pdf"],
  },
  {
    id: "q2",
    topic: "Mechanics",
    question: "Apply Newton's laws to solve collision problems",
    importanceScore: 0.88,
    difficulty: "medium",
    reason: "High-frequency concept tested in both theory and practical applications.",
    years: ["2020", "2021", "2023", "2024"],
    estimatedMarks: 8,
    sources: ["mechanics_notes.pdf", "past_papers.pdf"],
  },
  {
    id: "q3",
    topic: "Thermodynamics",
    question: "Explain the laws of thermodynamics with real-world examples",
    importanceScore: 0.82,
    difficulty: "medium",
    reason: "Core concept, commonly tested in essay questions.",
    years: ["2019", "2021", "2022", "2024"],
    estimatedMarks: 12,
    sources: ["thermodynamics.pdf"],
  },
  {
    id: "q4",
    topic: "Waves",
    question: "Describe interference patterns in double-slit experiment",
    importanceScore: 0.78,
    difficulty: "easy",
    reason: "Classic physics experiment, appears regularly in practical sections.",
    years: ["2020", "2022", "2023"],
    estimatedMarks: 6,
    sources: ["waves_chapter.pdf"],
  },
];

export const ImportantQuestions = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/10 text-success";
      case "medium": return "bg-warning/10 text-warning";
      case "hard": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Important Questions</h2>
          <p className="text-muted-foreground">AI-ranked based on past papers and frequency</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary">
            <Star className="w-3 h-3 mr-1" />
            Top {importantQuestions.length} Questions
          </Badge>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {importantQuestions.map((q, index) => (
          <AccordionItem key={q.id} value={q.id} className="border-0">
            <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                <div className="flex items-start gap-4 w-full text-left">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent text-white font-bold text-lg flex-shrink-0">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className="font-semibold">
                        {q.topic}
                      </Badge>
                      <Badge className={getDifficultyColor(q.difficulty)}>
                        {q.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>{(q.importanceScore * 100).toFixed(0)}% importance</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-base">{q.question}</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pt-4 space-y-4">
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <p className="text-sm font-semibold text-accent mb-1">Why This Question Matters:</p>
                    <p className="text-sm text-muted-foreground">{q.reason}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Appeared in Years</p>
                      <div className="flex flex-wrap gap-1">
                        {q.years.map((year) => (
                          <Badge key={year} variant="secondary" className="text-xs">
                            {year}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Estimated Marks</p>
                      <p className="text-2xl font-bold">{q.estimatedMarks}</p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Sources</p>
                      <div className="flex items-center gap-1 text-xs">
                        <FileText className="w-3 h-3" />
                        <span>{q.sources.length} documents</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="default" className="flex-1">
                      Practice This Question
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Similar Questions
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
