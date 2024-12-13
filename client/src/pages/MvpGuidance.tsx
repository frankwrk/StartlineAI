import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CommandInput from "@/components/CommandInput";
import ProgressTracker from "@/components/ProgressTracker";
import { useToast } from "@/hooks/use-toast";

interface MvpRequirement {
  features: {
    core: string[];
    optional: string[];
  };
  userStories: {
    priority: string[];
    secondary: string[];
  };
  technicalStack: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
  deploymentPlan: string;
}

export default function MvpGuidance() {
  const { toast } = useToast();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const { data: mvp, isLoading } = useQuery<MvpRequirement>({
    queryKey: ["/api/projects/1/mvp-requirements"],
  });

  const mutation = useMutation({
    mutationFn: async (data: Partial<MvpRequirement>) => {
      const response = await fetch("/api/projects/1/mvp-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save MVP requirements");
      return response.json();
    },
  });

  const handleCommand = (command: string) => {
    if (command === "generate") {
      mutation.mutate({
        features: {
          core: [
            "User Authentication",
            "Basic CRUD Operations",
            "Search Functionality",
            "Mobile Responsive UI"
          ],
          optional: [
            "Advanced Analytics",
            "Social Sharing",
            "Real-time Updates"
          ]
        },
        userStories: {
          priority: [
            "As a user, I want to sign up quickly",
            "As a user, I want to create and save items",
            "As a user, I want to search through my data"
          ],
          secondary: [
            "As a user, I want to share my progress",
            "As a user, I want to see analytics"
          ]
        },
        technicalStack: {
          frontend: ["React", "Tailwind CSS", "TypeScript"],
          backend: ["Node.js", "Express", "PostgreSQL"],
          infrastructure: ["Docker", "AWS", "CI/CD"]
        },
        deploymentPlan: "1. Setup CI/CD pipeline\n2. Configure staging environment\n3. Deploy MVP\n4. Monitor and iterate"
      });
      toast({
        title: "MVP Requirements Generated",
        description: "AI has created your MVP development roadmap.",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Unknown command. Try 'generate' to create MVP requirements",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-green-400">MVP Development Guide</h1>
        <ProgressTracker 
          stage="mvp_development" 
          progress={mvp ? 90 : 30} 
        />
      </div>

      <CommandInput 
        onCommand={handleCommand}
        placeholder="Type 'generate' to create MVP requirements..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Core Features</h2>
          <div className="space-y-2">
            {mvp?.features.core.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${index}`}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFeatures([...selectedFeatures, feature]);
                    } else {
                      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                    }
                  }}
                />
                <label
                  htmlFor={`feature-${index}`}
                  className="text-green-300"
                >
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">User Stories</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-green-400 mb-2">Priority</h3>
              <ul className="list-disc list-inside space-y-1">
                {mvp?.userStories.priority.map((story, index) => (
                  <li key={index} className="text-green-300">{story}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Technical Stack</h2>
          {mvp?.technicalStack && Object.entries(mvp.technicalStack).map(([category, tools]) => (
            <div key={category} className="mb-4">
              <h3 className="text-green-400 capitalize mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-900/30 rounded text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Card>

        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Deployment Plan</h2>
          <pre className="whitespace-pre-wrap text-green-300">
            {mvp?.deploymentPlan}
          </pre>
        </Card>
      </div>
    </div>
  );
}
