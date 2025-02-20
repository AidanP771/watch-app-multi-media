import React, { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collections } from '../data/collections';

interface SearchResult {
  id: number;
  name: string;
  price: number;
  image: string;
}

const SearchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (searchTerm) {
      const allWatches = collections.flatMap(collection => collection.watches);
      const filtered = allWatches.filter(watch =>
        watch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        watch.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleResultClick = (id: number) => {
    navigate(`/shop/${id}`);
    onClose();
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div
        ref={modalRef}
        className="bg-primary-light w-full max-w-2xl mx-4 rounded-lg shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 border-b border-gray-dark flex items-center gap-4">
          <Search className="w-5 h-5 text-gray-light" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for watches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-light"
          />
          <button
            onClick={onClose}
            className="text-gray-light hover:text-white transition"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-primary rounded-lg transition group"
                >
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="text-white group-hover:text-secondary transition">
                      {result.name}
                    </h3>
                    <p className="text-secondary">
                      ${result.price.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="p-8 text-center text-gray-light">
              No results found for "{searchTerm}"
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;