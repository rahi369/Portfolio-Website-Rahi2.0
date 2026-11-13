import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  AiChatMessage,
  AiChatMode,
  AiChatPersona,
  AiChatThread,
  AiGroundSource,
  ExperienceItem,
  ProjectItem,
  ServiceItem,
  SiteAbout,
  SiteProfile,
  SiteSettings,
  SkillItem,
} from '../types';

const THREADS_STORAGE_KEY = 'rahi_ai_threads_v1';

export interface AiChatApiResponse {
  reply: string;
  modelUsed: string;
  grounded: boolean;
  searchQueries: string[];
  sources: AiGroundSource[];
}

export function buildPortfolioSnapshot(data: {
  profile: SiteProfile;
  about: SiteAbout;
  settings: SiteSettings;
  projects: ProjectItem[];
  services: ServiceItem[];
  skills: SkillItem[];
  experience: ExperienceItem[];
}) {
  return {
    profile: {
      fullName: data.profile.fullName,
      brandName: data.profile.brandName,
      professionalTitle: data.profile.professionalTitle,
      founderOf: data.profile.founderOf,
      location: data.profile.location,
      tagline: data.profile.tagline,
      shortIntro: data.profile.shortIntro,
    },
    about: {
      personalIntroduction: data.about.personalIntroduction,
      entrepreneurship: data.about.entrepreneurship,
      professionalGoals: data.about.professionalGoals,
    },
    settings: {
      contactEmail: data.settings.contactEmail,
      whatsappNumber: data.settings.whatsappNumber,
    },
    projects: data.projects.slice(0, 12).map((p) => ({
      title: p.title,
      description: p.description,
      technologies: p.technologies,
      status: p.status,
      liveDemoUrl: p.liveDemoUrl,
    })),
    services: data.services.slice(0, 10).map((s) => ({
      title: s.title,
      description: s.description,
      startingPrice: s.startingPrice,
      features: s.features,
    })),
    skills: data.skills.slice(0, 30).map((sk) => ({
      name: sk.name,
      category: sk.category,
    })),
    experience: data.experience.slice(0, 12).map((e) => ({
      title: e.title,
      organization: e.organization,
      kind: e.kind,
      startDate: e.startDate,
      endDate: e.endDate,
      isCurrent: e.isCurrent,
    })),
  };
}

export async function sendAiChatMessage(payload: {
  messages: Array<{ role: 'user' | 'model'; text: string }>;
  mode: AiChatMode;
  persona: AiChatPersona;
  useSearch: boolean;
  portfolioContext: ReturnType<typeof buildPortfolioSnapshot>;
}): Promise<AiChatApiResponse> {
  const resp = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(25000),
  });

  const rawText = await resp.text();
  let parsed: Record<string, unknown> | null = null;
  if (rawText && !rawText.trimStart().startsWith('<')) {
    try {
      parsed = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      parsed = null;
    }
  }

  if (!resp.ok) {
    const errMsg =
      (parsed && typeof parsed.error === 'string' && parsed.error) ||
      (resp.status === 405
        ? 'AI server endpoint returned HTTP 405. Please deploy with the Node/Vercel API backend active and GEMINI_API_KEY configured.'
        : `AI request failed (HTTP ${resp.status}).`);
    throw new Error(errMsg);
  }

  if (!parsed || typeof parsed.reply !== 'string') {
    throw new Error(
      'AI endpoint returned HTML instead of JSON. Ensure /api/ai/chat is served by the backend.'
    );
  }

  return {
    reply: parsed.reply,
    modelUsed: typeof parsed.modelUsed === 'string' ? parsed.modelUsed : 'gemini-4-hydrogen',
    grounded: Boolean(parsed.grounded),
    searchQueries: Array.isArray(parsed.searchQueries)
      ? parsed.searchQueries.filter((q): q is string => typeof q === 'string')
      : [],
    sources: Array.isArray(parsed.sources)
      ? (parsed.sources as AiGroundSource[]).filter(
          (s) => s && typeof s.uri === 'string' && typeof s.title === 'string'
        )
      : [],
  };
}

