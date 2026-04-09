import { Progress } from "@/components/ui/progress";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProcessingModalProps {
  progress: number;
  currentStep: string;
  onCancel: () => void;
}

export const ProcessingModal = ({ progress, currentStep, onCancel }: ProcessingModalProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Creating Your Study Plan</h3>
            <p className="text-muted-foreground">This may take a few moments...</p>
          </div>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-3 mb-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{progress}% complete</span>
            <span className="font-medium">{currentStep}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Extracting files</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Generating embeddings</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="font-medium">Generating questions</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <span className="text-muted-foreground">Ranking important questions</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onCancel}
          className="w-full mt-6"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
