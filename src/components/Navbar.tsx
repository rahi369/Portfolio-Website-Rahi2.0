import { useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Shield,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getConnectedSocialLinks } from '../lib/social';

export function Navbar() {
  const {
    route,
    navigate,
    mobileMenuOpen,
    setMobileMenuOpen,
    theme,
    toggleTheme,
    profile,
    settings,
    isAdmin,
    getWhatsappUrl,
  } = useApp();

  const navItems = [
    { path: '/about', label: 'About' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/projects', label: 'Projects' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  const mobileMenuItems = [
    { path: '/', label: 'Home', subtitle: 'Overview & Hero' },
    { path: '/about', label: 'About Me', subtitle: 'Biography & Journey' },
    { path: '/gallery', label: 'Design Gallery', subtitle: 'UI/UX & Visual Craft' },
    { path: '/projects', label: 'Selected Projects', subtitle: 'Builds & Case Studies' },
    { path: '/services', label: 'Freelance Services', subtitle: 'How I Help Clients' },
    { path: '/skills', label: 'Skills & Stack', subtitle: 'Tools & Technologies' },
    { path: '/experience', label: 'Experience & Credentials', subtitle: 'Timeline & Certificates' },
    { path: '/assistant', label: 'AI Studio Assistant', subtitle: 'Concierge & Live Search' },
    { path: '/contact', label: 'Contact & Hire Me', subtitle: 'Start a Project' },
  ];

  const socialLinks = getConnectedSocialLinks(settings);

  const whatsappUrl = getWhatsappUrl();

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div
        className={`sticky top-0 z-40 bg-[#FAF8F3]/92 dark:bg-[#0A120F]/92 backdrop-blur-md border-b border-[#DFD5C3]/90 dark:border-[#1E2E26] ${
          mobileMenuOpen ? 'hidden md:block' : ''
        }`}
      >
        {/* Slim Utility Bar (<= 36px) */}
        <div className="hidden md:block border-b border-[#DFD5C3]/60 dark:border-[#24352C]/70 bg-[#F2EFE7]/70 dark:bg-[#121D18]/80">
          <div className="max-w-[1200px] mx-auto px-6 h-8 flex items-center justify-between text-[11px] tracking-wide text-[#4A5A52] dark:text-[#A9B8B0]">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => handleNav('/skills')}
                className={`hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  route === '/skills' ? 'text-[#1B4332] dark:text-[#6EC4A7] font-medium' : ''
                }`}
              >
                Skills
              </button>
              <span aria-hidden="true" className="text-[#D8C7A8] dark:text-[#2F473B]">·</span>
              <button
                type="button"
                onClick={() => handleNav('/experience')}
                className={`hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  route === '/experience' ? 'text-[#1B4332] dark:text-[#6EC4A7] font-medium' : ''
                }`}
              >
                Experience &amp; Achievements
              </button>
              <span aria-hidden="true" className="text-[#D8C7A8] dark:text-[#2F473B]">·</span>
              <button
                type="button"
                onClick={() => handleNav('/assistant')}
                className={`inline-flex items-center gap-1 hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  route === '/assistant' ? 'text-[#1B4332] dark:text-[#6EC4A7] font-medium' : ''
                }`}
              >
                <Sparkles className="w-3 h-3" strokeWidth={1.7} />
                <span>AI Studio</span>
              </button>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {settings.cvPublic && settings.cvUrl && (
                <a
                  href={settings.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={settings.cvFileName || 'Rahi-CV.pdf'}
                  className="inline-flex items-center gap-1.5 text-[#1B4332] dark:text-[#6EC4A7] font-medium hover:underline whitespace-nowrap shrink-0"
                >
                  <Download className="w-3 h-3" strokeWidth={1.7} />
                  <span>Download CV</span>
                </a>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="inline-flex items-center gap-1.5 hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3 h-3" strokeWidth={1.7} />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3" strokeWidth={1.7} />
                    <span>Light</span>
                  </>
                )}
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleNav('/admin/dashboard')}
                  className="inline-flex items-center gap-1 text-[#1B4332] dark:text-[#6EC4A7] font-medium hover:underline transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Shield className="w-3 h-3" strokeWidth={1.7} />
                  <span>Admin Console</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Strict 3-Zone Top Bar Contract */}
        <header className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="font-display text-[21px] sm:text-[24px] font-semibold tracking-[0.02em] text-[#1B4332] dark:text-[#F4F1EA] hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            {profile.brandName || 'Vexora Studio'}
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-[#4A5A52] dark:text-[#C5D1CB]"
          >
            {navItems.map((item) => {
              const active = route === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className={`whitespace-nowrap shrink-0 py-1 transition-colors duration-200 cursor-pointer border-b ${
                    active
                      ? 'text-[#1B4332] dark:text-[#F4F1EA] border-[#1B4332] dark:border-[#6EC4A7]'
                      : 'border-transparent hover:text-[#1B4332] dark:hover:text-[#F4F1EA] hover:border-[#D8C7A8] dark:hover:border-[#395546]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNav('/contact')}
              className="px-4 py-2 text-xs font-medium tracking-wide bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] dark:hover:bg-[#418B75] text-[#FAF8F3] dark:text-[#0D1411] rounded-md transition-all duration-200 shadow-xs hover:shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              Hire Me
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#1B4332] dark:text-[#F4F1EA] cursor-pointer"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>
      </div>

      {/* Full-Display Editorial Studio Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="md:hidden fixed inset-0 h-dvh w-screen z-50 bg-[#FAF8F3] dark:bg-[#0D1411] overflow-y-auto overscroll-contain flex flex-col animate-editorial-enter"
        >
          {/* Dedicated Menu Top Bar */}
          <div className="px-6 h-16 border-b border-[#DFD5C3] dark:border-[#24352C] flex items-center justify-between shrink-0 bg-[#F2EFE7]/60 dark:bg-[#121D18]/75">
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-[22px] font-semibold tracking-[0.02em] text-[#1B4332] dark:text-[#F4F1EA]">
                {profile.brandName || 'Vexora Studio'}
              </span>
              <span className="text-[11px] text-[#5B6B63] dark:text-[#8E9F96]">
                Menu
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs font-medium text-[#1B4332] dark:text-[#F4F1EA] border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 px-6 py-6 flex flex-col justify-between gap-8">
            {/* Numbered Editorial Links */}
            <nav aria-label="Mobile Primary Navigation" className="divide-y divide-[#DFD5C3]/70 dark:divide-[#24352C]/80">
              {mobileMenuItems.map((item, idx) => {
                const active = route === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className="w-full py-3.5 text-left flex items-center justify-between gap-4 group cursor-pointer"
                  >
                    <div className="flex items-baseline gap-3.5 min-w-0">
                      <span className="font-display italic text-lg text-[#8D5B63] dark:text-[#DFACB4] w-6 shrink-0">
                        0{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`font-display text-2xl font-semibold leading-tight truncate ${
                            active
                              ? 'text-[#1B4332] dark:text-[#6EC4A7]'
                              : 'text-[#18221D] dark:text-[#F4F1EA]'
                          }`}
                        >
                          {item.label}
                        </p>
                        <p className="text-[11px] text-[#5B6B63] dark:text-[#8E9F96] mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        active
                          ? 'text-[#1B4332] dark:text-[#6EC4A7]'
                          : 'text-[#5B6B63] dark:text-[#8E9F96]'
                      }`}
                    />
                  </button>
                );
              })}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleNav('/admin/dashboard')}
                  className="w-full py-3.5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-baseline gap-3.5">
                    <Shield className="w-4 h-4 text-[#2D6A6A] dark:text-[#6EC4A7] shrink-0" />
                    <div>
                      <p className="font-display text-2xl font-semibold text-[#2D6A6A] dark:text-[#6EC4A7]">
                        Admin Console
                      </p>
                      <p className="text-[11px] text-[#5B6B63] dark:text-[#8E9F96]">
                        Manage Portfolio Content
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#2D6A6A] dark:text-[#6EC4A7] shrink-0" />
                </button>
              )}
            </nav>

            {/* Quick Actions, Direct Contact, Theme & Socials */}
            <div className="pt-5 border-t border-[#DFD5C3] dark:border-[#24352C] space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleNav('/contact')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md cursor-pointer"
                >
                  <span>Hire Me</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium border border-[#1B4332] dark:border-[#52A58C] text-[#1B4332] dark:text-[#F4F1EA] rounded-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] text-[#18221D] dark:text-[#F4F1EA] rounded-md"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Me</span>
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="w-3.5 h-3.5" />
                      <span>Switch to Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5" />
                      <span>Switch to Light Mode</span>
                    </>
                  )}
                </button>

                {settings.cvPublic && settings.cvUrl && (
                  <a
                    href={settings.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={settings.cvFileName || 'Rahi-CV.pdf'}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#F2EFE7] dark:bg-[#141F1A] border border-[#D8C7A8] dark:border-[#24352C] text-[#1B4332] dark:text-[#6EC4A7] rounded-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV</span>
                  </a>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#2D6A6A] dark:text-[#6EC4A7] font-medium">
                    {socialLinks.map((link, i) => (
                      <span key={link.label} className="inline-flex items-center gap-3">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {link.label}
                        </a>
                        {i < socialLinks.length - 1 && (
                          <span aria-hidden="true" className="text-[#D8C7A8] dark:text-[#24352C]">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
                <p>{profile.fullName} · {profile.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
