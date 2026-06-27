"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link    from "next/link";
import Spinner from "@/components/ui/Spinner";
import { useEmployee } from "../hooks/useEmployees";
import { ROLE_BY_ID }  from "../constants";
import { ROUTES }      from "@/shared/constants";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface Message {
  role:    "user" | "model";
  content: string;
}

/* ─── Message bubble ──────────────────────────────────────────────────────── */

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
          isUser
            ? "bg-accent text-white"
            : "bg-surface-elevated border border-border text-text-muted"
        }`}
        aria-hidden
      >
        {isUser ? "Y" : "AI"}
      </div>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "bg-accent text-white rounded-tr-sm"
            : "bg-surface-elevated border border-border text-text-primary rounded-tl-sm"
        }`}
      >
        {message.content || (
          <span className="inline-flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Chat View ───────────────────────────────────────────────────────────── */

interface ChatViewProps {
  employeeId: string;
}

export default function ChatView({ employeeId }: ChatViewProps) {
  const { data: employee, isLoading: loadingEmployee } = useEmployee(employeeId);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages,       setMessages]       = useState<Message[]>([]);
  const [input,          setInput]          = useState("");
  const [isStreaming,    setIsStreaming]     = useState(false);
  const [loadingConv,    setLoadingConv]    = useState(true);
  const [error,          setError]          = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  /* ── Auto-scroll on new content ── */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  /* ── Load conversation from server on mount ── */
  const loadConversation = useCallback(async () => {
    setLoadingConv(true);
    try {
      const res = await fetch(`/api/chat/${employeeId}`);
      if (!res.ok) throw new Error(`Failed to load conversation (${res.status})`);

      const data: { conversationId: string; messages: Message[] } = await res.json();
      setConversationId(data.conversationId);

      if (data.messages.length > 0) {
        setMessages(data.messages);
      }
      // If empty, welcome message is added once employee data arrives (below)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversation.");
    } finally {
      setLoadingConv(false);
    }
  }, [employeeId]);

  useEffect(() => { loadConversation(); }, [loadConversation]);

  /* ── Show welcome message when conversation is empty ── */
  useEffect(() => {
    if (employee && !loadingConv && messages.length === 0) {
      setMessages([{
        role:    "model",
        content: `Hi! I'm ${employee.name}. How can I help you today?`,
      }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id, loadingConv]);

  /* ── Send message ── */
  async function send(userText: string) {
    if (!userText.trim() || isStreaming || !conversationId) return;
    setError(null);

    setMessages((prev) => [...prev, { role: "user", content: userText.trim() }]);
    setInput("");
    setMessages((prev) => [...prev, { role: "model", content: "" }]); // streaming placeholder
    setIsStreaming(true);

    try {
      const response = await fetch(`/api/chat/${employeeId}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ conversationId, message: userText.trim() }),
      });

      if (!response.ok) {
        throw new Error((await response.text()) || `HTTP ${response.status}`);
      }

      const reader      = response.body!.getReader();
      const decoder     = new TextDecoder();
      let   accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "model", content: accumulated };
          return updated;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1)); // remove empty placeholder
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  const roleData   = employee ? ROLE_BY_ID[employee.role] : null;
  const detailPath = ROUTES.APP.EMPLOYEES.DETAIL(employeeId);
  const isLoading  = loadingEmployee || loadingConv;

  return (
    <div
      className="flex flex-col -mx-6 lg:-mx-8 -mb-6 lg:-mb-8 overflow-hidden bg-background"
      style={{ height: "calc(100dvh - 4rem)" }}
    >
      {/* ── Header ── */}
      <div className="shrink-0 flex items-center gap-4 px-6 py-4 border-b border-border bg-surface">
        <Link
          href={detailPath}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors focus-ring rounded"
          aria-label="Back to employee"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>
        <div className="h-5 w-px bg-border" aria-hidden />
        {isLoading ? (
          <Spinner size="xs" color="default" />
        ) : employee ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {employee.name[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{employee.name}</p>
              <p className="text-xs text-text-muted">{roleData?.label ?? employee.role}</p>
            </div>
          </div>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
            Gemini
          </span>
          <span className="text-xs text-text-muted">Conversation saved</span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 flex flex-col gap-4"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Spinner size="md" color="accent" label="Loading conversation…" />
          </div>
        ) : (
          messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
        )}

        {error && (
          <div className="mx-auto px-4 py-3 rounded-xl bg-danger-bg border border-danger-border text-sm text-danger max-w-sm text-center">
            {error}
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 px-6 lg:px-8 py-4 border-t border-border bg-surface">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${employee?.name ?? "AI"}… (Enter to send, Shift+Enter for newline)`}
            rows={1}
            disabled={isStreaming || isLoading}
            className={[
              "flex-1 resize-none rounded-xl border bg-surface-elevated px-4 py-3",
              "text-sm text-text-primary placeholder:text-text-muted outline-none",
              "transition-all duration-150 max-h-32 overflow-y-auto",
              "border-border hover:border-border-hover focus:border-border-focus focus:ring-2 focus:ring-accent/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming || isLoading}
            className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-ring"
            aria-label="Send message"
          >
            {isStreaming ? (
              <Spinner size="xs" color="white" />
            ) : (
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
                <path d="M2 8h12M8 2l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-text-muted">
          Conversation is saved. Responses are generated by Gemini and may be inaccurate.
        </p>
      </div>
    </div>
  );
}
