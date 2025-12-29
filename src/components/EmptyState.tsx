import { Search, FileSearch } from 'lucide-react';

interface EmptyStateProps {
  type: 'initial' | 'no-results';
  query?: string;
}

export function EmptyState({ type, query }: EmptyStateProps) {
  if (type === 'initial') {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary mb-6">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Ready to Search
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Enter a Terminal ID or Serial Number to find the associated merchant and device information.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-destructive/10 mb-6">
        <FileSearch className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Match Found
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        No matching Terminal ID or Serial Number found for{' '}
        <span className="font-mono font-semibold text-foreground">"{query}"</span>
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Please check the input and try again.
      </p>
    </div>
  );
}
