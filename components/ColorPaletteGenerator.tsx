import React, { useState, useEffect } from 'react';
import { generateColorPalettes } from '../services/geminiService';
import { Loader2, Copy, Check, Palette as PaletteIcon, Sparkles, History } from 'lucide-react';
import { ToolType } from '../types';
import { addToHistory, getHistoryByTool, HistoryItem } from '../services/historyService';
import HistoryViewer from './HistoryViewer';

interface ColorPaletteGeneratorProps {
  defaultInput?: string;
}

const ColorPaletteGenerator: React.FC<ColorPaletteGeneratorProps> = ({ defaultInput = '' }) => {
  const [input, setInput] = useState(defaultInput);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // History
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const toolType = ToolType.COLOR_PALETTE;

  useEffect(() => {
    if (showHistory) {
      setHistoryItems(getHistoryByTool(toolType));
    }
  }, [showHistory]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setShowHistory(false);
    try {
      const result = await generateColorPalettes(input);
      setData(result);
      
      addToHistory({
        toolType: toolType,
        input: input,
        output: result
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setInput(item.input);
    setData(item.output);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up relative">
      {/* Hero Input */}
      <div className="glass-panel p-8 rounded-3xl text-center max-w-3xl mx-auto relative">
        {/* History Toggle */}
        <div className="absolute top-6 right-6 z-20">
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
              type="color"
            />
        </div>

        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 mb-6">
          <PaletteIcon className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Brand Color Architect</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
          Describe your brand's personality, and AI will generate scientifically balanced color palettes with psychological rationales.
        </p>
        
        <div className="relative max-w-xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g., 'A futuristic fintech app with neon accents' or 'Organic skincare brand using earth tones'..."
            className="w-full h-32 rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 pr-32 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="absolute bottom-4 right-4 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Mixing...' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Results Grid */}
      {data && data.palettes && (
        <div className="grid grid-cols-1 gap-10">
          {data.palettes.map((palette: any, idx: number) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-shadow duration-300">
              {/* Palette Header */}
              <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{palette.name}</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Palette 0{idx + 1}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{palette.rationale}</p>
              </div>

              {/* Color Swatches */}
              <div className="flex h-48 md:h-56">
                {palette.colors.map((color: any, cIdx: number) => (
                  <div 
                    key={cIdx} 
                    className="group relative flex-1 flex flex-col justify-end p-6 transition-all hover:flex-[2] cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex)}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
                         <div className="flex justify-between items-center mb-1">
                           <span className="font-bold text-slate-900 dark:text-white text-sm">{color.name}</span>
                           {copiedHex === color.hex && <Check className="h-4 w-4 text-green-500" />}
                         </div>
                         <code className="text-xs font-mono text-slate-500 uppercase">{color.hex}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPaletteGenerator;