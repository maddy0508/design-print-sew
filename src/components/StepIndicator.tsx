import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                i < currentStep
                  ? "bg-primary text-primary-foreground"
                  : i === currentStep
                  ? "gradient-warm text-primary-foreground shadow-warm"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                i <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mb-5 h-0.5 w-8 transition-all",
                i < currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
