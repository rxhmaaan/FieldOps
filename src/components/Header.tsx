import { Terminal, Database } from 'lucide-react';

interface HeaderProps {
  recordCount?: number;
}

export function Header({ recordCount }: HeaderProps) {
  return (
    <header className="text-center mb-10">
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-primary rounded-xl">
          <Terminal className="h-8 w-8 text-primary-foreground" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
        E&N Field Operations
      </h1>
      <p className="text-lg text-muted-foreground mb-4">
        Terminal & Serial Lookup System
      </p>
      {recordCount !== undefined && recordCount > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{recordCount.toLocaleString()}</span> records loaded
          </span>
        </div>
      )}
    </header>
  );
}
