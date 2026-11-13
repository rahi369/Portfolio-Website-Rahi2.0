import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  Globe,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAi } from '../contexts/AiContext';
import { AiMessageContent } from '../components/AiMessageContent';
import { updatePageSeo } from '../lib/seo';
import { AiChatMode, AiChatPersona } from '../types';

const PERSONA_OPTIONS: Array<{
  id: AiChatPersona;
  label: string;
  desc: string;
}> = [
  {
    id: 'concierge',
    label: 'Portfolio Concierge',
    desc: 'Answers about Rahi’s work, SAMIA’S CLOSET & hiring.',
  },
  {
    id: 'strategist',
    label: 'Project Strategist',
    desc: 'Scopes websites, e-commerce flows & timelines.',
  },
  {
    id: 'researcher',
    label: 'Web Research Analyst',
    desc: 'Live Google Search grounding for benchmarks & tech.',
  },
];

const MODE_OPTIONS: Array<{
  id: AiChatMode;
  label: string;
  hint: string;
}> = [
  { id: 'auto', label: 'Auto (Fast)', hint: 'Instant Flash Lite routing' },
  { id: 'balanced', label: 'Balanced', hint: 'gemini-4-hydrogen (Low)' },
  { id: 'deep', label: 'Deep Thinking', hint: 'High reasoning depth' },
  { id: 'fast', label: 'Instant', hint: 'gemini-3.1-flash-lite' },
];

const STARTER_PROMPTS = [
  {
    title: 'Who is Rahi?',
    prompt: 'Who is Md. Humaun Husen Rahi and what does he study?',
  },
  {
    title: 'SAMIA’S CLOSET',
    prompt: "Tell me about Rahi's clothing brand SAMIA'S CLOSET and its vision.",
  },
  {
    title: 'Projects & RahiVerse',
    prompt: 'What technology projects is Rahi building, including RahiVerse?',
  },
  {
    title: 'Skills & Collaboration',
    prompt: 'What skills is Rahi working with and how can someone contact him to hire or collaborate?',
  },
];

