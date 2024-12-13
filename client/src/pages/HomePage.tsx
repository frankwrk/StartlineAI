import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import CommandInput from "@/components/CommandInput";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleCommand = (command: string) => {
    const commands = {
      help: () => {
        toast({
          title: "Available Commands",
          description: `
            validate - Start idea validation
            plan - Create business plan
            resources - Plan resources
            mvp - MVP development guide
          `,
          className: "font-mono bg-gray-900 border-green-800",
        });
      },
      validate: () => setLocation("/idea-validation"),
      plan: () => setLocation("/business-plan"),
      resources: () => setLocation("/resource-planning"),
      mvp: () => setLocation("/mvp-guidance"),
    };

    const cmd = commands[command as keyof typeof commands];
    if (cmd) {
      cmd();
    } else {
      toast({
        variant: "destructive",
        description: "Command not found. Type 'help' for available commands.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-green-400">Welcome to StartLine.ai</h1>
        <p className="text-green-300">Your AI-powered entrepreneurship terminal</p>
      </div>

      <CommandInput onCommand={handleCommand} placeholder="Type 'help' to get started..." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Quick Start</h2>
          <ul className="space-y-2 text-green-300">
            <li>• Type 'validate' to begin idea validation</li>
            <li>• Type 'plan' to create a business plan</li>
            <li>• Type 'resources' to plan your resources</li>
            <li>• Type 'mvp' for MVP development guidance</li>
          </ul>
        </Card>

        <Card className="bg-gray-900/50 border-green-800 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Why StartLine.ai?</h2>
          <ul className="space-y-2 text-green-300">
            <li>• AI-powered guidance at every step</li>
            <li>• Systematic approach to startup building</li>
            <li>• Real-time validation and feedback</li>
            <li>• Track progress and milestones</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
