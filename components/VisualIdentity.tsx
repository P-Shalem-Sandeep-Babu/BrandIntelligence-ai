import React, { useState, useEffect } from 'react';
import { generateBrandImage, generateTextContent } from '../services/geminiService';
import { Loader2, Download, Image as ImageIcon, AlertCircle, RefreshCw, Sparkles, Layers, Info, History, BrainCircuit, Check, Wand2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ToolType } from '../types';
import { addToHistory, getHistoryByTool, HistoryItem } from '../services/historyService';
import HistoryViewer from './HistoryViewer';

interface VisualIdentityProps {
  mode: 'STARTUP' | 'EXISTING';
  defaultInput?: string;
}

const STYLE_OPTIONS = [
  { id: 'Minimalist & Modern', img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=300&q=80' },
  { id: 'Bold & Geometric', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80' },
  { id: 'Luxury & Serif', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=300&q=80' },
  { id: 'Tech & Futuristic', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80' },
  { id: 'Hand-drawn & Organic', img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=300&q=80' },
  { id: 'Vintage & Retro', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=300&q=80' },
  { id: 'Art Deco & Elegant', img: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?auto=format&fit=crop&w=300&q=80' },
  { id: 'Cyberpunk & Neon', img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=300&q=80' },
  { id: 'Hand-painted & Watercolor', img: 'https://images.unsplash.com/photo-1579783902614-a3fb39279c0f?auto=format&fit=crop&w=300&q=80' },
  { id: 'Abstract & Conceptual', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=300&q=80' },
  { id: '3D & Isometric', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
  { id: 'Corporate & Professional', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80' },
];

const PROMPT_ENHANCERS = [
  {
    category: 'Brand Personality',
    keywords: ['Trustworthy', 'Innovative', 'Playful', 'Luxurious', 'Sustainable', 'Bold', 'Minimalist', 'Rebellious']
  },
  {
    category: 'Industry Context',
    keywords: ['SaaS / Tech', 'Coffee / F&B', 'Fashion / Retail', 'Finance', 'Wellness', 'Real Estate', 'Gaming']
  },
  {
    category: 'Visual Mood',
    keywords: ['Professional', 'Energetic', 'Calm', 'Whimsical', 'Futuristic', 'Nostalgic', 'Elegant', 'Gritty']
  }
];

const VisualIdentity: React.FC<VisualIdentityProps> = ({ mode, defaultInput = '' }) => {
  const [description, setDescription] = useState(defaultInput);
  const [style, setStyle] = useState('Minimalist & Modern');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rationale, setRationale] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorSuggestion, setErrorSuggestion] = useState<string | null>(null);

  // History
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const toolType = ToolType.VISUAL_IDENTITY;

  useEffect(() => {
    if (showHistory) {
      setHistoryItems(getHistoryByTool(toolType));
    }
  }, [showHistory]);

  const isStartup = mode === 'STARTUP';
  const theme = isStartup 
    ? { btn: 'bg-indigo-600 hover:bg-indigo-700', ring: 'focus:ring-indigo-500', icon: 'text-indigo-600', text: 'text-indigo-600', activeBorder: 'border-indigo-500', activeBg: 'bg-indigo-500', lightBg: 'bg-indigo-50', hoverLightBg: 'hover:bg-indigo-100' }
    : { btn: 'bg-emerald-600 hover:bg-emerald-700', ring: 'focus:ring-emerald-500', icon: 'text-emerald-600', text: 'text-emerald-600', activeBorder: 'border-emerald-500', activeBg: 'bg-emerald-500', lightBg: 'bg-emerald-50', hoverLightBg: 'hover:bg-emerald-100' };

  const handleGenerate = async () => {
    if (!description) return;
    setLoading(true);
    setError(null);
    setErrorSuggestion(null);
    setImageUrl(null);
    setRationale('');
    setShowHistory(false);
    
    // Smooth scroll placeholder
    setTimeout(() => {
        document.getElementById('image-result-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const imagePrompt = `Design a professional brand logo or visual identity asset. 
    Style: ${style}. 
    Company/Context Description: ${description}. 
    Ensure high contrast, vector-like quality, suitable for business use.`;

    const psychologyPrompt = `You are a Brand Psychologist. Analyze the visual identity described as: "${description}" with the style "${style}".

    Explain the design choices using brand psychology (use Markdown):
    • **Color Psychology**: Why the likely colors work for this audience.
    • **Shape & Emotions**: What emotions the logo shape/imagery creates.
    • **Typography & Trust**: How the implied typography style affects trust.

    Be concise, professional, and authoritative.`;

    try {
      // Execute in parallel
      const [imgResult, textResult] = await Promise.all([
        generateBrandImage(imagePrompt),
        generateTextContent(psychologyPrompt, "You are a Brand Psychologist and Visual Strategy Expert.")
      ]);

      setImageUrl(imgResult);
      setRationale(textResult);

      addToHistory({
        toolType: toolType,
        input: `${style} - ${description}`,
        output: imgResult,
        meta: { rationale: textResult }
      });
    } catch (err: any) {
      console.error("VisualIdentity Generation Error:", err);
      
      // Default generic error state
      let msg = "Generation Failed";
      let suggestion = "We encountered an issue generating your asset. Please try again or modify your request.";
      
      const rawError = err.message ? err.message.toUpperCase() : "";

      // Map specific error scenarios to user-friendly messages
      if (rawError.includes("SAFETY") || rawError.includes("BLOCKED") || rawError.includes("FINISH REASON: SAFETY")) {
          msg = "Blocked by Safety Filters";
          suggestion = "The AI detected potentially sensitive content. Try removing specific names of people, avoiding sensitive topics, or describing visual elements more abstractly.";
      } else if (rawError.includes("QUOTA") || rawError.includes("429") || rawError.includes("RESOURCE") || rawError.includes("EXHAUSTED")) {
          msg = "System Busy";
          suggestion = "We are currently experiencing high traffic. Please wait a moment and try again.";
      } else if (rawError.includes("RECITATION") || rawError.includes("COPYRIGHT") || rawError.includes("FINISH REASON: RECITATION")) {
           msg = "Copyright Restriction";
           suggestion = "The request might resemble existing copyrighted material too closely. Try describing a more generic or original concept.";
      } else if (rawError.includes("UNABLE TO GENERATE") || rawError.includes("NO IMAGE DATA")) {
          msg = "Generation Incomplete";
          suggestion = "The model processed the request but didn't return an image. Try focusing your description on physical objects and colors.";
      } else if (rawError.includes("NETWORK") || rawError.includes("FETCH")) {
          msg = "Connection Error";
          suggestion = "Please check your internet connection and try again.";
      }

      setError(msg);
      setErrorSuggestion(suggestion);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    // Basic parsing to separate style and description if possible
    if (item.input.includes(' - ')) {
      const [s, d] = item.input.split(' - ');
      setStyle(s);
      setDescription(d);
    } else {
      setDescription(item.input);
    }
    setImageUrl(item.output);
    setRationale(item.meta?.rationale || '');
  };

  const handleAddKeyword = (keyword: string) => {
    setDescription(prev => {
        const trimmed = prev.trim();
        if (trimmed.length > 0) {
            // Avoid duplicates at the end
            if (trimmed.toLowerCase().endsWith(keyword.toLowerCase())) return trimmed;
            return `${trimmed}, ${keyword}`;
        }
        return keyword;
    });
  };

  // Custom Markdown Components for Consistent Rendering
  const MarkdownComponents = {
    li: ({node, ...props}: any) => (
      <li className="my-1 text-slate-600 dark:text-slate-300">{props.children}</li>
    ),
    // Table Components just in case rationale includes tables
    table: ({node, ...props}: any) => (
      <div className="overflow-x-auto my-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/50" {...props} />
      </div>
    ),
    thead: ({node, ...props}: any) => <thead className="bg-slate-50 dark:bg-slate-800/50" {...props} />,
    th: ({node, ...props}: any) => <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap" {...props} />,
    tbody: ({node, ...props}: any) => <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50" {...props} />,
    tr: ({node, ...props}: any) => <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" {...props} />,
    td: ({node, ...props}: any) => <td className="px-3 py-2 whitespace-normal text-xs text-slate-600 dark:text-slate-300" {...props} />,
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up space-y-6 md:space-y-8 pb-20 relative">
      
      {/* Input Section */}
      <div className="glass-panel p-1 rounded-2xl">
         <div className="bg-white dark:bg-slate-900 rounded-xl p-5 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${theme.icon}`}>
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                    {isStartup ? 'Logo Creator' : 'Identity Refresher'}
                  </h2>
                  <p className="text-xs text-slate-500">AI-powered vector graphics & psychology</p>
                </div>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  <History className="h-5 w-5" />
                </button>
                <HistoryViewer 
                  isOpen={showHistory} 
                  onClose={() => setShowHistory(false)} 
                  items={historyItems} 
                  onSelect={handleHistorySelect}
                  type="image"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Company Context</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g., A minimalist coffee shop logo featuring a robot barista..."
                  className={`w-full h-32 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-transparent focus:ring-2 ${theme.ring} transition-all resize-none`}
                />
                
                {/* Prompt Enhancers */}
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                        <Wand2 className={`h-3.5 w-3.5 ${theme.text}`} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">AI Prompt Enhancers</span>
                    </div>
                    <div className="space-y-3">
                        {PROMPT_ENHANCERS.map((group) => (
                            <div key={group.category} className="flex flex-wrap gap-2 items-center">
                                <span className="text-[10px] font-semibold text-slate-400 w-24">{group.category}</span>
                                <div className="flex flex-wrap gap-1.5 flex-1">
                                    {group.keywords.map(word => (
                                        <button
                                            key={word}
                                            onClick={() => handleAddKeyword(word)}
                                            className={`text-[10px] px-2 py-1 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 ${theme.hoverLightBg} dark:hover:bg-slate-800`}
                                        >
                                            + {word}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                   <Layers className="h-4 w-4 text-slate-400" />
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Artistic Style</label>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {STYLE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setStyle(option.id)}
                      className={`relative group overflow-hidden rounded-xl aspect-square border-2 transition-all duration-300 text-left ${
                        style === option.id 
                          ? `${theme.activeBorder} ring-2 ${theme.ring} ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-[1.02] shadow-lg` 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={option.img} 
                        alt={option.id} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${style === option.id ? 'opacity-80' : 'opacity-60 group-hover:opacity-80'}`} />
                      
                      <div className="absolute bottom-0 left-0 p-3 w-full">
                         <div className="flex items-end justify-between gap-1">
                            <span className={`text-white font-bold text-xs leading-tight drop-shadow-md ${style === option.id ? 'translate-y-0' : 'translate-y-1 group-hover:translate-y-0'} transition-transform duration-300`}>
                              {option.id.split(' & ')[0]}<br/>
                              <span className="opacity-75 font-normal text-[10px]">{option.id.split(' & ')[1]}</span>
                            </span>
                            {style === option.id && (
                              <div className={`${theme.activeBg} rounded-full p-0.5 animate-fade-in-up`}>
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                         </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !description}
                className={`w-full py-3.5 md:py-4 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 ${theme.btn} ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {loading ? 'Designing...' : 'Generate Asset'}
              </button>
            </div>
         </div>
       </div>

       <div id="image-result-anchor"></div>

       {/* Output Section */}
       {(loading || imageUrl || error) && (
         <div className="glass-panel p-1 rounded-2xl animate-fade-in-up">
            <div className="bg-slate-100 dark:bg-slate-950 rounded-xl min-h-[350px] relative overflow-hidden flex flex-col md:flex-row group border border-slate-200 dark:border-slate-800">
              
              {/* Grid Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {loading ? (
                <div className="w-full flex flex-col items-center justify-center py-24 z-10">
                  <div className="relative inline-block">
                    <div className={`absolute inset-0 blur-xl opacity-50 ${isStartup ? 'bg-indigo-500' : 'bg-emerald-500'} animate-pulse`}></div>
                    <Loader2 className={`h-12 w-12 md:h-16 md:w-16 animate-spin relative z-10 ${isStartup ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-6 font-medium animate-pulse text-base md:text-lg">Applying Brand Psychology...</p>
                </div>
              ) : error ? (
                <div className="w-full flex flex-col items-center justify-center p-8 z-10">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full w-fit mx-auto mb-4 border border-red-100 dark:border-red-900/50">
                    <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-red-500" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl text-slate-800 dark:text-white mb-2">{error}</h3>
                  {errorSuggestion && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 mb-6 max-w-md">
                       <div className="flex gap-3 items-start text-left">
                         <Info className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0" />
                         <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{errorSuggestion}</p>
                       </div>
                    </div>
                  )}
                  <button 
                    onClick={handleGenerate} 
                    className={`px-8 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] ${theme.btn}`}
                  >
                    Try Again
                  </button>
                </div>
              ) : imageUrl && (
                <>
                  {/* Image Container */}
                  <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-full flex items-center justify-center p-6 bg-white/50 dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                    <img src={imageUrl} alt="Generated Asset" className="max-w-full max-h-[300px] md:max-h-[400px] object-contain shadow-2xl rounded-lg relative z-10 transition-transform duration-500 group-hover:scale-[1.02]" />
                    
                    {/* Floating Action Bar */}
                    <div className="absolute bottom-6 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-xl shadow-2xl border border-white/20 dark:border-slate-700 z-20">
                        <a 
                          href={imageUrl} 
                          download="brand-asset.png"
                          className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors whitespace-nowrap"
                        >
                          <Download className="h-3.5 w-3.5" /> Save
                        </a>
                        <button 
                          onClick={handleGenerate}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Regenerate"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>
                  </div>

                  {/* Psychology Rationale Container */}
                  <div className="w-full md:w-1/2 p-6 md:p-8 bg-white dark:bg-slate-900 flex flex-col">
                     <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit className={`h-5 w-5 ${theme.text}`} />
                        <h3 className="font-bold text-slate-900 dark:text-white">Psychological Analysis</h3>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto pr-2 prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-slate-800 dark:prose-headings:text-slate-200 prose-strong:text-slate-900 dark:prose-strong:text-white">
                        {rationale ? (
                           <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                             {rationale}
                           </ReactMarkdown>
                        ) : (
                          <div className="flex flex-col gap-3">
                             <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
                             <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full animate-pulse"></div>
                             <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6 animate-pulse"></div>
                          </div>
                        )}
                     </div>
                     
                     <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Brand Strategy Note</p>
                        <p className="text-xs text-slate-500 mt-1 italic">
                           "Visuals are processed 60,000x faster than text. Ensure your logo communicates trust instantly."
                        </p>
                     </div>
                  </div>
                </>
              )}
            </div>
         </div>
       )}
    </div>
  );
};

export default VisualIdentity;