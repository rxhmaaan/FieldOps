import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { ResultCard } from '@/components/ResultCard';
import { EmptyState } from '@/components/EmptyState';
import { loadTerminalData, searchTerminals, getDataStats } from '@/lib/dataLoader';
import { TerminalRecord, SearchResult } from '@/types/terminal';
import { Loader2 } from 'lucide-react';

type SearchState = 'initial' | 'loading' | 'result' | 'no-results';

const Index = () => {
  const [data, setData] = useState<TerminalRecord[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [searchState, setSearchState] = useState<SearchState>('initial');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const [recordCount, setRecordCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      setIsDataLoading(true);
      const terminalData = await loadTerminalData();
      setData(terminalData);
      const stats = getDataStats(terminalData);
      setRecordCount(stats.totalRecords);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Loading terminal data...</p>
          <p className="text-sm text-muted-foreground mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        <Header recordCount={recordCount} />
        
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
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
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
