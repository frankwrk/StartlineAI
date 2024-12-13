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
  feedback?: string;
  aiSuggestions: {
    marketPotential: string;
    risks: string[];
    suggestions: string[];
    competitiveAdvantage: string;
  };
}

export default function IdeaValidation() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<IdeaValidation>>({
    problemStatement: '',
    targetMarket: '',
    uniqueValue: ''
  });

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
    onSuccess: () => {
      toast({
        description: "Progress saved successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message
      });
    }
  });

  const analysisMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/projects/1/analyze-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemStatement: formData.problemStatement,
          targetMarket: formData.targetMarket,
          uniqueValue: formData.uniqueValue
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to analyze idea");
      }
      
      const data = await response.json();
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid analysis response format");
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Update the validation with AI suggestions
      mutation.mutate({
        ...formData,
        validationStatus: "validated",
        aiSuggestions: {
          marketPotential: data.marketPotential,
          risks: data.risks,
          suggestions: data.suggestions,
          competitiveAdvantage: data.competitiveAdvantage
        }
      });
      
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your startup idea. Review the analysis below.",
      });
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        description: `Analysis failed: ${error.message}`
      });
    }
  });

  const handleCommand = (command: string) => {
    const commands: Record<string, () => void> = {
      "next": () => setCurrentStep(prev => Math.min(prev + 1, 4)),
      "back": () => setCurrentStep(prev => Math.max(prev - 1, 1)),
      "validate": () => analysisMutation.mutate()
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

  const handleInputChange = (field: keyof IdeaValidation, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Save changes as user types
    mutation.mutate({
      ...formData,
      [field]: value
    });
  };

  const getCurrentValue = () => {
    if (currentStep === 4) {
      return validation?.aiSuggestions ? JSON.stringify(validation.aiSuggestions, null, 2) : '';
    }
    
    const field = currentStep === 1 ? 'problemStatement' :
                 currentStep === 2 ? 'targetMarket' : 'uniqueValue';
                 
    return formData[field as keyof IdeaValidation] || '';
  };

  const steps = [
    {
      title: "Problem Statement",
      description: "What problem does your idea solve?",
    },
    {
      title: "Target Market",
      description: "Who are your potential customers?",
    },
    {
      title: "Unique Value",
      description: "What makes your solution unique?",
    },
    {
      title: "AI Analysis",
      description: "Review AI-generated validation insights",
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
        
        {currentStep === 4 ? (
          <div className="space-y-6">
            <div className="bg-black/50 p-4 rounded border border-green-800">
              <h3 className="text-green-400 font-bold mb-4">AI Analysis Results</h3>
              {validation?.aiSuggestions ? (
                <div className="space-y-4">
                  <section>
                    <h4 className="text-green-400 mb-2">Market Potential</h4>
                    <p className="text-green-300">{validation.aiSuggestions.marketPotential}</p>
                  </section>
                  <section>
                    <h4 className="text-green-400 mb-2">Risks</h4>
                    <ul className="list-disc list-inside text-green-300">
                      {validation.aiSuggestions.risks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-green-400 mb-2">Suggestions</h4>
                    <ul className="list-disc list-inside text-green-300">
                      {validation.aiSuggestions.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-green-400 mb-2">Competitive Advantage</h4>
                    <p className="text-green-300">{validation.aiSuggestions.competitiveAdvantage}</p>
                  </section>
                </div>
              ) : (
                <p className="text-green-300">Click "Validate" to generate AI analysis</p>
              )}
            </div>
            
            <div>
              <h3 className="text-green-400 font-bold mb-2">Your Feedback on Analysis</h3>
              <Textarea
                value={formData.feedback || ""}
                onChange={(e) => handleInputChange("feedback", e.target.value)}
                className="bg-black border-green-800 text-green-400 min-h-[100px]"
                placeholder="What do you think about the AI's analysis? Any points you agree or disagree with?"
              />
            </div>
          </div>
        ) : (
          <Textarea
            value={getCurrentValue()}
            onChange={(e) => {
              const field = currentStep === 1 ? 'problemStatement' :
                           currentStep === 2 ? 'targetMarket' : 'uniqueValue';
              handleInputChange(field as keyof IdeaValidation, e.target.value);
            }}
            className="bg-black border-green-800 text-green-400 min-h-[200px]"
            placeholder="Enter your response..."
          />
        )}

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
