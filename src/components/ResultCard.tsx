import { useState } from 'react';
import { SearchResult } from '@/types/terminal';
import { Bot, Sparkles, RefreshCw, FileCheck, Lock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import x990Image from '@/assets/x990.png';
import paxA920Image from '@/assets/pax_a920.png';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ResultCardProps {
  result: SearchResult;
}

// Helper to check if model matches x990 or pax a920
function getDeviceImage(model: string | undefined): string | null {
  if (!model) return null;
  const lowerModel = model.toLowerCase();
  if (lowerModel.includes('x990')) return x990Image;
  if (lowerModel.includes('a920') || lowerModel.includes('pax')) return paxA920Image;
  return null;
}

function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

function getReplacementMessage(count: number): string {
  if (count === 1) return 'This device has been replaced once';
  if (count === 2) return 'This device has been replaced twice';
  return `This device has been replaced ${count} times`;
}

function getOrdinal(n: number): string {
  const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
  return ordinals[n] || `${n + 1}th`;
}

export function ResultCard({ result }: ResultCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deviceImage = getDeviceImage(result.currentModel);
  const hasInstallationDate = result.installationDate && result.installationDate.getTime() > 0;
  const hasReplacements = result.replacementDates && result.replacementDates.length > 0;
  const hasDeliveryNote = result.deliveryNoteUrl && result.deliveryNoteUrl.length > 0;

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
          <div className="flex flex-col md:flex-row gap-6">
            {/* Text content */}
            <div className="flex-1 space-y-4 text-base leading-relaxed text-foreground">
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

              {/* Installation date */}
              {hasInstallationDate && (
                <p className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  📅 The device was originally installed on{' '}
                  <span className="font-semibold text-primary">
                    {formatDate(result.installationDate!)}
                  </span>.
                </p>
              )}

              {/* Replacement history */}
              {hasReplacements && (
                <div className="animate-fade-in bg-muted/50 rounded-xl p-4 border border-border/50" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      {getReplacementMessage(result.replacementDates.length)}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {result.replacementDates.map((date, index) => (
                      <p key={index} className="text-muted-foreground">
                        <span className="font-medium text-foreground">{getOrdinal(index)} replacement:</span>{' '}
                        {formatDate(date)}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Note - Proof of Delivery */}
              {hasDeliveryNote && (
                <div className="animate-fade-in" style={{ animationDelay: hasReplacements ? '0.7s' : '0.6s' }}>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                      >
                        <FileCheck className="h-4 w-4 text-primary" />
                        View Proof of Delivery
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileCheck className="h-5 w-5 text-primary" />
                          Proof of Delivery
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                          Access the delivery note for Terminal ID: <span className="font-mono font-semibold">{result.tid}</span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 pt-4">
                        <a 
                          href={result.deliveryNoteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Delivery Note
                        </a>
                        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <Lock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold">Confidential:</span> Only supervisors can access this feature. 
                            This document contains sensitive delivery information.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Closing */}
              <p className="text-muted-foreground text-sm pt-2 animate-fade-in" style={{ animationDelay: hasDeliveryNote ? '0.8s' : (hasReplacements ? '0.7s' : '0.5s') }}>
                Is there anything else you'd like to know?
              </p>
            </div>

            {/* Device Image - only for x990 or PAX A920 */}
            {deviceImage && (
              <div className="flex-shrink-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="relative p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-border/50">
                  <img 
                    src={deviceImage} 
                    alt={result.currentModel || 'Device'} 
                    className="w-32 h-auto object-contain mx-auto drop-shadow-lg"
                  />
                  <p className="text-xs text-center text-muted-foreground mt-2 font-medium">
                    {result.currentModel}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
