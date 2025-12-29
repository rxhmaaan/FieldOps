import { format } from 'date-fns';
import { SearchResult } from '@/types/terminal';
import { Terminal, Hash, Building2, MapPin, Cpu, Calendar } from 'lucide-react';

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const formatDate = (date: Date) => {
    try {
      if (!date || isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd MMM yyyy');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="bg-card rounded-xl border border-border card-elevated overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Terminal Record</p>
              <p className="text-xs text-muted-foreground/70">Latest assignment data</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
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
                <span className="px-3 py-1.5 bg-accent/10 text-accent font-mono font-bold text-lg rounded-md">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            {/* Assignment Date */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Assignment Date</span>
              </div>
              <p className="text-base font-medium">{formatDate(result.assignmentDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
