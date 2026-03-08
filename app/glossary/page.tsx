import { Glossary } from '@/components/ui/Glossary';
import { Book } from 'lucide-react';

export const metadata = {
  title: 'Arcium Glossary | Encrypted Supercomputer Terminology',
  description: 'A comprehensive guide to the terms, protocols, and architectural components of the Arcium Network.',
};

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <main className="max-w-7xl mx-auto pt-10">
        <header className="mb-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6">
            <Book className="text-indigo-400" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Arcium <span className="text-indigo-500">Glossary</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            A comprehensive reference for the protocols, architecture, and cryptographic concepts powering the Arcium encrypted supercomputer.
          </p>
        </header>

        <Glossary />
      </main>
    </div>
  );
}
