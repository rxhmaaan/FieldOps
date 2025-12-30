import { Zap } from 'lucide-react';
import logo from '@/assets/logo.png';

export function Header() {
  return (
    <header className="text-center mb-10 animate-fade-in">
      <div className="inline-flex items-center justify-center mb-6">
        <img 
          src={logo} 
          alt="e& Field Operations" 
          className="h-16 md:h-20 w-auto animate-float"
        />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
        TraceOne
      </h1>
      <p className="text-base text-muted-foreground max-w-md mx-auto mb-4">
        An initiative from e& Field Operations Innovation Initiatives.
      </p>
      
      {/* Time-saving concept badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full animate-pulse-subtle">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          <span className="text-muted-foreground line-through">30 min</span>
          <span className="mx-2">→</span>
          <span className="text-primary font-bold">10 sec</span>
        </span>
        <span className="text-xs text-muted-foreground hidden sm:inline">instant lookup</span>
      </div>
    </header>
  );
}