export function AssistantPage() {
  const { navigate, profile } = useApp();
  const {
    threads,
    activeThread,
    activeThreadId,
    setActiveThreadId,
    startNewThread,
    removeThread,
    setPersona,
    setMode,
    setUseSearch,
    sendMessage,
    sending,
    error,
    clearError,
  } = useAi();

  const [draft, setDraft] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    updatePageSeo({
      title: `Vexora Studio AI — ${profile.brandName || 'Vexora Studio'}`,
      description:
        'Multi-turn AI portfolio concierge, project scoping strategist, and Google Search grounded web assistant for Vexora Studio and Md. Humaun Husen Rahi.',
    });
  }, [profile.brandName]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread.messages.length, sending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    const text = draft;
    setDraft('');
    await sendMessage(text);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-8 animate-editorial-enter">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DFD5C3] dark:border-[#1E2E26] pb-7">
        <div className="space-y-2.5 max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7]">
            Interactive Studio Concierge
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
            Vexora Studio AI
          </h1>
          <p className="text-sm text-[#4A5A52] dark:text-[#C5D1CB] leading-relaxed">
            Ask multi-turn questions about {profile.fullName}&apos;s portfolio, scope an upcoming website project, or enable live Google Search grounding for real-time web research.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/contact')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-[#1B4332] dark:border-[#52A58C] text-[#1B4332] dark:text-[#F4F1EA] rounded-md hover:bg-[#1B4332] hover:text-[#FAF8F3] dark:hover:bg-[#52A58C] dark:hover:text-[#0D1411] transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>Start a Real Project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* 12-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Roles + Saved Threads */}
        <aside className="lg:col-span-4 space-y-6">
          {/* New Chat */}
          <button
            type="button"
            onClick={() => startNewThread()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] dark:hover:bg-[#418B75] text-[#FAF8F3] dark:text-[#0D1411] rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          {/* System Instruction Role Selector */}
          <section className="p-4 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/55 dark:bg-[#141F1A]/75 space-y-3">
            <h2 className="text-xs font-semibold tracking-wide text-[#1B4332] dark:text-[#F4F1EA]">
              Assistant Role
            </h2>
            <div className="space-y-2">
              {PERSONA_OPTIONS.map((item) => {
                const selected = activeThread.persona === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPersona(item.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#FAF8F3] dark:bg-[#0D1411] border-[#1B4332] dark:border-[#6EC4A7]'
                        : 'border-[#DFD5C3]/80 dark:border-[#24352C] hover:border-[#1B4332]/50'
                    }`}
                  >
                    <p
                      className={`text-xs font-semibold ${
                        selected
                          ? 'text-[#1B4332] dark:text-[#6EC4A7]'
                          : 'text-[#18221D] dark:text-[#F4F1EA]'
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="text-[11px] text-[#5B6B63] dark:text-[#8E9F96] mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Saved Conversation History */}
          <section className="p-4 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/40 dark:bg-[#141F1A]/60 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold tracking-wide text-[#1B4332] dark:text-[#F4F1EA]">
                Saved Conversations
              </h2>
              <span className="text-[11px] font-mono-tabular text-[#5B6B63] dark:text-[#8E9F96]">
                {threads.length}
              </span>
            </div>

            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {threads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <div
                    key={thread.id}
                    className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-xs transition-colors ${
                      isActive
                        ? 'bg-[#FAF8F3] dark:bg-[#0D1411] border-[#1B4332]/60 dark:border-[#6EC4A7]/70 text-[#1B4332] dark:text-[#F4F1EA]'
                        : 'border-transparent hover:bg-[#FAF8F3]/60 dark:hover:bg-[#0D1411]/50 text-[#4A5A52] dark:text-[#A9B8B0]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveThreadId(thread.id)}
                      className="flex-1 flex items-center gap-2 text-left min-w-0 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{thread.title}</p>
                        <p className="text-[10px] text-[#5B6B63] dark:text-[#8E9F96]">
                          {thread.messages.length} msgs
                        </p>
                      </div>
                    </button>
                    {threads.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeThread(thread.id)}
                        aria-label="Delete conversation"
                        className="p-1 text-[#5B6B63] hover:text-red-600 dark:hover:text-red-400 opacity-70 group-hover:opacity-100 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </aside>

        {/* Main Chat Panel */}
        <section className="lg:col-span-8 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-[#FAF8F3] dark:bg-[#0F1814] flex flex-col min-h-[600px] max-h-[78dvh] overflow-hidden shadow-xs">
          {/* Controls Header */}
          <div className="px-5 py-3.5 border-b border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/65 dark:bg-[#121D18] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1B4332] dark:text-[#6EC4A7]" />
              <span className="text-xs font-semibold text-[#18221D] dark:text-[#F4F1EA]">
                {PERSONA_OPTIONS.find((p) => p.id === activeThread.persona)?.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[#FAF8F3] dark:bg-[#0D1411] p-1 rounded-md border border-[#DFD5C3] dark:border-[#24352C]">
                {MODE_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    title={m.hint}
                    onClick={() => setMode(m.id)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                      activeThread.mode === m.id
                        ? 'bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411]'
                        : 'text-[#4A5A52] dark:text-[#A9B8B0] hover:text-[#18221D] dark:hover:text-[#F4F1EA]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setUseSearch(!activeThread.useSearch)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md border transition-colors cursor-pointer ${
                  activeThread.useSearch
                    ? 'bg-[#1B4332]/10 dark:bg-[#52A58C]/20 border-[#1B4332]/50 dark:border-[#6EC4A7]/60 text-[#1B4332] dark:text-[#6EC4A7]'
                    : 'border-[#DFD5C3] dark:border-[#24352C] text-[#5B6B63] dark:text-[#8E9F96]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Google Search {activeThread.useSearch ? 'On' : 'Off'}</span>
              </button>
            </div>
          </div>

          {/* Scrollable Thread */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-6">
            {activeThread.messages.length === 0 ? (
              <div className="py-6 space-y-6">
                <div className="space-y-2 max-w-xl">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#2D6A6A] dark:text-[#6EC4A7]">
                    Multi-Turn Conversation Ready
                  </p>
                  <h2 className="font-display text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                    How can we help build your next project?
                  </h2>
                  <p className="text-sm text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed">
                    Choose a starter prompt below or write your own question in English or Bengali. Live Google Search grounding cites real web sources whenever enabled.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STARTER_PROMPTS.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => void sendMessage(item.prompt)}
                      className="text-left p-4 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/45 dark:bg-[#141F1A]/75 hover:border-[#1B4332] dark:hover:border-[#6EC4A7] transition-colors cursor-pointer space-y-1.5"
                    >
                      <p className="text-xs font-semibold text-[#1B4332] dark:text-[#6EC4A7]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#4A5A52] dark:text-[#C5D1CB] leading-relaxed">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-xl bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] text-sm leading-relaxed">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="w-full p-5 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/45 dark:bg-[#141F1A]/75 space-y-3">
                      <AiMessageContent text={msg.text} sources={msg.sources} />
                      <div className="pt-2 border-t border-[#DFD5C3]/50 dark:border-[#24352C]/70 flex items-center justify-between gap-3 text-[11px] font-mono-tabular text-[#5B6B63] dark:text-[#8E9F96]">
                        <span>
                          {msg.modelUsed || 'gemini-4-hydrogen'}
                          {msg.grounded ? ' · Grounded via Google Search' : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => void handleCopy(msg.id, msg.text)}
                          className="inline-flex items-center gap-1 hover:text-[#1B4332] dark:hover:text-[#6EC4A7] cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {sending && (
              <div className="p-4 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/40 dark:bg-[#141F1A]/60 flex items-center gap-2.5 text-xs text-[#4A5A52] dark:text-[#A9B8B0]">
                <Loader2 className="w-4 h-4 animate-spin text-[#1B4332] dark:text-[#6EC4A7]" />
                <span>
                  {activeThread.useSearch
                    ? 'Querying live web sources & composing response...'
                    : 'Thinking through your question...'}
                </span>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/60 text-xs text-red-800 dark:text-red-200 flex items-start justify-between gap-2">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={clearError}
                  aria-label="Dismiss error"
                  className="opacity-70 hover:opacity-100 cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div ref={threadEndRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 border-t border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/60 dark:bg-[#121D18]"
          >
            <div className="flex items-end gap-3">
              <textarea
                rows={2}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void handleSubmit(e);
                  }
                }}
                placeholder="Ask a follow-up question, request a project plan, or search live web data..."
                className="flex-1 resize-none px-4 py-3 text-sm rounded-lg border border-[#DFD5C3] dark:border-[#24352C] bg-[#FAF8F3] dark:bg-[#0D1411] text-[#18221D] dark:text-[#F4F1EA] placeholder:text-[#5B6B63]/75 focus:outline-none focus:border-[#1B4332] dark:focus:border-[#6EC4A7]"
              />
              <button
                type="submit"
                disabled={!draft.trim() || sending}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-medium rounded-lg bg-[#1B4332] hover:bg-[#143326] disabled:opacity-45 dark:bg-[#52A58C] dark:hover:bg-[#418B75] text-[#FAF8F3] dark:text-[#0D1411] transition-colors cursor-pointer shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
