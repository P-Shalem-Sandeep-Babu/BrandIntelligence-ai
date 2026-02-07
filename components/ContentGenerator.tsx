import React, { useState, useEffect } from 'react';
import { generateTextContent } from '../services/geminiService';
import { Loader2, Copy, Check, Sparkles, Feather, AlignLeft, History } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ToolType } from '../types';
import { addToHistory, getHistoryByTool, HistoryItem } from '../services/historyService';
import HistoryViewer from './HistoryViewer';

interface ContentGeneratorProps {
  title: string;
  description: string;
  placeholder: string;
  promptTemplate: (input: string) => string;
  systemInstruction: string;
  buttonLabel: string;
  colorTheme: 'indigo' | 'emerald';
  useDefaultStructure?: boolean;
  defaultInput?: string;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  title,
  description,
  placeholder,
  promptTemplate,
  systemInstruction,
  buttonLabel,
  colorTheme,
  useDefaultStructure = true,
  defaultInput = ''
}) => {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // History State
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Derived key for history (using title as proxy for ToolType since it's unique per tool in App.tsx)
  const historyKey = title.toUpperCase().replace(/\s+/g, '_') as ToolType;

  useEffect(() => {
    if (showHistory) {
      setHistoryItems(getHistoryByTool(historyKey));
    }
  }, [showHistory, historyKey]);

  const themeClasses = colorTheme === 'indigo' 
    ? { 
        btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none', 
        ring: 'focus:ring-indigo-500', 
        icon: 'text-indigo-600',
        marker: 'bg-indigo-500' 
      }
    : { 
        btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none', 
        ring: 'focus:ring-emerald-500', 
        icon: 'text-emerald-600',
        marker: 'bg-emerald-500' 
      };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setShowHistory(false);
    
    setTimeout(() => {
        document.getElementById('gen-result-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const prompt = promptTemplate(input);
    
    // Enforce structured output and business-grade vocabulary
    const defaultStructureInstruction = `
STRUCTURED OUTPUT REQUIREMENTS:
You MUST structure your response into the following 4 sections (use Markdown headers):
## 1. Main Output
[The core response to the prompt]

## 2. Emotional Intent
[The psychological impact or feeling this content aims to evoke]

## 3. Platform Suitability
[Best channels/mediums for this content (e.g., LinkedIn, Website, Internal)]

## 4. Improvement Suggestions
[Actionable tips to refine, scale, or optimize this output]

TONE & STYLE:
- Avoid generic, fluffy language.
- Use precise, business-grade vocabulary.
- Be strategic, analytical, and authoritative.`;

    const enrichedSystemInstruction = useDefaultStructure 
        ? `${systemInstruction}\n${defaultStructureInstruction}`
        : systemInstruction;

    const text = await generateTextContent(prompt, enrichedSystemInstruction);
    setResult(text);
    setLoading(false);

    // Save to History
    addToHistory({
      toolType: historyKey,
      input: input,
      output: text
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setInput(item.input);
    setResult(item.output);
  };

  const MarkdownComponents = {
    h1: ({node, ...props}: any) => <h1 className="text-slate-900 dark:text-white" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-slate-900 dark:text-white mt-6 md:mt-8 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2" {...props} />,
    li: ({node, ...props}: any) => (
      <li className="my-1">
        {props.children}
      </li>
    ),
    // Table components for proper rendering
    table: ({node, ...props}: any) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props} />
      </div>
    ),
    thead: ({node, ...props}: any) => (
      <thead className="bg-slate-50 dark:bg-slate-800" {...props} />
    ),
    th: ({node, ...props}: any) => (
      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap" {...props} />
    ),
    tbody: ({node, ...props}: any) => (
      <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800" {...props} />
    ),
    tr: ({node, ...props}: any) => (
      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" {...props} />
    ),
    td: ({node, ...props}: any) => (
      <td className="px-4 py-3 whitespace-normal text-sm text-slate-600 dark:text-slate-300" {...props} />
    ),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-fade-in-up pb-20 relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hidden md:block`}>
              <Feather className={`h-6 w-6 ${themeClasses.icon}`} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-lg leading-relaxed">{description}</p>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Recent History"
            >
              <History className="h-5 w-5" />
            </button>
            <HistoryViewer 
              isOpen={showHistory} 
              onClose={() => setShowHistory(false)} 
              items={historyItems} 
              onSelect={handleHistorySelect}
              type="text"
            />
          </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Input Panel */}
        <div className="glass-panel p-1 rounded-2xl">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 md:p-6">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide flex items-center justify-between">
                <span>Input Context</span>
                {input.length > 0 && <span className="text-xs font-normal opacity-50">{input.length} chars</span>}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className={`w-full min-h-[140px] md:min-h-[160px] rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-transparent focus:ring-2 ${themeClasses.ring} transition-all resize-y mb-6 text-sm leading-relaxed`}
            />
            
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-base md:text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg ${themeClasses.btn} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {loading ? 'Analyzing & Generating...' : buttonLabel}
            </button>
          </div>
        </div>
        
        <div id="gen-result-anchor"></div>

        {/* Result Panel */}
        {(result || loading) && (
          <div className={`relative glass-panel p-1 rounded-2xl transition-all duration-500 animate-fade-in-up`}>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 md:p-8 min-h-[200px] relative overflow-hidden flex flex-col">
               {/* Header Actions */}
              <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-2">
                    <AlignLeft className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{loading ? 'Processing' : 'AI Output'}</span>
                 </div>
                 {result && !loading && (
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                 )}
              </div>

              <div className="flex-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 opacity-70">
                        <Sparkles className={`h-8 w-8 animate-pulse ${colorTheme === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'}`} />
                        <p className="text-sm font-medium text-slate-500">Crafting content...</p>
                    </div>
                ) : (
                  <div className="animate-fade-in-up prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-li:marker:text-slate-400 prose-headings:font-bold">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{result}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator;