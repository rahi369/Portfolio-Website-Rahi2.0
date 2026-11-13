import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Globe,
  Loader2,
  Plus,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAi } from '../contexts/AiContext';
import { AiMessageContent } from './AiMessageContent';
import { PRIVATE_ADMIN_ENTRY } from '../lib/firebase';
import { AiChatMode, AiChatPersona } from '../types';

const STARTERS = [
  "Who is Rahi & where is he from?",
  "Tell me about SAMIA'S CLOSET and RahiVerse.",
  "What skills & services is Rahi working on?",
];

export function AiDrawer() {
  const { route, navigate, mobileMenuOpen } = useApp();
  const {
    activeThread,
    sendMessage,
    sending,
    error,
    clearError,
    setPersona,
    setMode,
    setUseSearch,
    startNewThread,
    drawerOpen,
    setDrawerOpen,
  } = useAi();

  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const normalizedRoute = route.replace(/\/+$/, '') || '/';
  const isHiddenRoute =
    normalizedRoute === '/assistant' ||
    normalizedRoute === PRIVATE_ADMIN_ENTRY ||
    normalizedRoute.startsWith('/admin');

  useEffect(() => {
    if (!drawerOpen) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeThread.messages.length, sending, drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen, setDrawerOpen]);

  if (mobileMenuOpen || isHiddenRoute) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    const text = draft;
    setDraft('');
    await sendMessage(text);
  };

  return (
    <>
      {!drawerOpen && (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open Vexora Studio AI Assistant"
          className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] dark:hover:bg-[#418B75] text-[#FAF8F3] dark:text-[#0A120F] text-xs font-medium tracking-wide shadow-lg border border-[#143326]/20 dark:border-[#6EC4A7]/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Studio AI</span>
        </button>
      )}

      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vexora Studio AI Assistant"
          className="fixed inset-0 z-50 flex justify-end bg-[#0A120F]/50 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] h-dvh bg-[#FAF8F3] dark:bg-[#0A120F] border-l border-[#DFD5C3] dark:border-[#1E2E26] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#DFD5C3] dark:border-[#1E2E26] bg-[#F2EFE7]/70 dark:bg-[#111C17] flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1B4332] dark:text-[#6EC4A7]" />
                  <h2 className="font-display text-xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                    Vexora Studio AI
                  </h2>
                </div>
                <p className="text-[11px] text-[#5B6B63] dark:text-[#8E9F96]">
                  Official Assistant for Md. Humaun Husen Rahi
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/assistant');
                  }}
                  title="Open full page studio"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded hover:border-[#1B4332] dark:hover:border-[#6EC4A7] text-[#18221D] dark:text-[#F4F1EA] cursor-pointer"
                >
                  <span>Full View</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close AI drawer"
                  className="p-2 text-[#5B6B63] dark:text-[#8E9F96] hover:text-[#1B4332] dark:hover:text-[#F4F1EA] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Compact Controls Bar */}
            <div className="px-5 py-2.5 border-b border-[#DFD5C3]/80 dark:border-[#24352C] bg-[#FAF8F3] dark:bg-[#0D1411] flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <select
                  aria-label="Assistant Role"
                  value={activeThread.persona}
                  onChange={(e) => setPersona(e.target.value as AiChatPersona)}
                  className="px-2 py-1 rounded border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/70 dark:bg-[#141F1A] text-[#18221D] dark:text-[#F4F1EA] cursor-pointer"
                >
                  <option value="concierge">Concierge</option>
                  <option value="strategist">Strategist</option>
                  <option value="researcher">Web Researcher</option>
                </select>
                <select
                  aria-label="Response Mode"
                  value={activeThread.mode}
                  onChange={(e) => setMode(e.target.value as AiChatMode)}
                  className="px-2 py-1 rounded border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/70 dark:bg-[#141F1A] text-[#18221D] dark:text-[#F4F1EA] cursor-pointer"
                >
                  <option value="auto">Auto (Fast)</option>
                  <option value="balanced">Balanced</option>
                  <option value="deep">Deep Thinking</option>
                  <option value="fast">Instant Lite</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setUseSearch(!activeThread.useSearch)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded border transition-colors cursor-pointer ${
                    activeThread.useSearch
                      ? 'bg-[#1B4332]/10 dark:bg-[#52A58C]/20 border-[#1B4332]/40 dark:border-[#52A58C]/60 text-[#1B4332] dark:text-[#6EC4A7]'
                      : 'border-[#DFD5C3] dark:border-[#24352C] text-[#5B6B63] dark:text-[#8E9F96]'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>Web Search {activeThread.useSearch ? 'On' : 'Off'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => startNewThread()}
                  title="New conversation"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#DFD5C3] dark:border-[#24352C] text-[#4A5A52] dark:text-[#A9B8B0] hover:border-[#1B4332] cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>New</span>
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {activeThread.messages.length === 0 ? (
                <div className="space-y-5 py-4">
                  <div className="space-y-2">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#2D6A6A] dark:text-[#6EC4A7]">
                      Studio Concierge
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                      Ask about Rahi&apos;s work, scope a project, or search the live web.
                    </h3>
                    <p className="text-xs text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed">
                      Multi-turn memory keeps your context across questions, with optional Google Search citations for live web benchmarks.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-[#5B6B63] dark:text-[#8E9F96]">
                      Suggested prompts
                    </p>
                    {STARTERS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="w-full text-left px-3.5 py-2.5 text-xs rounded-lg border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/50 dark:bg-[#141F1A]/80 hover:border-[#1B4332] dark:hover:border-[#6EC4A7] text-[#18221D] dark:text-[#F4F1EA] transition-colors cursor-pointer"
                      >
                        {prompt}
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
                      <div className="max-w-[85%] px-4 py-2.5 rounded-xl bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] text-sm leading-relaxed">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="w-full p-4 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/50 dark:bg-[#141F1A]/75 space-y-2">
                        <AiMessageContent text={msg.text} sources={msg.sources} />
                        <div className="pt-1 flex items-center justify-between text-[10px] font-mono-tabular text-[#5B6B63] dark:text-[#8E9F96]">
                          <span>
                            {msg.modelUsed || 'gemini-4-hydrogen'}
                            {msg.grounded ? ' · Grounded' : ''}
                          </span>
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
                      ? 'Searching live web & composing response...'
                      : 'Composing response...'}
                  </span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/60 text-xs text-red-800 dark:text-red-200 flex items-start justify-between gap-2">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={clearError}
                    className="opacity-70 hover:opacity-100 cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/55 dark:bg-[#121D18]"
            >
              <div className="flex items-end gap-2">
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
                  placeholder="Ask about services, projects, or search the web..."
                  className="flex-1 resize-none px-3.5 py-2.5 text-sm rounded-lg border border-[#DFD5C3] dark:border-[#24352C] bg-[#FAF8F3] dark:bg-[#0D1411] text-[#18221D] dark:text-[#F4F1EA] placeholder:text-[#5B6B63]/70 focus:outline-none focus:border-[#1B4332] dark:focus:border-[#6EC4A7]"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending}
                  aria-label="Send message"
                  className="p-3 rounded-lg bg-[#1B4332] hover:bg-[#143326] disabled:opacity-45 dark:bg-[#52A58C] dark:hover:bg-[#418B75] text-[#FAF8F3] dark:text-[#0D1411] transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
