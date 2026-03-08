import { getArticleContent } from '@/lib/contentReader';
import { topics } from '@/content/topics';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  
  const content = getArticleContent(topic);
  const topicData = topics.find(t => t.slug === topic);

  if (!content) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Topic Not Found</h1>
        <p className="text-zinc-500 mb-6">The article you are looking for does not exist yet.</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-4xl mx-auto">
      <Link href="/" className="text-sm font-semibold text-zinc-500 hover:text-indigo-400 mb-8 inline-block">&larr; Back to Explorer</Link>
      
      <div className="prose prose-invert prose-indigo max-w-none prose-headings:font-bold prose-headings:text-white prose-h1:text-4xl prose-h1:mb-10 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-8 prose-strong:text-white prose-li:text-zinc-300">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
        
        <div className="my-16 p-8 border border-zinc-800 rounded-2xl bg-black shadow-2xl">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">Interactive Assignment: {topicData?.title}</h3>
          <p className="text-zinc-400 text-sm mb-6">Head over to the visualizer tools to see this concept applied in real-time within the Arcium Network.</p>
          <div className="flex gap-4">
             {topic === 'mpc' || topic === 'secret-sharing' ? (
                <Link href="/visualizer" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                  Launch MPC Visualizer
                </Link>
             ) : (
                <Link href="/architecture" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                  Open Architecture Explorer
                </Link>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
