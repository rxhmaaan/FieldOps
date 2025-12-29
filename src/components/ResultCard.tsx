import { SearchResult } from '@/types/terminal';
import { Terminal, Hash, Building2, MapPin, Cpu } from 'lucide-react';

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="animate-slide-up">
      <div className="bg-card rounded-xl border border-border card-elevated overflow-hidden relative">
        {/* Subtle glow accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-primary/5 border-b border-border px-6 py-4 relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg animate-glow-pulse">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Terminal Record</p>
              <p className="text-xs text-muted-foreground/70">Latest assignment data</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 relative">
          {/* Primary Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Terminal ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">Terminal ID</span>
              </div>
              <p className="text-2xl font-bold font-mono text-terminal tracking-wide">
                {result.tid || 'N/A'}
              </p>
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Cpu className="h-4 w-4" />
                <span className="text-sm font-medium">Serial Number</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="px-3 py-1.5 bg-primary/10 text-primary font-mono font-bold text-lg rounded-md">
                  {result.serialNo || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Merchant Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">Merchant Name - MID</span>
            </div>
            <p className="text-lg font-semibold text-merchant">
              {result.merchantNameMid || 'N/A'}
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Secondary Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* City */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">City</span>
              </div>
              <p className="text-base font-medium">{result.city || 'N/A'}</p>
            </div>

            {/* Current Model */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Cpu className="h-4 w-4" />
                <span className="text-sm font-medium">Model</span>
              </div>
              <p className="text-base font-medium">{result.currentModel || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}