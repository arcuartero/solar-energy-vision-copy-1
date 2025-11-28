import { Truck, HelpCircle, User, ChevronDown } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-end px-6 gap-8">
      <button className="flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors">
        <Truck className="h-5 w-5" />
        <span className="font-medium">I am moving</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      <button className="flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors">
        <HelpCircle className="h-5 w-5" />
        <span className="font-medium">Support & FAQ</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      <button className="flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors">
        <User className="h-5 w-5" />
        <span className="font-medium">Alberto Rodriguez</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      <button className="flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors">
        <span className="text-lg">🇬🇧</span>
        <span className="font-medium">EN</span>
        <ChevronDown className="h-4 w-4" />
      </button>
    </header>
  );
};
