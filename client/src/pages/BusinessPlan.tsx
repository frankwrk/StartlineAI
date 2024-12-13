import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommandInput from "@/components/CommandInput";
import ProgressTracker from "@/components/ProgressTracker";
import { useToast } from "@/hooks/use-toast";

interface BusinessPlan {
  executiveSummary: string;
  marketAnalysis: string;
  financialProjections: any;
  strategy: string;
}

export default function BusinessPlan() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");

  const { data: plan, isLoading } = useQuery<BusinessPlan>({
    queryKey: ["/api/projects/1/business-plan"],
  });

  const mutation = useMutation({
    mutationFn: async (data: Partial<BusinessPlan>) => {
      const response = await fetch("/api/projects/1/business-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save business plan");
      return response.json();
    },
  });

  const handleCommand = (command: string) => {
    const tabMap: Record<string, string> = {
      "summary": "summary",
      "market": "market",
      "finance": "finance",
      "strategy": "strategy",
    };

    if (tabMap[command]) {
      setActiveTab(tabMap[command]);
    } else if (command === "generate") {
      mutation.mutate({
        executiveSummary: "AI-generated executive summary...",
        marketAnalysis: "Comprehensive market analysis...",
        financialProjections: {
          year1: { revenue: 100000, costs: 80000 },
          year2: { revenue: 250000, costs: 150000 },
          year3: { revenue: 500000, costs: 300000 }
        },
        strategy: "Detailed growth strategy..."
      });
      toast({
        title: "Business Plan Generated",
        description: "AI has created your initial business plan framework.",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Unknown command. Try 'summary', 'market', 'finance', 'strategy', or 'generate'",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-green-400">Business Plan Generator</h1>
        <ProgressTracker 
          stage="business_plan" 
          progress={plan ? 75 : 25} 
        />
      </div>

      <CommandInput 
        onCommand={handleCommand}
        placeholder="Type section name or 'generate' for AI assistance..."
      />

      <Card className="bg-gray-900/50 border-green-800 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-900 border-green-800">
            <TabsTrigger value="summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
            <TabsTrigger value="finance">Financials</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Textarea
              value={plan?.executiveSummary || ""}
              className="bg-black border-green-800 text-green-400 min-h-[300px]"
              placeholder="Enter executive summary..."
            />
          </TabsContent>

          <TabsContent value="market">
            <Textarea
              value={plan?.marketAnalysis || ""}
              className="bg-black border-green-800 text-green-400 min-h-[300px]"
              placeholder="Enter market analysis..."
            />
          </TabsContent>

          <TabsContent value="finance">
            <pre className="bg-black p-4 rounded border border-green-800 text-green-400 overflow-auto">
              {plan?.financialProjections 
                ? JSON.stringify(plan.financialProjections, null, 2)
                : "Financial projections will appear here..."}
            </pre>
          </TabsContent>

          <TabsContent value="strategy">
            <Textarea
              value={plan?.strategy || ""}
              className="bg-black border-green-800 text-green-400 min-h-[300px]"
              placeholder="Enter business strategy..."
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            className="border-green-800 text-green-400"
            onClick={() => handleCommand("generate")}
          >
            Generate Plan
          </Button>
        </div>
      </Card>
    </div>
  );
}
