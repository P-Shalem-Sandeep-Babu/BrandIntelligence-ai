import React from 'react';
import { AppMode } from '../types';
import { Rocket, Building2, ArrowRight, Sparkles } from 'lucide-react';

interface ModeSelectorProps {
  onSelect: (mode: AppMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen w-full flex flex-col relative font-sans bg-slate-950 text-white overflow-hidden">
      
      {/* Header Overlay - Relative on Mobile, Absolute on Desktop */}
      <div className="relative md:absolute top-0 left-0 right-0 z-50 flex flex-col items-center pt-8 pb-2 md:pt-12 md:pb-6 pointer-events-auto md:pointer-events-none bg-slate-950 md:bg-transparent shrink-0">
        <div className="glass px-6 py-3 md:px-8 md:py-4 rounded-full flex items-center gap-2 md:gap-3 animate-fade-in-up">
           <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-indigo-400" />
           <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-white tracking-wide">BrandIntelligence AI</span>
        </div>
        <h1 className="mt-6 md:mt-8 text-3xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm tracking-tight animate-fade-in-up [animation-delay:200ms] px-4">
          Architect Your Brand
        </h1>
        <p className="mt-3 md:mt-4 text-slate-400 max-w-xs md:max-w-lg text-center text-sm md:text-lg animate-fade-in-up [animation-delay:400ms] px-4">
          Select your business stage to initialize the specialized AI agent.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Startup Side */}
        <button 
          className="relative flex-1 group overflow-hidden focus:outline-none min-h-[300px]"
          onClick={() => onSelect(AppMode.STARTUP)}
        >
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-slate-900 transition-colors group-hover:bg-indigo-950 duration-700" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-900/40 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-[2s]" />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 md:p-16 text-center">
            <div className="mb-4 md:mb-6 p-4 md:p-6 rounded-3xl bg-indigo-500/10 border border-indigo-400/20 backdrop-blur-md group-hover:bg-indigo-500/20 group-hover:border-indigo-400/40 transition-all duration-300 shadow-xl group-hover:scale-110 group-hover:-rotate-3">
              <Rocket className="h-10 w-10 md:h-16 md:w-16 text-indigo-300 group-hover:text-white transition-colors" />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4 group-hover:translate-y-[-5px] transition-transform">Startup Launchpad</h2>
            <p className="text-indigo-200 max-w-[280px] md:max-w-sm leading-relaxed mb-6 md:mb-8 text-sm md:text-base group-hover:text-white transition-colors">
              For new ventures seeking virality, identity creation, and market entry strategies.
            </p>

            <span className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-white/10 border border-white/10 text-white text-sm md:text-base font-medium backdrop-blur-sm group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300">
              Initialize Startup Mode <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </button>

        {/* Existing Side */}
        <button 
          className="relative flex-1 group overflow-hidden focus:outline-none border-t border-white/10 md:border-t-0 md:border-l min-h-[300px]"
          onClick={() => onSelect(AppMode.EXISTING)}
        >
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-slate-950 transition-colors group-hover:bg-emerald-950 duration-700" />
          <div className="absolute inset-0 bg-gradient-to-bl from-emerald-600/20 to-teal-900/40 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-[2s]" />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 md:p-16 text-center">
             <div className="mb-4 md:mb-6 p-4 md:p-6 rounded-3xl bg-emerald-500/10 border border-emerald-400/20 backdrop-blur-md group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40 transition-all duration-300 shadow-xl group-hover:scale-110 group-hover:rotate-3">
              <Building2 className="h-10 w-10 md:h-16 md:w-16 text-emerald-300 group-hover:text-white transition-colors" />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4 group-hover:translate-y-[-5px] transition-transform">Enterprise Suite</h2>
            <p className="text-emerald-200 max-w-[280px] md:max-w-sm leading-relaxed mb-6 md:mb-8 text-sm md:text-base group-hover:text-white transition-colors">
               For established brands focusing on optimization, consistency, and strategic growth.
            </p>

            <span className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-white/10 border border-white/10 text-white text-sm md:text-base font-medium backdrop-blur-sm group-hover:bg-emerald-600 group-hover:border-emerald-500 transition-all duration-300">
              Initialize Enterprise Mode <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </button>
      </div>
      
      {/* Footer Branding - Hidden on small mobile to save space */}
      <div className="hidden md:block absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest opacity-60">Powered by Google Gemini 2.5</p>
      </div>
    </div>
  );
};

export default ModeSelector;