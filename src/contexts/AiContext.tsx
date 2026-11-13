import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useApp } from './AppContext';
import {
  buildPortfolioSnapshot,
  sendAiChatMessage,
  useAiThreads,
} from '../lib/aiAssistant';
import {
  AiChatMessage,
  AiChatMode,
  AiChatPersona,
  AiChatThread,
} from '../types';

interface AiContextValue {
  threads: AiChatThread[];
  activeThread: AiChatThread;
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  startNewThread: (persona?: AiChatPersona) => AiChatThread;
  removeThread: (id: string) => void;
  setPersona: (persona: AiChatPersona) => void;
  setMode: (mode: AiChatMode) => void;
  setUseSearch: (useSearch: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  sending: boolean;
  error: string | null;
  clearError: () => void;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AiContext = createContext<AiContextValue | null>(null);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const {
    isAdmin,
    profile,
    about,
    settings,
    projects,
    services,
    skills,
    experience,
  } = useApp();

  const {
    threads,
    activeThread,
    activeThreadId,
    setActiveThreadId,
    updateActiveThread,
    startNewThread,
    removeThread,
  } = useAiThreads(isAdmin);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const portfolioSnapshot = useMemo(
    () =>
      buildPortfolioSnapshot({
        profile,
        about,
        settings,
        projects,
        services,
        skills,
        experience,
      }),
    [profile, about, settings, projects, services, skills, experience]
  );

  const setPersona = useCallback(
    (persona: AiChatPersona) => {
      updateActiveThread((prev) => ({
        ...prev,
        persona,
        useSearch: persona === 'researcher' ? true : prev.useSearch,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateActiveThread]
  );

  const setMode = useCallback(
    (mode: AiChatMode) => {
      updateActiveThread((prev) => ({
        ...prev,
        mode,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateActiveThread]
  );

  const setUseSearch = useCallback(
    (useSearch: boolean) => {
      updateActiveThread((prev) => ({
        ...prev,
        useSearch,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateActiveThread]
  );

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || sending) return;

      setError(null);
      const userMsg: AiChatMessage = {
        id: `msg_${Date.now()}_u`,
        role: 'user',
        text,
        createdAt: new Date().toISOString(),
      };

      const updatedHistory = [...activeThread.messages, userMsg];
      const nextTitle =
        activeThread.messages.length === 0
          ? text.slice(0, 48) + (text.length > 48 ? '...' : '')
          : activeThread.title;

      updateActiveThread((prev) => ({
        ...prev,
        title: nextTitle,
        messages: [...prev.messages, userMsg],
        updatedAt: new Date().toISOString(),
      }));

      setSending(true);
      try {
        const result = await sendAiChatMessage({
          messages: updatedHistory.map((m) => ({ role: m.role, text: m.text })),
          mode: activeThread.mode,
          persona: activeThread.persona,
          useSearch: activeThread.useSearch,
          portfolioContext: portfolioSnapshot,
        });

        const modelMsg: AiChatMessage = {
          id: `msg_${Date.now()}_m`,
          role: 'model',
          text: result.reply,
          createdAt: new Date().toISOString(),
          modelUsed: result.modelUsed,
          grounded: result.grounded,
          searchQueries: result.searchQueries,
          sources: result.sources,
        };

        updateActiveThread(
          (prev) => ({
            ...prev,
            title: nextTitle,
            messages: [...prev.messages, modelMsg],
            updatedAt: new Date().toISOString(),
          }),
          true
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to reach the AI assistant right now.';
        setError(message);
      } finally {
        setSending(false);
      }
    },
    [activeThread, portfolioSnapshot, sending, updateActiveThread]
  );

  const value = useMemo<AiContextValue>(
    () => ({
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
      clearError: () => setError(null),
      drawerOpen,
      setDrawerOpen,
    }),
    [
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
      drawerOpen,
    ]
  );

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>;
}

export function useAi() {
  const ctx = useContext(AiContext);
  if (!ctx) throw new Error('useAi must be used inside AiProvider');
  return ctx;
}
