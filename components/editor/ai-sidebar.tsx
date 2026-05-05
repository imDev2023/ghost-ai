"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Download, FileText, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
] as const;

interface AiSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AiSidebar({ open, onClose }: AiSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function resizeTextarea() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "72px";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }

  function send(text: string) {
    if (!text.trim()) return;
    const nextId = () => String(++msgId.current);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: text.trim() },
    ]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "72px";
    // Placeholder echo — no backend yet
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content:
            "Ghost AI is not yet connected. Architecture generation is coming soon.",
        },
      ]);
    }, 600);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <aside
      inert={!open}
      className={`
        fixed top-14 bottom-0 right-0 w-80 z-40
        flex flex-col
        bg-base/95 backdrop-blur-sm
        border-l border-border-default shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full pointer-events-none invisible"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-default shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-ai/15 flex items-center justify-center shrink-0">
            <Bot className="h-4 w-4 text-ai-text" />
          </div>
          <div>
            <p className="text-sm font-semibold text-copy-primary leading-tight">
              AI Workspace
            </p>
            <p className="text-xs text-copy-muted leading-tight mt-0.5">
              Collaborate with Ghost AI
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 flex items-center justify-center rounded-lg text-copy-muted hover:text-copy-primary hover:bg-subtle transition-colors"
          aria-label="Close AI sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="architect" className="flex-1 min-h-0">
        <div className="px-3 pt-3 shrink-0">
          <TabsList className="w-full bg-subtle">
            <TabsTrigger
              value="architect"
              className="flex-1 text-xs text-copy-muted data-active:bg-elevated data-active:text-ai-text"
            >
              AI Architect
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="flex-1 text-xs text-copy-muted data-active:bg-elevated data-active:text-ai-text"
            >
              Specs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* AI Architect tab */}
        <TabsContent value="architect" className="flex flex-col flex-1 min-h-0">
          {/* Scrollable chat area */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 min-h-0">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="h-10 w-10 rounded-2xl bg-ai/15 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-ai-text" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-copy-primary">
                    Ghost AI Architect
                  </p>
                  <p className="text-xs text-copy-muted mt-1 leading-relaxed max-w-[200px] mx-auto">
                    Describe a system and I&apos;ll design the architecture for
                    your canvas.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  {STARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => send(chip)}
                      className="w-full text-left px-3 py-2 rounded-xl bg-subtle text-ai-text text-xs font-medium hover:bg-elevated transition-colors leading-snug"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) =>
                  msg.role === "user" ? (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm text-xs leading-relaxed bg-brand-dim border-2 border-brand/50 text-copy-primary">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm text-xs leading-relaxed bg-elevated border border-border-default text-ai-text">
                        {msg.content}
                      </div>
                    </div>
                  )
                )}
                <div ref={chatBottomRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="px-3 pb-3 pt-2 border-t border-border-default shrink-0">
            <div className="flex gap-2 items-end">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  resizeTextarea();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Describe an architecture…"
                className="flex-1 resize-none text-xs bg-elevated border-border-default text-copy-primary placeholder:text-copy-faint focus-visible:ring-ai/40"
                style={{ minHeight: "72px", maxHeight: "160px", overflowY: "auto" }}
              />
              <Button
                onClick={() => send(input)}
                disabled={!input.trim()}
                size="icon"
                className="shrink-0 h-9 w-9 rounded-xl bg-ai hover:bg-ai/90 text-white border-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Specs tab */}
        <TabsContent value="specs" className="flex flex-col gap-3 px-3 py-3">
          <Button className="w-full gap-2 bg-ai hover:bg-ai/90 text-white border-0">
            <FileText className="h-4 w-4" />
            Generate Spec
          </Button>

          {/* Demo spec card */}
          <div className="rounded-2xl bg-elevated border border-border-default p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-subtle flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-copy-muted" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-copy-primary">
                  System Spec v1.0
                </p>
                <p className="text-xs text-copy-muted mt-0.5 leading-relaxed line-clamp-2">
                  Microservices architecture with API gateway, auth service, and
                  PostgreSQL data stores.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border-default">
              <span className="text-xs text-copy-faint">Generated from canvas</span>
              <button
                disabled
                className="flex items-center gap-1.5 text-xs text-copy-faint opacity-50 cursor-not-allowed"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
