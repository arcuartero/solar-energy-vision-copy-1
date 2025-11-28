import { HelpCircle, User, ChevronDown } from "lucide-react";
import sunLogo from "@/assets/sun-logo.png";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img src={sunLogo} alt="Logo" className="h-8 w-8" />
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Energy Overview</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="h-4 w-4" />
          <span>Support & FAQ</span>
        </button>

        <button className="flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors">
          <User className="h-4 w-4" />
          <span>User</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <span className="font-medium">EN</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
