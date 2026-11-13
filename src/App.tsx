/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AiProvider } from './contexts/AiContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AiDrawer } from './components/AiDrawer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ServicesPage } from './pages/ServicesPage';
import { AssistantPage } from './pages/AssistantPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { updatePageSeo } from './lib/seo';
import { PRIVATE_ADMIN_ENTRY } from './lib/firebase';

function ToastRegion() {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`flex items-start gap-3 p-3.5 rounded-lg border shadow-lg text-xs leading-relaxed ${
            toast.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/95 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
              : toast.type === 'success'
                ? 'bg-[#FAF8F3] dark:bg-[#141F1A] border-[#1B4332]/40 dark:border-[#52A58C]/60 text-[#18221D] dark:text-[#F4F1EA]'
                : 'bg-white dark:bg-[#141F1A] border-[#DFD5C3] dark:border-[#24352C] text-[#18221D] dark:text-[#F4F1EA]'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#1B4332] dark:text-[#6EC4A7] shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-[#2D6A6A] dark:text-[#6EC4A7] shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{toast.text}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="text-current opacity-60 hover:opacity-100 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function NotFoundPage() {
  const { navigate } = useApp();

  useEffect(() => {
    updatePageSeo({
      title: 'Page Not Found — RAHI',
      description: 'The requested page could not be found on the RAHI portfolio.',
    });
  }, []);

  return (
    <main className="max-w-[760px] mx-auto px-6 py-24 text-center space-y-6">
      <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#2D6A6A] dark:text-[#6EC4A7]">
        404 — Page Not Found
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
        This page does not exist.
      </h1>
      <p className="text-sm text-[#4A5A52] dark:text-[#C5D1CB] max-w-md mx-auto leading-relaxed">
        The link you followed may have been moved or removed. You can return to the home page or explore the design gallery.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-5 py-2.5 text-sm font-medium bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md transition-colors cursor-pointer"
        >
          Back to Home
        </button>
        <button
          type="button"
          onClick={() => navigate('/gallery')}
          className="px-5 py-2.5 text-sm font-medium border border-[#DFD5C3] dark:border-[#24352C] text-[#18221D] dark:text-[#F4F1EA] rounded-md hover:border-[#1B4332] transition-colors cursor-pointer"
        >
          Explore Design Gallery
        </button>
      </div>
    </main>
  );
}

function AppShell() {
  const { route, navigate, isAdmin, authReady, mobileMenuOpen } = useApp();
  const normalizedRoute = route.replace(/\/+$/, '') || '/';

  // Private owner keyboard shortcut: Alt + Shift + R
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        navigate(isAdmin ? '/admin/dashboard' : PRIVATE_ADMIN_ENTRY);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, isAdmin]);

  const renderPage = () => {
    if (normalizedRoute === '/') return <HomePage />;
    if (normalizedRoute === '/about') return <AboutPage />;
    if (normalizedRoute === '/gallery') return <GalleryPage />;
    if (normalizedRoute === '/projects') return <ProjectsPage />;
    if (normalizedRoute === '/skills') return <SkillsPage />;
    if (normalizedRoute === '/experience') return <ExperiencePage />;
    if (normalizedRoute === '/services') return <ServicesPage />;
    if (normalizedRoute === '/assistant') return <AssistantPage />;
    if (normalizedRoute === '/contact') return <ContactPage />;

    // Private secret admin entry URL
    if (normalizedRoute === PRIVATE_ADMIN_ENTRY) {
      return <AdminPage />;
    }

    // Standard /admin/* routes are ONLY accessible when already authenticated as verified admin;
    // unauthenticated visitors probing /admin or /admin/login receive 404 Not Found.
    if (normalizedRoute === '/admin' || normalizedRoute.startsWith('/admin/')) {
      if (!authReady) {
        return (
          <main className="max-w-[1200px] mx-auto px-6 py-16">
            <div className="h-48 rounded-xl bg-[#F2EFE7] dark:bg-[#141F1A] animate-pulse" />
          </main>
        );
      }
      return isAdmin ? <AdminPage /> : <NotFoundPage />;
    }

    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] dark:bg-[#0A120F] text-[#18221D] dark:text-[#F4F1EA] transition-colors">
      <Navbar />
      <div
        className={
          mobileMenuOpen
            ? 'hidden md:flex md:flex-col md:flex-1'
            : 'flex-1 flex flex-col'
        }
      >
        <div className="flex-1">{renderPage()}</div>
        <Footer />
      </div>
      <AiDrawer />
      <ToastRegion />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AiProvider>
        <AppShell />
      </AiProvider>
    </AppProvider>
  );
}
