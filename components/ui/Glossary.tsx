'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, ChevronRight, X } from 'lucide-react';
import { glossaryTerms, GlossaryTerm } from '@/content/glossary';
import Link from 'next/link';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLetter = selectedLetter ? term.term.toUpperCase().startsWith(selectedLetter) : true;
      return matchesSearch && matchesLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedLetter]);

  const toggleLetter = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-black/40 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm sticky top-20 z-30">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1 items-center justify-center">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-bold transition-all ${
              selectedLetter === null 
                ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
            }`}
          >
            ALL
          </button>
          {ALPHABET.map((letter) => {
            const hasTerms = glossaryTerms.some(t => t.term.toUpperCase().startsWith(letter));
            return (
              <button
                key={letter}
                disabled={!hasTerms}
                onClick={() => toggleLetter(letter)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-bold transition-all ${
                  selectedLetter === letter 
                    ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                    : hasTerms 
                      ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' 
                      : 'text-zinc-800 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term, index) => (
              <motion.div
                key={term.term}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group flex flex-col bg-black border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:shadow-[0_0_40px_rgba(0,0,0,1)] transition-all relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {term.term}
                  </h3>
                  {term.category && (
                    <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {term.category}
                    </span>
                  )}
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                  {term.definition}
                </p>

                {term.link && (
                  <Link 
                    href={term.link.url}
                    className="mt-6 flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 group/link"
                  >
                    {term.link.label}
                    <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}

                {term.imagePath && (
                   <div className="mt-4 rounded-xl overflow-hidden border border-zinc-800/50 bg-zinc-900/20 aspect-video relative flex items-center justify-center">
                      <img src={term.imagePath} alt={term.term} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                   </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                <Search size={32} />
              </div>
              <p className="text-lg">No terms found matching your criteria.</p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedLetter(null);}}
                className="text-indigo-400 hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
