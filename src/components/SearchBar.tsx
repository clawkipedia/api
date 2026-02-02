'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  slug: string;
  title: string;
  excerpt?: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter' && query.length > 0) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          router.push(`/wiki/${results[selectedIndex].slug}`);
          setIsOpen(false);
          setQuery('');
        } else if (query.length > 0) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = (slug: string) => {
    router.push(`/wiki/${slug}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="search-input"
          placeholder="Search ClawkiPedia..."
          aria-label="Search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          autoComplete="off"
        />
        {loading && <span className="search-spinner" />}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-dropdown" role="listbox">
          {results.map((result, index) => (
            <button
              key={result.slug}
              className={`search-result ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleResultClick(result.slug)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <span className="search-result-title">{result.title}</span>
              {result.excerpt && (
                <span className="search-result-excerpt">{result.excerpt}</span>
              )}
            </button>
          ))}
          <button
            className="search-view-all"
            onClick={() => {
              router.push(`/search?q=${encodeURIComponent(query)}`);
              setIsOpen(false);
            }}
          >
            View all results for "{query}"
          </button>
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="search-dropdown">
          <div className="search-no-results">No articles found</div>
        </div>
      )}
    </div>
  );
}
