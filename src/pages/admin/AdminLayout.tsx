import React, { useState } from 'react';
import {
  Award,
  Briefcase,
  FolderKanban,
  Globe,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  ShieldAlert,
  Sparkles,
  User as UserIcon,
  Wrench,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AUTHORIZED_ADMIN_EMAIL } from '../../lib/firebase';

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-[#FAF8F3] dark:bg-[#141F1A] border border-[#DFD5C3] dark:border-[#24352C] rounded-xl p-6 space-y-4 shadow-2xl">
        <h3 className="font-display text-2xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          {title}
        </h3>
        <p className="text-sm text-[#4A5A52] dark:text-[#C5D1CB]">{message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-medium bg-red-700 hover:bg-red-800 text-white rounded-md cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const ADMIN_NAV = [
  { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/profile', label: 'Profile & About', icon: UserIcon },
  { path: '/admin/gallery', label: 'Design Gallery', icon: Image },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/skills', label: 'Skills', icon: Sparkles },
  { path: '/admin/experience', label: 'Experience & Edu', icon: Briefcase },
  { path: '/admin/services', label: 'Services', icon: Wrench },
  { path: '/admin/messages', label: 'Messages', icon: Mail },
  { path: '/admin/achievements', label: 'Achievements & CV', icon: Award },
  { path: '/admin/seo', label: 'SEO Settings', icon: Globe },
  { path: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const {
    route,
    navigate,
    user,
    isAdmin,
    authReady,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    messages,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  if (!authReady) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="h-48 rounded-xl bg-[#F2EFE7] dark:bg-[#141F1A] animate-pulse" />
      </main>
    );
  }

  if (!user || !isAdmin) {
    const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSigningIn(true);
      try {
        await signInWithEmail(email, password);
      } finally {
        setSigningIn(false);
      }
    };

    return (
      <main className="max-w-md mx-auto px-6 py-16">
        <div className="border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] rounded-xl p-7 sm:p-8 space-y-6">
          <div className="space-y-2 text-center">
            <ShieldAlert className="w-8 h-8 mx-auto text-[#1B4332] dark:text-[#6EC4A7]" />
            <h1 className="font-display text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
              RAHI Admin Login
            </h1>
            <p className="text-xs text-[#4A5A52] dark:text-[#A9B8B0]">
              Protected by Firebase Authentication and Firestore backend security rules. Only verified administrator access is permitted.
            </p>
          </div>

          {user && !isAdmin && (
            <div className="p-3.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 space-y-2">
              <p>
                Signed in as <strong>{user.email}</strong>, which is not authorized for admin access (expected verified {AUTHORIZED_ADMIN_EMAIL}).
              </p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="underline font-medium cursor-pointer"
              >
                Sign out and switch account
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="w-full py-3 px-4 text-sm font-medium bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md transition-colors cursor-pointer"
          >
            Continue with Google
          </button>

          <div className="relative py-1">
            <div className="border-t border-[#DFD5C3] dark:border-[#24352C]" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white dark:bg-[#141F1A] px-3 text-xs text-[#5B6B63]">
              or Email &amp; Password
            </span>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
            <button
              type="submit"
              disabled={signingIn}
              className="w-full py-2.5 px-4 text-sm font-medium border border-[#1B4332] dark:border-[#52A58C] text-[#1B4332] dark:text-[#F4F1EA] rounded-md hover:bg-[#1B4332]/5 cursor-pointer"
            >
              {signingIn ? 'Signing in...' : 'Sign in with Email'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar / Mobile Nav */}
        <aside className="lg:col-span-3 border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] rounded-xl p-4 space-y-4 lg:sticky lg:top-28">
          <div className="px-2 pb-3 border-b border-[#F2EFE7] dark:border-[#24352C] flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1B4332] dark:text-[#6EC4A7]">
                RAHI Admin Panel
              </p>
              <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96] truncate">
                {user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              title="Sign out"
              aria-label="Sign out"
              className="p-2 text-[#5B6B63] hover:text-red-600 cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <nav
            aria-label="Admin Navigation"
            className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0"
          >
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const active = route === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411]'
                      : 'text-[#4A5A52] dark:text-[#C5D1CB] hover:bg-[#F2EFE7] dark:hover:bg-[#1B2A23]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.path === '/admin/messages' && unreadCount > 0 && (
                    <span className="font-mono-tabular text-[11px] opacity-90">
                      ({unreadCount})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active Admin Workspace */}
        <section className="lg:col-span-9 min-w-0">{children}</section>
      </div>
    </div>
  );
}