export function createEmptyThread(
  persona: AiChatPersona = 'concierge',
  mode: AiChatMode = 'auto',
  useSearch = false
): AiChatThread {
  const id = `thread_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    title: 'New Conversation',
    persona,
    mode,
    useSearch,
    messages: [],
    updatedAt: new Date().toISOString(),
  };
}

function loadLocalThreads(): AiChatThread[] {
  try {
    const raw = localStorage.getItem(THREADS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is AiChatThread =>
        Boolean(t) && typeof t.id === 'string' && Array.isArray(t.messages)
    );
  } catch {
    return [];
  }
}

function saveLocalThreads(threads: AiChatThread[]) {
  try {
    localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads.slice(0, 20)));
  } catch {
    // Ignore storage quota errors
  }
}

export function useAiThreads(isAdmin: boolean) {
  const [threads, setThreads] = useState<AiChatThread[]>(() => {
    const existing = loadLocalThreads();
    return existing.length > 0 ? existing : [createEmptyThread()];
  });
  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    const existing = loadLocalThreads();
    return existing[0]?.id || threads[0].id;
  });

  // Sync admin threads from Firestore if permitted
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'ai_threads'));
        if (cancelled || snap.empty) return;
        const remoteThreads: AiChatThread[] = snap.docs
          .map((d) => {
            const data = d.data() as {
              title?: string;
              persona?: AiChatPersona;
              mode?: AiChatMode;
              useSearch?: boolean;
              messagesJson?: string;
              updatedAt?: { toDate?: () => Date };
            };
            let messages: AiChatMessage[] = [];
            try {
              messages = data.messagesJson ? JSON.parse(data.messagesJson) : [];
            } catch {
              messages = [];
            }
            return {
              id: d.id,
              title: data.title || 'Saved Thread',
              persona: data.persona || 'concierge',
              mode: data.mode || 'auto',
              useSearch: Boolean(data.useSearch),
              messages,
              updatedAt: data.updatedAt?.toDate
                ? data.updatedAt.toDate().toISOString()
                : new Date().toISOString(),
            };
          })
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

        if (remoteThreads.length > 0) {
          setThreads((prev) => {
            const mergedMap = new Map<string, AiChatThread>();
            for (const t of prev) {
              if (t.messages.length > 0) mergedMap.set(t.id, t);
            }
            for (const rt of remoteThreads) {
              mergedMap.set(rt.id, rt);
            }
            const merged = Array.from(mergedMap.values()).sort((a, b) =>
              b.updatedAt.localeCompare(a.updatedAt)
            );
            const next = merged.length > 0 ? merged : [createEmptyThread()];
            saveLocalThreads(next);
            return next;
          });
        }
      } catch {
        // Ignore if Firestore rules for ai_threads aren't deployed yet on external project
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const persistThread = useCallback(
    async (thread: AiChatThread) => {
      if (!isAdmin || thread.messages.length === 0) return;
      try {
        await setDoc(doc(db, 'ai_threads', thread.id), {
          title: thread.title.slice(0, 140),
          persona: thread.persona,
          mode: thread.mode,
          useSearch: thread.useSearch,
          messagesJson: JSON.stringify(thread.messages).slice(0, 195000),
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Silently ignore if Firestore rules on user's project haven't synced yet
      }
    },
    [isAdmin]
  );

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || threads[0];

  const updateActiveThread = useCallback(
    (updater: (prev: AiChatThread) => AiChatThread, syncRemote = false) => {
      let updatedSnapshot: AiChatThread | null = null;
      setThreads((prev) => {
        const next = prev.map((t) => {
          if (t.id !== activeThread.id) return t;
          updatedSnapshot = updater(t);
          return updatedSnapshot;
        });
        saveLocalThreads(next);
        return next;
      });
      if (syncRemote && updatedSnapshot) {
        void persistThread(updatedSnapshot);
      }
    },
    [activeThread.id, persistThread]
  );

  const startNewThread = useCallback(
    (persona: AiChatPersona = activeThread.persona) => {
      const fresh = createEmptyThread(persona, activeThread.mode, activeThread.useSearch);
      setThreads((prev) => {
        const next = [fresh, ...prev].slice(0, 20);
        saveLocalThreads(next);
        return next;
      });
      setActiveThreadId(fresh.id);
      return fresh;
    },
    [activeThread.mode, activeThread.persona, activeThread.useSearch]
  );

  const removeThread = useCallback(
    (threadId: string) => {
      setThreads((prev) => {
        const filtered = prev.filter((t) => t.id !== threadId);
        const next = filtered.length > 0 ? filtered : [createEmptyThread()];
        saveLocalThreads(next);
        if (activeThreadId === threadId) {
          setActiveThreadId(next[0].id);
        }
        return next;
      });
      if (isAdmin) {
        void deleteDoc(doc(db, 'ai_threads', threadId)).catch(() => {});
      }
    },
    [activeThreadId, isAdmin]
  );

  return {
    threads,
    activeThread,
    activeThreadId,
    setActiveThreadId,
    updateActiveThread,
    startNewThread,
    removeThread,
  };
}
