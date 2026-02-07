import React from 'react';
import { HistoryItem } from '../services/historyService';
import { History, Clock, ArrowRight, Trash2 } from 'lucide-react';

interface HistoryViewerProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  isOpen: boolean;
  onClose: () => void;
  type: 'text' | 'image' | 'color';
}

const HistoryViewer: React.FC<HistoryViewerProps> = ({ items, onSelect, isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-0 z-30 w-full md:w-80 animate-fade-in-up">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <History className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Recent History (1h)</span>
          </div>
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            Close
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No recent history found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2 mb-2">
                    {item.input}
                  </p>

                  {/* Preview based on Type */}
                  <div className="rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700/50">
                    {type === 'image' && (
                       <img src={item.output} alt="History" className="w-full h-20 object-cover" />
                    )}
                    {type === 'color' && (
                       <div className="flex h-6">
                          {item.output.palettes?.[0]?.colors.map((c: any, i: number) => (
                            <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
                          ))}
                       </div>
                    )}
                    {type === 'text' && (
                       <div className="p-2 bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-500 line-clamp-2 font-mono">
                         {item.output.substring(0, 100)}...
                       </div>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Restore <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryViewer;
