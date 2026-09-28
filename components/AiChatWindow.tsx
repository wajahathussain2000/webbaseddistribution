"use client";

import { useState } from "react";
import { askAiAssistant } from "@/app/actions/ai";

export default function AiChatWindow() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query;
    setQuery("");
    setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await askAiAssistant(userMessage);
      if (res.error) {
        setHistory(prev => [...prev, { role: 'ai', content: `Error: ${res.error}` }]);
      } else if (res.response) {
        setHistory(prev => [...prev, { role: 'ai', content: res.response || "No response." }]);
      }
    } catch (err) {
      setHistory(prev => [...prev, { role: 'ai', content: "Failed to communicate with AI server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl shadow-lg border border-indigo-500 overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-indigo-800 bg-black/20 flex items-center gap-3 shrink-0">
         <div className="relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
         </div>
         <div>
            <h2 className="font-bold text-white leading-tight">ERP Intelligence (GPT-4o)</h2>
            <p className="text-xs text-indigo-300">Connected to live database</p>
         </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {history.length === 0 && (
          <div className="text-center text-indigo-300/60 mt-10 text-sm">
            Ask me anything about your stock, pending approvals, or sales trends...
          </div>
        )}
        
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-2 shrink-0 shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 border border-slate-700 text-indigo-100 rounded-bl-none'}`}>
               {msg.content.split('\n').map((line, j) => <p key={j} className="mb-1 last:mb-0">{line}</p>)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm bg-slate-800 border border-slate-700 text-indigo-100 rounded-bl-none flex items-center gap-2">
               <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></span>
               <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-black/20 border-t border-indigo-800 flex gap-2 shrink-0">
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g., Which branches have expiring Panadol?"
          className="flex-1 bg-slate-800/50 border border-indigo-500/50 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 placeholder-indigo-300/50 transition-colors"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !query.trim()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
