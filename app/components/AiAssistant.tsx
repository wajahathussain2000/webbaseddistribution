"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { useMockData, FMCG_PRODUCTS, CUSTOMERS } from "@/app/context/MockDataContext";

export default function AiAssistant() {
  const { salesOrders } = useMockData();
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [chat, setChat] = useState<{role: 'assistant' | 'user', content: string}[]>([
    { role: 'assistant', content: "Hello! I'm your Apex AI Assistant, now connected to ChatGPT! I have access to your live catalog, customers, and sales data. Ask me anything!" }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isTyping]);

  const handleSend = async () => {
    if (!msg.trim()) return;
    const userText = msg;
    const newChat = [...chat, { role: 'user' as const, content: userText }];
    setChat(newChat);
    setMsg("");
    setIsTyping(true);
    
    try {
      // Build a minimal stringified context from the MockData
      const dbContext = JSON.stringify({
        productsCount: FMCG_PRODUCTS.length,
        products: FMCG_PRODUCTS.map(p => ({ name: p.name, price: p.price, cost: p.cost })),
        customersCount: CUSTOMERS.length,
        customers: CUSTOMERS.map(c => ({ name: c.name, balance: c.balance })),
        salesOrdersCount: salesOrders.length,
        totalRevenue: salesOrders.reduce((acc:any, o:any) => acc + o.netAmount, 0),
        pendingOrders: salesOrders.filter((o:any) => o.status === 'Pending POS').length
      });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newChat.map(m => ({ role: m.role, content: m.content })),
          context: dbContext
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setChat(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setChat(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      }
    } catch (err: any) {
      setChat(prev => [...prev, { role: 'assistant', content: `Network Error: ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-[#0F172A] text-white rounded-full shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all z-50 flex items-center justify-center group"
      >
        <Sparkles className="w-6 h-6 absolute opacity-0 group-hover:opacity-100 animate-pulse transition-opacity text-emerald-400" />
        <Bot className="w-6 h-6 group-hover:opacity-0 transition-opacity" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-slate-300 flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-[#0F172A] p-4 flex justify-between items-center text-white border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-md">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Apex AI</h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-md transition text-slate-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {chat.map((c, i) => (
              <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {c.role === 'assistant' && <Bot className="w-6 h-6 mr-2 text-slate-400 self-end mb-1" />}
                <div className={`max-w-[80%] p-3 text-sm shadow-sm ${
                  c.role === 'user' 
                    ? 'bg-[#0F172A] text-white rounded-2xl rounded-br-sm' 
                    : 'bg-white border border-slate-200 text-[#0F172A] rounded-2xl rounded-bl-sm'
                }`}>
                  {/* Simple bold parser for markdown-like text */}
                  {c.content.split('**').map((part, idx) => 
                    idx % 2 === 1 ? <strong key={idx} className="font-bold text-emerald-600">{part}</strong> : part
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <Bot className="w-6 h-6 mr-2 text-slate-400 self-end mb-1" />
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-sm flex gap-1 items-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input 
              type="text" 
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about products, orders..." 
              className="flex-1 border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] text-[#0F172A]"
            />
            <button 
              onClick={handleSend}
              className="p-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
