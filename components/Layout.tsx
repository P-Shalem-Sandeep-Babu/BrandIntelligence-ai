import React, { useState } from 'react';
import { AppMode, ToolType } from '../types';
import { 
  Menu,
  LogOut,
  Sun, 
  Moon, 
  LucideIcon
} from 'lucide-react';
import { TOOL_REGISTRY, MODE_CONFIGS, ModeConfig, ToolCategory } from '../constants';

interface LayoutProps {
  currentMode: AppMode;
  currentTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  onExitMode: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  config: ModeConfig;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick, 
  config 
}) => (
  <button
    onClick={onClick}
    className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? `${config.activeBg} ${config.activeText} shadow-sm`
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
    }`}
  >
    {isActive && (
      <div className={`absolute left-0 h-8 w-1 rounded-r-full bg-gradient-to-b ${config.gradient}`} />
    )}
    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? '' : 'opacity-70'}`} />
    <span className="truncate">{label}</span>
  </button>
);

interface SidebarCategoryProps {
  category: ToolCategory;
  currentTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  config: ModeConfig;
}

const SidebarCategoryList: React.FC<SidebarCategoryProps> = ({ 
  category, 
  currentTool, 
  onToolSelect, 
  setIsSidebarOpen, 
  config 
}) => {
  return (
    <div className="space-y-1">
      <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 opacity-80">
        {category.title}
      </h3>
      {category.items.map((toolId) => {
        const meta = TOOL_REGISTRY[toolId];
        if (!meta) return null;
        return (
          <SidebarItem
            key={toolId}
            icon={meta.icon}
            label={meta.label}
            isActive={currentTool === toolId}
            onClick={() => {
              onToolSelect(toolId);
              setIsSidebarOpen(false);
            }}
            config={config}
          />
        );
      })}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ 
  currentMode, 
  currentTool, 
  onToolSelect, 
  onExitMode, 
  isDarkMode,
  onToggleTheme,
  children 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const config = MODE_CONFIGS[currentMode] || MODE_CONFIGS[AppMode.STARTUP];
  const ModeIcon = config.icon;
  const dashboardMeta = TOOL_REGISTRY[ToolType.DASHBOARD];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors font-sans overflow-hidden">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="px-6 py-8">
            <div className={`flex items-center gap-3 mb-1`}>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
                <ModeIcon className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Brand<span className="opacity-75">Intelligence</span>
              </h1>
            </div>
            <p className={`text-xs font-semibold uppercase tracking-wider pl-1 mt-2 ${config.activeText}`}>
              {config.label}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide space-y-6">
            {/* Dashboard (Always present) */}
            <SidebarItem
              icon={dashboardMeta.icon}
              label={dashboardMeta.label}
              isActive={currentTool === ToolType.DASHBOARD}
              onClick={() => {
                onToolSelect(ToolType.DASHBOARD);
                setIsSidebarOpen(false);
              }}
              config={config}
            />

            {/* Dynamic Categories */}
            {config.categories.map((category, idx) => (
              <SidebarCategoryList 
                key={idx}
                category={category}
                currentTool={currentTool}
                onToolSelect={onToolSelect}
                setIsSidebarOpen={setIsSidebarOpen}
                config={config}
              />
            ))}
            
            {/* Bottom Padding */}
            <div className="pb-8" />
          </nav>

          {/* Footer (Sidebar) */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
             <div className="grid grid-cols-2 gap-2">
               <button
                onClick={onToggleTheme}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? 'Light' : 'Dark'}
              </button>

              <button
                onClick={onExitMode}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Exit
              </button>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-96 bg-gradient-to-b ${currentMode === AppMode.STARTUP ? 'from-indigo-50/50 dark:from-indigo-950/20' : 'from-emerald-50/50 dark:from-emerald-950/20'} to-transparent`} />
        </div>

        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 lg:hidden relative z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-400 p-2">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold text-slate-900 dark:text-white">BrandIntelligence</span>
          <div className="w-10" />
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10 scroll-smooth">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;