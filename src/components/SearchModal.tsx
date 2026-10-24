import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { apiUrl } from '../api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const searchAffirmations = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(apiUrl(`/api/affirmations?search=${query}&published=true`));
        const data = await response.json();
        setResults(data.affirmations);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAffirmations, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-100">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search affirmations..."
            className="flex-1 text-lg outline-none placeholder:text-neutral-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-neutral-600">Searching...</div>
          ) : results.length === 0 && query.length >= 2 ? (
            <div className="py-8 text-center text-neutral-600">No results found</div>
          ) : results.length === 0 && query.length < 2 ? (
            <div className="py-8 text-center text-neutral-400">
              Type at least 2 characters to search
            </div>
          ) : (
            <div className="divide-y divide-purple-50">
              {results.map((affirmation) => (
                <a
                  key={affirmation.id}
                  href={`/affirmations/${affirmation.slug}`}
                  className="block px-6 py-4 hover:bg-purple-50 transition-colors"
                  onClick={onClose}
                >
                  <h3 className="font-semibold text-[#111215] mb-1">{affirmation.title}</h3>
                  <p className="text-sm text-neutral-600 line-clamp-2">{affirmation.excerpt}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
