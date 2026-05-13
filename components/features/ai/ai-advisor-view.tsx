"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Bot, User, BrainCircuit, ShieldAlert, History } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const AIAdvisorView = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dnaScore, setDnaScore] = useState(65); // Mock DNA completeness
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        messages: [...messages, userMessage],
        context: {
          netWorth: "$12.5M",
          noteBalance: "$4.2M",
          entityType: "Private Family Trust",
          taxStatus: "Non-Grantor",
        },
      });

      setMessages((prev) => [...prev, { role: "assistant", content: (response as any).content }]);
    } catch (error) {
      toast.error("AI Advisor is currently unavailable");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6">
      {/* Sidebar: Financial DNA & Context */}
      <aside className="w-80 flex flex-col gap-6">
        <Card className="space-y-4 border-[var(--go)]/20 bg-gradient-to-br from-[var(--go-g)] to-transparent">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-[var(--go)]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--wh)]">Financial DNA</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-[var(--mt)]">Profile Completeness</span>
              <span className="text-[var(--go)]">{dnaScore}%</span>
            </div>
            <div className="w-full bg-[var(--bg)] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[var(--go)] h-full transition-all duration-1000" 
                style={{ width: `${dnaScore}%` }} 
              />
            </div>
          </div>
          <p className="text-[10px] text-[var(--tx)] leading-relaxed italic opacity-80">
            "Your profile is missing LLC operating agreements. Upload them to refine tax-offset strategies."
          </p>
          <Button variant="ghost" size="sm" className="w-full text-[10px] h-8">Update DNA Profile</Button>
        </Card>

        <section className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[var(--bl)]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--wh)]">Strategic History</h3>
          </div>
          <div className="space-y-2 overflow-y-auto">
            {[
              "PMA Contribution Strategy",
              "Trust Step-up Basis Review",
              "Whole Life Warehouse Setup",
            ].map((topic, i) => (
              <div key={i} className="p-3 bg-[var(--c1)] border border-[var(--bd)] rounded-lg text-[10px] text-[var(--mt)] font-bold uppercase tracking-wider hover:border-[var(--bl)] cursor-pointer transition-colors">
                {topic}
              </div>
            ))}
          </div>
        </section>

        <div className="p-4 bg-[var(--rd-b)] border border-[var(--rd)]/20 rounded-lg flex gap-3">
          <ShieldAlert className="h-5 w-5 text-[var(--rd)] shrink-0" />
          <p className="text-[9px] text-[var(--rd)] font-bold uppercase leading-relaxed tracking-tighter">
            AI advice is for educational purposes only. Consult with your legal and tax professionals before execution.
          </p>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-gradient-to-b from-[var(--c1)] to-[var(--bg)]">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-[var(--bd)] flex justify-between items-center bg-[var(--c1)]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[var(--go-g)] border border-[var(--go)]/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-[var(--go)]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[var(--wh)] uppercase tracking-widest">AI Strategic Advisor</h2>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--gr)] animate-pulse" />
                <span className="text-[9px] font-bold text-[var(--gr)] uppercase tracking-tighter">Analyzing Real-time Data</span>
              </div>
            </div>
          </div>
          <Badge type="info">Claude 3.5 Sonnet</Badge>
        </div>

        {/* Messages area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
              <Bot className="h-12 w-12 text-[var(--bd2)]" />
              <p className="text-[var(--mt)] text-sm font-bold uppercase tracking-widest">How can I assist your estate strategy today?</p>
              <div className="grid grid-cols-1 gap-2 w-full">
                {[
                  "How do I maximize my PMA contribution?",
                  "Analyze my current tax-free draw capacity.",
                  "Explain the benefits of a Private Trust.",
                ].map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInput(q)}
                    className="text-[10px] text-[var(--dm)] p-2 border border-[var(--bd)] rounded hover:border-[var(--go)] hover:text-[var(--go)] transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div 
              key={i} 
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                m.role === "user" ? "bg-[var(--bl-b)] border-[var(--bl)]/20" : "bg-[var(--go-g)] border-[var(--go)]/20"
              )}>
                {m.role === "user" ? <User className="h-4 w-4 text-[var(--bl)]" /> : <Bot className="h-4 w-4 text-[var(--go)]" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-xs leading-relaxed",
                m.role === "user" 
                  ? "bg-[var(--bl)] text-[var(--bg)] font-semibold rounded-tr-none shadow-lg shadow-[var(--bl-b)]" 
                  : "bg-[var(--c2)] text-[var(--tx)] border border-[var(--bd)] rounded-tl-none"
              )}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-lg bg-[var(--go-g)] border border-[var(--go)]/20 flex items-center justify-center animate-pulse">
                <Bot className="h-4 w-4 text-[var(--go)]" />
              </div>
              <div className="bg-[var(--c2)] border border-[var(--bd)] p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 bg-[var(--go)] rounded-full animate-bounce" />
                  <div className="h-1.5 w-1.5 bg-[var(--go)] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="h-1.5 w-1.5 bg-[var(--go)] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-[var(--bd)] bg-[var(--c1)]">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about your estate, taxes, or foundation..." 
              className="w-full pl-4 pr-12 py-3 bg-[var(--bg)] border border-[var(--bd)] rounded-xl text-sm outline-none focus:border-[var(--go)] transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-[var(--go)] text-[var(--bg)] rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[9px] text-[var(--mt)] text-center mt-3 font-black uppercase tracking-widest">
            Press Enter to consult with the Advisor
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AIAdvisorView;
