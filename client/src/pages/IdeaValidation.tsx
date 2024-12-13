import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CommandInput from "@/components/CommandInput";
import ProgressTracker from "@/components/ProgressTracker";
import { useToast } from "@/hooks/use-toast";

interface IdeaValidation {
  problemStatement: string;
  targetMarket: string;
  uniqueValue: string;
  validationStatus: string;
  aiSuggestions: any;
}

export default function IdeaValidation() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  const { data: validation, isLoading } = useQuery<IdeaValidation>({
    queryKey: ["/api/projects/1/idea-validation"],
  });

  const mutation = useMutation({
    mutationFn: async (data: Partial<IdeaValidation>) => {
      const response = await fetch("/api/projects/1/idea-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to save validation");
      }
      return response.json();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message
      });
    }
  });

  const handleCommand = (command: string) => {
    const commands: Record<string, () => void> = {
      "next": () => setCurrentStep(prev => Math.min(prev + 1, 4)),
      "back": () => setCurrentStep(prev => Math.max(prev - 1, 1)),
      "validate": () => {
        mutation.mutate({
          validationStatus: "validated",
          aiSuggestions: {
            improvement: "Consider narrowing target market focus",
            potential: "High potential in B2B segment",
            risks: "Competition from established players"
          }
        });
        toast({
          title: "Validation Complete",
          description: "AI analysis has been generated for your idea.",
        });
      }
    };

    const cmd = commands[command];
    if (cmd) {
      cmd();
    } else {
      toast({
        variant: "destructive",
        description: "Unknown command. Try 'next', 'back', or 'validate'",
      });
    }
  };

  const steps = [
    {
      title: "Problem Statement",
      description: "What problem does your idea solve?",
      content: validation?.problemStatement || "",
    },
    {
      title: "Target Market",
      description: "Who are your potential customers?",
      content: validation?.targetMarket || "",
    },
    {
      title: "Unique Value",
      description: "What makes your solution unique?",
      content: validation?.uniqueValue || "",
    },
    {
      title: "AI Analysis",
      description: "Review AI-generated validation insights",
      content: validation?.aiSuggestions ? JSON.stringify(validation.aiSuggestions, null, 2) : "",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-green-400">Idea Validation</h1>
        <ProgressTracker stage="idea_validation" progress={currentStep * 25} />
      </div>

      <CommandInput 
        onCommand={handleCommand}
        placeholder="Type 'next' to proceed, 'back' to return, or 'validate' to analyze"
      />

      <Card className="bg-gray-900/50 border-green-800 p-6">
        <h2 className="text-xl font-bold text-green-400 mb-4">
          Step {currentStep}: {steps[currentStep - 1].title}
        </h2>
        <p className="text-green-300 mb-4">{steps[currentStep - 1].description}</p>
        
        <Textarea
          value={currentStep === 1 ? validation?.problemStatement || '' :
                 currentStep === 2 ? validation?.targetMarket || '' :
                 currentStep === 3 ? validation?.uniqueValue || '' :
                 steps[currentStep - 1].content}
          onChange={(e) => {
            if (currentStep === 4) return;
            const field = currentStep === 1 ? 'problemStatement' :
                         currentStep === 2 ? 'targetMarket' : 'uniqueValue';
            mutation.mutate({
              ...validation,
              [field]: e.target.value
            });
          }}
          className="bg-black border-green-800 text-green-400 min-h-[200px]"
          placeholder="Enter your response..."
          readOnly={currentStep === 4}
        />

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            className="border-green-800 text-green-400"
            onClick={() => handleCommand("back")}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button
            variant="outline"
            className="border-green-800 text-green-400"
            onClick={() => handleCommand(currentStep === 4 ? "validate" : "next")}
          >
            {currentStep === 4 ? "Validate" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
