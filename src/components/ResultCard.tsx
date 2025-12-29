import { SearchResult } from '@/types/terminal';
import { Bot, Sparkles } from 'lucide-react';

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="animate-slide-up">
      <div className="bg-card rounded-2xl border border-border card-elevated overflow-hidden relative">
        {/* Subtle glow accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        {/* AI Assistant Header */}
        <div className="bg-primary/5 border-b border-border px-6 py-4 relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl animate-glow-pulse">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">TraceOne</p>
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse-subtle" />
            </div>
          </div>
        </div>

        {/* Conversational Response */}
        <div className="p-6 relative">
          <div className="space-y-4 text-base leading-relaxed text-foreground">
            {/* Main response */}
            <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              I found the record you're looking for! 🎯
            </p>
            
            {/* Terminal ID info */}
            <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              The <span className="font-semibold text-primary">Terminal ID</span> is{' '}
              <span className="font-mono font-bold text-terminal bg-primary/10 px-2 py-0.5 rounded">
                {result.tid || 'N/A'}
              </span>
              {result.serialNo && (
                <>
                  {' '}with <span className="font-semibold text-primary">Serial Number</span>{' '}
                  <span className="font-mono font-bold text-terminal bg-primary/10 px-2 py-0.5 rounded">
                    {result.serialNo}
                  </span>
                </>
              )}
              .
            </p>

            {/* Merchant info */}
            {result.merchantNameMid && (
              <p className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                This terminal is assigned to{' '}
                <span className="font-semibold text-merchant">
                  {result.merchantNameMid}
                </span>
                {result.city && (
                  <>
                    {' '}located in <span className="font-medium">{result.city}</span>
                  </>
                )}
                .
              </p>
            )}

            {/* Model info */}
            {result.currentModel && (
              <p className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                The device model is <span className="font-medium">{result.currentModel}</span>.
              </p>
            )}

            {/* Closing */}
            <p className="text-muted-foreground text-sm pt-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              Is there anything else you'd like to know?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
