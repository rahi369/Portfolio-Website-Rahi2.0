import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  AUTHORIZED_ADMIN_EMAIL,
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  testFirestoreConnection,
} from '../lib/firebase';
import {
  DEFAULT_ABOUT,
  DEFAULT_EXPERIENCE,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
  DEFAULT_SKILLS,
} from '../data/seedPortfolio';
import {
  AchievementItem,
  ContactMessage,
  DesignItem,
  ExperienceItem,
  ProjectItem,
  ServiceItem,
  SiteAbout,
  SiteProfile,
  SiteSettings,
  SkillItem,
  ThemeMode,
  ToastMessage,
} from '../types';

interface AppContextValue {
  route: string;
  navigate: (to: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: ThemeMode;
  toggleTheme: () => void;
  user: User | null;
  isAdmin: boolean;
  authReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  profile: SiteProfile;
  about: SiteAbout;
  settings: SiteSettings;
  gallery: DesignItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  experience: ExperienceItem[];
  achievements: AchievementItem[];
  services: ServiceItem[];
  messages: ContactMessage[];
  loadingContent: boolean;
  hasSeededFirestore: boolean;
  seedInitialPortfolioToFirestore: () => Promise<void>;
  getWhatsappUrl: (message?: string) => string | null;
  toasts: ToastMessage[];
  pushToast: (type: ToastMessage['type'], text: string) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const THEME_STORAGE_KEY = 'rahi_portfolio_theme_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<string>(() => window.location.pathname || '/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const [fsProfile, setFsProfile] = useState<SiteProfile | null>(null);
  const [fsAbout, setFsAbout] = useState<SiteAbout | null>(null);
  const [fsSettings, setFsSettings] = useState<SiteSettings | null>(null);
  const [fsGallery, setFsGallery] = useState<DesignItem[]>([]);
  const [fsProjects, setFsProjects] = useState<ProjectItem[] | null>(null);
  const [fsSkills, setFsSkills] = useState<SkillItem[] | null>(null);
  const [fsExperience, setFsExperience] = useState<ExperienceItem[] | null>(null);
  const [fsAchievements, setFsAchievements] = useState<AchievementItem[]>([]);
  const [fsServices, setFsServices] = useState<ServiceItem[] | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((type: ToastMessage['type'], text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const navigate = useCallback((to: string) => {
    setMobileMenuOpen(false);
    if (to === window.location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({}, '', to);
    setRoute(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setMobileMenuOpen(false);
      setRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    void testFirestoreConnection();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      let verifiedAdmin = false;
      if (
        firebaseUser.emailVerified &&
        firebaseUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL
      ) {
        verifiedAdmin = true;
      } else if (firebaseUser.emailVerified) {
        try {
          const snap = await getDoc(doc(db, 'admins', firebaseUser.uid));
          verifiedAdmin = snap.exists();
        } catch {
          verifiedAdmin = false;
        }
      }
      setIsAdmin(verifiedAdmin);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Subscribe to public portfolio collections
  useEffect(() => {
    const unsubProfile = onSnapshot(
      doc(db, 'site_profile', 'main'),
      (snap) => {
        setFsProfile(snap.exists() ? (snap.data() as SiteProfile) : null);
      },
      () => setFsProfile(null)
    );

    const unsubAbout = onSnapshot(
      doc(db, 'site_about', 'main'),
      (snap) => {
        setFsAbout(snap.exists() ? (snap.data() as SiteAbout) : null);
      },
      () => setFsAbout(null)
    );

    const unsubSettings = onSnapshot(
      doc(db, 'site_settings', 'main'),
      (snap) => {
        setFsSettings(snap.exists() ? (snap.data() as SiteSettings) : null);
      },
      () => setFsSettings(null)
    );

    const galleryQ = isAdmin
      ? collection(db, 'gallery')
      : query(collection(db, 'gallery'), where('published', '==', true));
    const unsubGallery = onSnapshot(
      galleryQ,
      (snap) => {
        setFsGallery(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DesignItem, 'id'>) }))
        );
        setLoadingContent(false);
      },
      () => {
        setFsGallery([]);
        setLoadingContent(false);
      }
    );

    const projectsQ = isAdmin
      ? collection(db, 'projects')
      : query(collection(db, 'projects'), where('published', '==', true));
    const unsubProjects = onSnapshot(
      projectsQ,
      (snap) => {
        setFsProjects(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProjectItem, 'id'>) }))
        );
      },
      () => setFsProjects([])
    );

    const unsubSkills = onSnapshot(
      collection(db, 'skills'),
      (snap) => {
        setFsSkills(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SkillItem, 'id'>) }))
        );
      },
      () => setFsSkills([])
    );

    const unsubExp = onSnapshot(
      collection(db, 'experience'),
      (snap) => {
        setFsExperience(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<ExperienceItem, 'id'>),
          }))
        );
      },
      () => setFsExperience([])
    );

    const achQ = isAdmin
      ? collection(db, 'achievements')
      : query(collection(db, 'achievements'), where('published', '==', true));
    const unsubAch = onSnapshot(
      achQ,
      (snap) => {
        setFsAchievements(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<AchievementItem, 'id'>),
          }))
        );
      },
      () => setFsAchievements([])
    );

    const servicesQ = isAdmin
      ? collection(db, 'services')
      : query(collection(db, 'services'), where('published', '==', true));
    const unsubServices = onSnapshot(
      servicesQ,
      (snap) => {
        setFsServices(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ServiceItem, 'id'>) }))
        );
      },
      () => setFsServices([])
    );

    return () => {
      unsubProfile();
      unsubAbout();
      unsubSettings();
      unsubGallery();
      unsubProjects();
      unsubSkills();
      unsubExp();
      unsubAch();
      unsubServices();
    };
  }, [isAdmin]);

  // Admin-only Messages subscription
  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setMessages([]);
      return;
    }

    const unsub = onSnapshot(
      collection(db, 'messages'),
      (snap) => {
        setMessages(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<ContactMessage, 'id'>),
          }))
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'messages')
    );

    return () => unsub();
  }, [authReady, user, isAdmin]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user.email?.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL) {
        pushToast(
          'error',
          'Signed in account is not the authorized portfolio administrator.'
        );
      } else {
        pushToast('success', 'Signed in to RAHI Admin.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed.';
      if (msg.includes('unauthorized-domain')) {
        pushToast(
          'error',
          `Domain "${window.location.hostname}" is not yet authorized. Add it in Firebase Console -> Authentication -> Settings -> Authorized domains.`
        );
      } else if (msg.includes('popup-blocked')) {
        pushToast(
          'error',
          'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.'
        );
      } else {
        pushToast('error', msg);
      }
    }
  }, [pushToast]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        if (!cred.user.emailVerified) {
          pushToast(
            'error',
            'Please verify your email address before accessing Admin controls.'
          );
          return;
        }
        if (cred.user.email?.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL) {
          pushToast(
            'error',
            'This email is not authorized for administrator access.'
          );
          return;
        }
        pushToast('success', 'Signed in to RAHI Admin.');
      } catch (err) {
        const raw = err instanceof Error ? err.message : 'Sign-in failed.';
        if (raw.includes('operation-not-allowed')) {
          pushToast(
            'error',
            'Email/Password sign-in is not yet enabled in Firebase Console -> Authentication -> Sign-in method. Use Google Sign-In or enable Email/Password there.'
          );
        } else {
          pushToast('error', raw);
        }
      }
    },
    [pushToast]
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    pushToast('info', 'Signed out.');
  }, [pushToast]);

  const seedInitialPortfolioToFirestore = useCallback(async () => {
    if (!isAdmin) {
      pushToast('error', 'Administrator permission required.');
      return;
    }
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'site_profile', 'main'), {
        ...DEFAULT_PROFILE,
        updatedAt: serverTimestamp(),
      });
      batch.set(doc(db, 'site_about', 'main'), {
        ...DEFAULT_ABOUT,
        updatedAt: serverTimestamp(),
      });
      batch.set(doc(db, 'site_settings', 'main'), {
        ...DEFAULT_SETTINGS,
        updatedAt: serverTimestamp(),
      });
      for (const proj of DEFAULT_PROJECTS) {
        const { id, ...rest } = proj;
        batch.set(doc(db, 'projects', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const skill of DEFAULT_SKILLS) {
        const { id, ...rest } = skill;
        batch.set(doc(db, 'skills', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const exp of DEFAULT_EXPERIENCE) {
        const { id, ...rest } = exp;
        batch.set(doc(db, 'experience', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const svc of DEFAULT_SERVICES) {
        const { id, ...rest } = svc;
        batch.set(doc(db, 'services', id), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
      pushToast('success', 'Initial RAHI portfolio records saved to Firestore.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'batch-seed-rahi');
    }
  }, [isAdmin, pushToast]);

  const profile = fsProfile || DEFAULT_PROFILE;
  const about = fsAbout || DEFAULT_ABOUT;
  const settings = fsSettings || DEFAULT_SETTINGS;
  const gallery = fsGallery;
  const projects = useMemo(
    () => (fsProjects && fsProjects.length > 0 ? fsProjects : DEFAULT_PROJECTS),
    [fsProjects]
  );
  const skills = useMemo(
    () => (fsSkills && fsSkills.length > 0 ? fsSkills : DEFAULT_SKILLS),
    [fsSkills]
  );
  const experience = useMemo(
    () => (fsExperience && fsExperience.length > 0 ? fsExperience : DEFAULT_EXPERIENCE),
    [fsExperience]
  );
  const achievements = fsAchievements;
  const services = useMemo(
    () => (fsServices && fsServices.length > 0 ? fsServices : DEFAULT_SERVICES),
    [fsServices]
  );

  const hasSeededFirestore = Boolean(fsProfile && fsSettings);

  const getWhatsappUrl = useCallback(
    (message?: string) => {
      const digits = (settings.whatsappNumber || '').replace(/[^\d]/g, '');
      if (!digits) return null;
      const text = encodeURIComponent(
        message ||
          'Hello Rahi, I would like to discuss a web development or design project.'
      );
      return `https://wa.me/${digits}?text=${text}`;
    },
    [settings.whatsappNumber]
  );

  const value: AppContextValue = {
    route,
    navigate,
    mobileMenuOpen,
    setMobileMenuOpen,
    theme,
    toggleTheme,
    user,
    isAdmin,
    authReady,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    profile,
    about,
    settings,
    gallery,
    projects,
    skills,
    experience,
    achievements,
    services,
    messages,
    loadingContent,
    hasSeededFirestore,
    seedInitialPortfolioToFirestore,
    getWhatsappUrl,
    toasts,
    pushToast,
    dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
