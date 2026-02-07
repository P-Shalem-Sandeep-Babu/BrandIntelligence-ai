import React, { useState, useEffect } from 'react';
import { generateTextContent } from '../services/geminiService';
import { Loader2, Sparkles, Download, Check, Crown, Layers, FileText, ChevronDown, History } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ToolType } from '../types';
import { addToHistory, getHistoryByTool, HistoryItem } from '../services/historyService';
import HistoryViewer from './HistoryViewer';

interface OneShotGeneratorProps {
  systemInstruction: string;
  colorTheme: 'indigo' | 'emerald';
  defaultInput?: string;
}

const OneShotGenerator: React.FC<OneShotGeneratorProps> = ({
  systemInstruction,
  colorTheme,
  defaultInput = ''
}) => {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  // History State
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const toolType = ToolType.TOTAL_BRAND_ARCHITECT;

  useEffect(() => {
    if (showHistory) {
      setHistoryItems(getHistoryByTool(toolType));
    }
  }, [showHistory]);

  const themeClasses = colorTheme === 'indigo' 
    ? { 
        btn: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/20', 
        ring: 'focus:ring-indigo-500', 
        icon: 'text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-900/10',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-500'
      }
    : { 
        btn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20', 
        ring: 'focus:ring-emerald-500', 
        icon: 'text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500'
      };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setDownloaded(false);
    setShowHistory(false);
    
    setTimeout(() => {
        document.getElementById('results-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const prompt = `ACT AS A SENIOR CHIEF STRATEGY OFFICER.
    
    Your task: Architect a "Total Brand Strategy Masterfile" based on the input below.
    
    Input Context:
    "${input}"
    
    REQUIREMENTS:
    1. Synthesize insights from all strategic dimensions: Psychology, Risk, Differentiation, and Identity.
    2. Be critical and authoritative. Do not simply regurgitate the input.
    3. Follow the provided System Instruction structure exactly.
    4. Use professional formatting (Markdown, Tables, Headers).`;
    
    const text = await generateTextContent(prompt, systemInstruction);
    setResult(text);
    setLoading(false);

    addToHistory({
      toolType: toolType,
      input: input,
      output: text
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "Brand_Architecture_Report.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setInput(item.input);
    setResult(item.output);
  };

  // Custom Markdown Components for Professional Rendering
  const MarkdownComponents = {
    h1: ({node, ...props}: any) => (
      <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 md:mb-6 pb-2 md:pb-4 border-b border-slate-200 dark:border-slate-800" {...props} />
    ),
    h2: ({node, ...props}: any) => (
      <h2 className={`text-xl md:text-2xl font-bold mt-8 md:mt-12 mb-4 md:mb-6 flex items-center gap-2 ${themeClasses.text}`} {...props} />
    ),
    h3: ({node, ...props}: any) => (
      <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 md:mt-8 mb-2 md:mb-3" {...props} />
    ),
    p: ({node, ...props}: any) => (
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-sm md:text-lg" {...props} />
    ),
    ul: ({node, ...props}: any) => (
      <ul className="my-4 space-y-2 md:space-y-3" {...props} />
    ),
    li: ({node, ...props}: any) => (
      <li className="flex items-start gap-3 pl-1">
        <span className={`mt-2 h-1.5 w-1.5 md:mt-2.5 md:h-1.5 md:w-1.5 rounded-full flex-shrink-0 ${colorTheme === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
        <span className="text-slate-600 dark:text-slate-300 flex-1 text-sm md:text-base">{props.children}</span>
      </li>
    ),
    strong: ({node, ...props}: any) => (
      <strong className="font-bold text-slate-900 dark:text-white" {...props} />
    ),
    blockquote: ({node, ...props}: any) => (
      <blockquote className={`border-l-4 pl-4 md:pl-6 py-2 md:py-3 my-6 md:my-8 bg-slate-50 dark:bg-slate-800/30 italic rounded-r-lg ${themeClasses.border} text-slate-700 dark:text-slate-300 shadow-sm text-sm md:text-base`} {...props} />
    ),
    table: ({node, ...props}: any) => (
      <div className="overflow-x-auto my-6 md:my-10 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props} />
      </div>
    ),
    thead: ({node, ...props}: any) => (
      <thead className="bg-slate-50 dark:bg-slate-800" {...props} />
    ),
    th: ({node, ...props}: any) => (
      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap" {...props} />
    ),
    tbody: ({node, ...props}: any) => (
      <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800" {...props} />
    ),
    tr: ({node, ...props}: any) => (
      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" {...props} />
    ),
    td: ({node, ...props}: any) => (
      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-normal text-xs md:text-sm text-slate-600 dark:text-slate-300" {...props} />
    ),
    hr: ({node, ...props}: any) => (
      <hr className="my-8 md:my-12 border-slate-200 dark:border-slate-800" {...props} />
    ),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in-up pb-24">
      {/* Premium Hero Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-12 text-white shadow-2xl">
         <div className={`absolute inset-0 bg-gradient-to-r ${colorTheme === 'indigo' ? 'from-slate-900 via-indigo-900 to-slate-900' : 'from-slate-900 via-emerald-900 to-slate-900'}`} />
         <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
         
         <div className="relative z-10 flex flex-col items-center text-center">
            {/* History Toggle */}
            <div className="absolute top-0 right-0">
               <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 md:p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
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

            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-semibold mb-4 md:mb-6">
              <Crown className="h-3 w-3 md:h-4 md:w-4 text-yellow-400" />
              <span>Premium All-in-One Engine</span>
            </div>
            
            <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">
              Total Brand Architect
            </h1>
            <p className="text-sm md:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Input your vision, and our AI will architect your entire brand identity, strategy, and launch plan in a single comprehensive report.
            </p>
         </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Input Section */}
        <div className="glass-panel p-1 rounded-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 md:p-8">
               <div className="flex items-center gap-3 mb-4 md:mb-6">
                 <div className={`p-2 md:p-2.5 rounded-xl ${themeClasses.bg}`}>
                   <Layers className={`h-5 w-5 md:h-6 md:w-6 ${themeClasses.icon}`} />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">Input Context</h3>
                    <p className="text-xs text-slate-500">Define your vision parameters</p>
                 </div>
               </div>
               
               <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Business Details</label>
                  <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="e.g. I am launching a sustainable sneaker brand for Gen Z called 'EcoKicks'..."
                      className={`w-full min-h-[160px] md:min-h-[180px] rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-transparent focus:ring-2 ${themeClasses.ring} transition-all resize-y mb-6 text-sm leading-relaxed`}
                    />

                    <button
                      onClick={handleGenerate}
                      disabled={loading || !input.trim()}
                      className={`w-full py-3.5 md:py-4 rounded-xl text-white font-bold text-base md:text-lg shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 ${themeClasses.btn} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                      {loading ? 'Architecting...' : 'Generate Brand Bible'}
                    </button>
               </div>
            </div>
        </div>
        
        <div id="results-anchor"></div>

        {/* Output Section */}
        {(result || loading) && (
          <div className={`glass-panel p-1 rounded-2xl transition-all duration-700 animate-fade-in-up`}>
             <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden relative min-h-[300px] md:min-h-[400px]">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
                   <div className="flex items-center gap-3">
                     <div className="p-1.5 md:p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <FileText className="h-4 w-4 md:h-5 md:w-5 text-slate-500" />
                     </div>
                     <div>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white">Master Blueprint</span>
                        <span className="text-xs text-slate-500">{loading ? 'Generating...' : 'AI Generated Report'}</span>
                     </div>
                   </div>
                   
                   {result && !loading && (
                      <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:transform active:scale-95"
                      >
                        {downloaded ? <Check className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                        {downloaded ? 'Saved' : 'Download'}
                      </button>
                   )}
                </div>

                {/* Content Area */}
                <div className="p-5 md:p-12 bg-white dark:bg-slate-900">
                  {loading ? (
                     <div className="flex flex-col items-center justify-center py-16 md:py-20 space-y-6">
                        <div className="relative">
                            <div className={`absolute inset-0 blur-xl opacity-20 ${colorTheme === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                            <Loader2 className={`relative h-12 w-12 md:h-16 md:w-16 animate-spin ${colorTheme === 'indigo' ? 'text-indigo-600' : 'text-emerald-600'}`} />
                        </div>
                        <p className="text-base md:text-lg font-medium text-slate-500 animate-pulse text-center px-4">Constructing comprehensive strategy...</p>
                     </div>
                  ) : (
                    <div className="prose prose-slate dark:prose-invert md:prose-lg max-w-none">
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

export default OneShotGenerator;