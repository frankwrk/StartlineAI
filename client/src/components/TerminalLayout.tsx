import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Terminal, Code2, Lightbulb, BarChart3, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalLayoutProps {
  children: ReactNode;
}

export default function TerminalLayout({ children }: TerminalLayoutProps) {
  const [location] = useLocation();

  const navigationItems = [
    { path: "/", label: "Home", icon: Terminal },
    { path: "/idea-validation", label: "Validate Idea", icon: Lightbulb },
    { path: "/business-plan", label: "Business Plan", icon: Code2 },
    { path: "/resource-planning", label: "Resources", icon: BarChart3 },
    { path: "/mvp-guidance", label: "MVP Guide", icon: Rocket },
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="container mx-auto px-4">
        <header className="py-4 border-b border-green-800">
          <div className="flex items-center space-x-4">
            <Terminal className="h-8 w-8" />
            <h1 className="text-2xl font-bold">StartLine.ai</h1>
          </div>
        </header>

        <nav className="py-4">
          <ul className="flex flex-wrap gap-4">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link href={path}>
                  <a
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded hover:bg-green-900/20",
                      location === path && "bg-green-900/30"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="py-8">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-green-800">
            {children}
          </div>
        </main>

        <footer className="py-4 text-center text-green-600 border-t border-green-800">
          <p>Type 'help' for available commands</p>
        </footer>
      </div>
    </div>
  );
}
