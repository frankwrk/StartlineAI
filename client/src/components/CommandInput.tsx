import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface CommandInputProps {
  onCommand: (command: string) => void;
  placeholder?: string;
}

export default function CommandInput({ onCommand, placeholder = "Enter a command..." }: CommandInputProps) {
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      onCommand(input.trim());
      setInput("");
      
      toast({
        description: `$ ${input}`,
        className: "font-mono bg-gray-900 border-green-800",
      });
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">$</span>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="pl-8 bg-black border-green-800 text-green-400 placeholder:text-green-800"
      />
    </div>
  );
}
