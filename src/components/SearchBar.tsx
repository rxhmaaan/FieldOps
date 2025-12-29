import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div
          className={`
            flex items-center gap-3 bg-card rounded-lg border-2 transition-all duration-200
            ${isFocused 
              ? 'border-primary shadow-search' 
              : 'border-border hover:border-muted-foreground/30'
            }
          `}
        >
          <div className="pl-5 flex items-center">
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            ) : (
              <Search className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter Terminal ID or Serial Number..."
            className="
              flex-1 py-5 text-lg bg-transparent outline-none
              placeholder:text-muted-foreground/60 font-medium
            "
            autoComplete="off"
            spellCheck={false}
          />
          
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 mr-2 rounded-md hover:bg-secondary transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="
              m-2 px-6 py-3 bg-primary text-primary-foreground font-semibold 
              rounded-md hover:bg-primary/90 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98]
            "
          >
            Search
          </button>
        </div>
      </div>
      
      <p className="mt-3 text-sm text-muted-foreground text-center">
        Search automatically detects TID or Serial Number
      </p>
    </form>
  );
}
