import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatAssistantProps {
  systemInstruction: string;
  welcomeMessage: string;
  title?: string;
  subtitle?: string;
  defaultInput?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  systemInstruction, 
  welcomeMessage,
  title = "BrandCraft X",
  subtitle = "Autonomous Branding Architect",
  defaultInput = ''
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(defaultInput);
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession(systemInstruction);
    setMessages([{
      id: 'init',
      role: 'model',
      text: welcomeMessage,
      timestamp: new Date()
    }]);
  }, [systemInstruction, welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Custom Markdown for Chat - Compact and Clean
  const ChatMarkdownComponents = {
    // We override specific elements to ensure they fit within chat bubbles
    p: ({node, ...props}: any) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
    ul: ({node, ...props}: any) => <ul className="mb-2 ml-4 list-disc space-y-1 marker:text-inherit" {...props} />,
    ol: ({node, ...props}: any) => <ol className="mb-2 ml-4 list-decimal space-y-1 marker:text-inherit" {...props} />,
    li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
    h1: ({node, ...props}: any) => <h3 className="font-bold text-lg mb-2 mt-3" {...props} />,
    h2: ({node, ...props}: any) => <h4 className="font-bold text-base mb-2 mt-2" {...props} />,
    h3: ({node, ...props}: any) => <h5 className="font-bold text-sm mb-1 mt-1" {...props} />,
    strong: ({node, ...props}: any) => <strong className="font-bold opacity-100" {...props} />,
    blockquote: ({node, ...props}: any) => <blockquote className="border-l-2 border-current pl-3 italic my-2 opacity-80" {...props} />,
    code: ({node, ...props}: any) => <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
    // Table Components for Chat
    table: ({node, ...props}: any) => (
      <div className="overflow-x-auto my-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/50" {...props} />
      </div>
    ),
    thead: ({node, ...props}: any) => <thead className="bg-black/5 dark:bg-white/5" {...props} />,
    th: ({node, ...props}: any) => <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap opacity-80" {...props} />,
    tbody: ({node, ...props}: any) => <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50" {...props} />,
    tr: ({node, ...props}: any) => <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors" {...props} />,
    td: ({node, ...props}: any) => <td className="px-3 py-2 whitespace-normal text-xs" {...props} />,
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)] md:h-[calc(100vh-140px)] glass-panel rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 md:p-2.5 rounded-xl text-white shadow-lg">
               <Bot className="h-4 w-4 md:h-5 md:w-5" />
             </div>
             <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white leading-tight text-sm md:text-base">{title}</h3>
            <p className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>
        
        <button 
           onClick={() => setMessages([{ id: 'init', role: 'model', text: welcomeMessage, timestamp: new Date() }])}
           className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
           title="Restart Session"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            <div className={`flex gap-2 md:gap-3 max-w-[95%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-1 ${
                msg.role === 'user' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/50' 
                  : 'bg-emerald-100 dark:bg-emerald-900/50'
              }`}>
                {msg.role === 'user' ? <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-indigo-600 dark:text-indigo-400" /> : <Bot className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-600 dark:text-emerald-400" />}
              </div>
              
              <div className={`p-3 md:p-4 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
              }`}>
                {msg.role === 'model' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-inherit prose-headings:text-inherit prose-strong:text-inherit prose-blockquote:text-inherit prose-code:text-inherit">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={ChatMarkdownComponents}>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-pulse">
             <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/50 shadow-sm mt-1">
                   <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Thinking...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 z-10 shrink-0">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-4 py-3 md:px-5 md:py-4 text-sm shadow-inner text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-3 md:px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-md flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;