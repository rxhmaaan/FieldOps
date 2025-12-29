import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { ResultCard } from '@/components/ResultCard';
import { EmptyState } from '@/components/EmptyState';
import { loadTerminalData, searchTerminals } from '@/lib/dataLoader';
import { TerminalRecord, SearchResult } from '@/types/terminal';
import { Loader2 } from 'lucide-react';

type SearchState = 'initial' | 'loading' | 'result' | 'no-results';

// Floating particles component for ambient animation
function FloatingParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-particle"
          style={{
            left: `${15 + i * 15}%`,
            animationDelay: `${i * 3}s`,
            animationDuration: `${18 + i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

const Index = () => {
  const [data, setData] = useState<TerminalRecord[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [searchState, setSearchState] = useState<SearchState>('initial');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [lastQuery, setLastQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsDataLoading(true);
      const terminalData = await loadTerminalData();
      setData(terminalData);
      setIsDataLoading(false);
    }
    loadData();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchState('initial');
      setResult(null);
      setLastQuery('');
      return;
    }

    setLastQuery(query);
    setSearchState('loading');

    // Simulate a brief loading state for UX
    setTimeout(() => {
      const searchResult = searchTerminals(data, query);
      
      if (searchResult) {
        setResult(searchResult);
        setSearchState('result');
      } else {
        setResult(null);
        setSearchState('no-results');
      }
    }, 200);
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <FloatingParticles />
        <div className="text-center animate-fade-in relative z-10">
          <div className="relative">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-subtle" />
          </div>
          <p className="text-lg font-medium text-foreground">Initializing system...</p>
          <p className="text-sm text-muted-foreground mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background relative">
      <FloatingParticles />
      
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/2 pointer-events-none" />
      
      <div className="container py-8 md:py-12 relative z-10">
        <Header />
        
        <div className="max-w-2xl mx-auto mb-10">
          <SearchBar 
            onSearch={handleSearch} 
            isLoading={searchState === 'loading'} 
          />
        </div>

        <div className="max-w-2xl mx-auto">
          {searchState === 'initial' && <EmptyState type="initial" />}
          {searchState === 'loading' && (
            <div className="text-center py-16 animate-fade-in">
              <div className="relative inline-block">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse-subtle" />
              </div>
              <p className="text-muted-foreground mt-4">Searching...</p>
            </div>
          )}
          {searchState === 'result' && result && <ResultCard result={result} />}
          {searchState === 'no-results' && <EmptyState type="no-results" query={lastQuery} />}
        </div>
      </div>
    </main>
  );
};

export default Index;