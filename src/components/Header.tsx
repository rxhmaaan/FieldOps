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
      <p className="text-base text-muted-foreground max-w-md mx-auto">
        An initiative from e& Field Operations Innovation Initiatives.
      </p>
    </header>
  );
}