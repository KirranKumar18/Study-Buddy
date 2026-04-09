import { Check } from "lucide-react";

interface StepWizardProps {
  currentStep: number;
  steps: string[];
}

export const StepWizard = ({ currentStep, steps }: StepWizardProps) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={index} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <span
                className={`ml-3 font-medium hidden sm:block ${
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-smooth ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
