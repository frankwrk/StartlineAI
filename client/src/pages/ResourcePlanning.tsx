import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import CommandInput from "@/components/CommandInput";
import ProgressTracker from "@/components/ProgressTracker";
import { useToast } from "@/hooks/use-toast";

interface ResourcePlan {
  budget: number;
  timeline: {
    phases: { name: string; duration: number; }[];
  };
  teamRequirements: {
    roles: { title: string; count: number; }[];
  };
  tooling: {
    categories: { name: string; tools: string[]; }[];
  };
}

export default function ResourcePlanning() {
  const { toast } = useToast();
  const [budget, setBudget] = useState(50000);

  const { data: plan, isLoading } = useQuery<ResourcePlan>({
    queryKey: ["/api/projects/1/resource-plan"],
  });

  const mutation = useMutation({
    mutationFn: async (data: Partial<ResourcePlan>) => {
      const response = await fetch("/api/projects/1/resource-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save resource plan");
      return response.json();
    },
  });

  const handleCommand = (command: string) => {
    if (command === "calculate") {
      mutation.mutate({
        budget,
        timeline: {
          phases: [
            { name: "Planning", duration: 2 },
            { name: "Development", duration: 4 },
            { name: "Testing", duration: 2 },
            { name: "Launch", duration: 1 }
          ]
        },
        teamRequirements: {
          roles: [
            { title: "Developer", count: 2 },
            { title: "Designer", count: 1 },
            { title: "Product Manager", count: 1 }
          ]
        },
        tooling: {
          categories: [
            { 
              name: "Development",
              tools: ["VS Code", "Git", "Docker"]
            },
            {
              name: "Design",
              tools: ["Figma", "Adobe XD"]
            },
            {
              name: "Project Management",
              tools: ["Jira", "Slack"]
            }
          ]
        }
      });
      toast({
        title: "Resource Plan Generated",
        description: "AI has calculated optimal resource allocation.",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Unknown command. Try 'calculate' to generate resource plan",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-green-400">Resource Planning</h1>
        <ProgressTracker 
          stage="resource_planning" 
          progress={plan ? 80 : 20} 
        />
      </div>

      <CommandInput 
        onCommand={handleCommand}
        placeholder="Type 'calculate' to generate resource plan..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Budget Allocation</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Budget Range</span>
              <span>${budget.toLocaleString()}</span>
            </div>
            <Slider
              value={[budget]}
              onValueChange={([value]) => setBudget(value)}
              max={200000}
              step={5000}
              className="w-full"
            />
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Timeline</h2>
          {plan?.timeline.phases.map((phase, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{phase.name}</span>
              <span>{phase.duration} months</span>
            </div>
          ))}
        </Card>

        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Team Requirements</h2>
          {plan?.teamRequirements.roles.map((role, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{role.title}</span>
              <span>x{role.count}</span>
            </div>
          ))}
        </Card>

        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Tools & Infrastructure</h2>
          {plan?.tooling.categories.map((category, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-green-400 mb-2">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool, toolIndex) => (
                  <span
                    key={toolIndex}
                    className="px-2 py-1 bg-green-900/30 rounded text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
