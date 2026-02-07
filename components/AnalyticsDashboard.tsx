import React, { useState } from 'react';
import { analyzeSentiment } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, TrendingUp, AlertCircle, Smile, Meh, Frown, HeartPulse, AlertTriangle, Lightbulb, Sparkles, Activity, Target, Quote } from 'lucide-react';

interface AnalyticsDashboardProps {
  defaultInput?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ defaultInput = '' }) => {
  const [inputText, setInputText] = useState(defaultInput);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleAnalysis = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeSentiment(inputText);
      setData(result);
    } catch (e) {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!data?.breakdown) return [];
    return data.breakdown.map((item: any) => ({
      name: item.category,
      count: item.count,
      color: item.category.toLowerCase().includes('positive') ? '#10b981' : 
             item.category.toLowerCase().includes('negative') ? '#ef4444' : '#f59e0b'
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Header & Input Section */}
      <div className="glass-panel p-1 rounded-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sentiment Pulse</h2>
              <p className="text-slate-500 dark:text-slate-400">AI-powered NLP analysis for customer feedback and market data.</p>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste reviews, survey results, or social comments here (e.g., 'The product quality is amazing, but shipping took forever...')"
              className="w-full h-32 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 pr-32 text-sm focus:border-transparent focus:ring-2 focus:ring-emerald-500 transition-all resize-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
            <button
              onClick={handleAnalysis}
              disabled={loading || !inputText}
              className="absolute bottom-4 right-4 bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {data && (
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Strategic Intelligence Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sentiment Trend */}
            <div className="glass-panel p-1 rounded-2xl">
               <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full flex items-center justify-between">
                  <div>
                     <div className="flex items-center gap-2 mb-2 text-indigo-500">
                        <Activity className="h-5 w-5" />
                        <h3 className="font-bold text-slate-900 dark:text-white">Sentiment Trend</h3>
                     </div>
                     <p className="text-sm text-slate-500 dark:text-slate-400">Inferred from narrative flow</p>
                  </div>
                  <div className="text-right">
                     <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{data.sentimentTrend || 'Stable'}</div>
                  </div>
               </div>
            </div>

            {/* Industry Benchmark */}
            <div className="glass-panel p-1 rounded-2xl">
               <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full">
                  <div className="flex items-center gap-2 mb-2 text-purple-500">
                     <Target className="h-5 w-5" />
                     <h3 className="font-bold text-slate-900 dark:text-white">Industry Benchmark</h3>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                       <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{data.industryComparison?.rating || 'Average'}</span>
                     </div>
                     <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[50%] text-right">{data.industryComparison?.context}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sentiment Scorecard */}
            <div className="lg:col-span-1 glass-panel p-1 rounded-2xl">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Tone</h3>
                  <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-6">
                    {data.overallTone}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                   {/* Positive */}
                   <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                     <Smile className="h-6 w-6 text-emerald-500 mb-1" />
                     <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">POS</span>
                   </div>
                   {/* Neutral */}
                   <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                     <Meh className="h-6 w-6 text-amber-500 mb-1" />
                     <span className="text-xs font-bold text-amber-700 dark:text-amber-400">NEU</span>
                   </div>
                   {/* Negative */}
                   <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                     <Frown className="h-6 w-6 text-red-500 mb-1" />
                     <span className="text-xs font-bold text-red-700 dark:text-red-400">NEG</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Main Chart */}
            <div className="lg:col-span-2 glass-panel p-1 rounded-2xl">
               <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Sentiment Distribution</h3>
                 <div className="h-48 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={getChartData()} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.2} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94a3b8', fontSize: 12}} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94a3b8', fontSize: 12}} 
                        />
                        <Tooltip 
                          cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                            backgroundColor: '#1e293b', 
                            color: '#f8fafc',
                            padding: '8px 12px'
                          }} 
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                          {getChartData().map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
            </div>
          </div>

          {/* Key Drivers Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Positive Drivers */}
            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-6">
               <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
                 <Quote className="h-4 w-4" /> Positive Key Phrases
               </h3>
               <div className="flex flex-wrap gap-2">
                 {data.keyPhrases?.positive?.map((phrase: string, i: number) => (
                   <span key={i} className="px-3 py-1 rounded-full bg-white dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 shadow-sm">
                     "{phrase}"
                   </span>
                 ))}
                 {!data.keyPhrases?.positive?.length && <span className="text-xs text-slate-400">No specific positive phrases detected.</span>}
               </div>
            </div>

            {/* Negative Drivers */}
            <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6">
               <h3 className="font-bold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
                 <Quote className="h-4 w-4" /> Negative Key Phrases
               </h3>
               <div className="flex flex-wrap gap-2">
                 {data.keyPhrases?.negative?.map((phrase: string, i: number) => (
                   <span key={i} className="px-3 py-1 rounded-full bg-white dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold border border-red-200 dark:border-red-800 shadow-sm">
                     "{phrase}"
                   </span>
                 ))}
                 {!data.keyPhrases?.negative?.length && <span className="text-xs text-slate-400">No specific negative phrases detected.</span>}
               </div>
            </div>
          </div>

          {/* Deep Dive Insights */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Patterns */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4 text-indigo-500">
                <HeartPulse className="h-5 w-5" />
                <h3 className="font-bold text-slate-900 dark:text-white">Emotional Patterns</h3>
              </div>
              <ul className="space-y-3">
                {data.emotionalPatterns?.map((pattern: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pain Points */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4 text-amber-500">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold text-slate-900 dark:text-white">Friction Points</h3>
              </div>
              <ul className="space-y-3">
                {data.painPoints?.map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4 text-emerald-500">
                <Lightbulb className="h-5 w-5" />
                <h3 className="font-bold text-slate-900 dark:text-white">Growth Opportunities</h3>
              </div>
              <ul className="space-y-3">
                {data.improvements?.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="glass-panel p-1 rounded-2xl">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Detailed Findings
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.breakdown.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-slate-900 dark:text-white">{item.category}</span>
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full font-bold">{item.count} mentions</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed opacity-90">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;