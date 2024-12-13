import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  stage: string;
  progress: number;
}

export default function ProgressTracker({ stage, progress }: ProgressTrackerProps) {
  const stages = {
    idea_validation: "Idea Validation",
    business_plan: "Business Plan",
    resource_planning: "Resource Planning",
    mvp_development: "MVP Development",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-green-400">{stages[stage as keyof typeof stages]}</span>
        <span className="text-green-400">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-green-900">
        <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
      </Progress>
    </div>
  );
}
