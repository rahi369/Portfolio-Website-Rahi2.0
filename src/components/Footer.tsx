import { useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { PRIVATE_ADMIN_ENTRY } from '../lib/firebase';
import { getConnectedSocialLinks } from '../lib/social';

export function Footer() {
  const { navigate, profile, settings, isAdmin, getWhatsappUrl } = useApp();
  const waUrl = getWhatsappUrl();
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  const handleSecretTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current > 2500) {
      tapCountRef.current = 0;
    }
    lastTapRef.current = now;
    tapCountRef.current += 1;
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      navigate(isAdmin ? '/admin/dashboard' : PRIVATE_ADMIN_ENTRY);
    }
  };

  const socialLinks = getConnectedSocialLinks(settings);

  return (
    <footer className="border-t border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/75 dark:bg-[#111B16] mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="space-y-3 md:col-span-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-display text-3xl font-semibold tracking-tight text-[#1B4332] dark:text-[#F4F1EA] cursor-pointer text-left"
          >
            {profile.brandName || 'Vexora Studio'}
          </button>
          <p className="text-xs font-medium text-[#18221D] dark:text-[#E5ECE8]">
            Owner: {profile.fullName}
          </p>
          <p className="text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7]">
            {profile.professionalTitle}
            {profile.founderOf ? ` · Founder of ${profile.founderOf}` : ''}
          </p>
          <p className="font-display italic text-base text-[#8D5B63] dark:text-[#DFACB4]">
            &ldquo;{profile.tagline}&rdquo;
          </p>
          <p className="text-xs text-[#4A5A52] dark:text-[#A9B8B0] pt-1">
            {profile.location}
          </p>
        </div>

        <div className="space-y-3 md:col-span-2">
          <h3 className="text-xs font-semibold tracking-wide text-[#1B4332] dark:text-[#F4F1EA]">
            Explore
          </h3>
          <ul className="space-y-2.5 text-sm text-[#4A5A52] dark:text-[#A9B8B0]">
            <li>
              <button type="button" onClick={() => navigate('/')} className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer">
                Home
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/about')} className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer">
                About Me
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/gallery')} className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer">
                Design Gallery
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/projects')} className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer">
                Projects
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3 md:col-span-2">
          <h3 className="text-xs font-semibold tracking-wide text-[#1B4332] dark:text-[#F4F1EA]">
            Capabilities
          </h3>
          <ul className="space-y-2.5 text-sm text-[#4A5A52] dark:text-[#A9B8B0]">
            <li>
              <button type="button" onClick={() => navigate('/skills')} className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer">
                Skills
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/experience')} className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer">
                Experience
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/services')} className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer">
                Services
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/assistant')} className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer">
                AI Studio
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/contact')} className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer">
                Contact
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3 md:col-span-3">
          <h3 className="text-xs font-semibold tracking-wide text-[#1B4332] dark:text-[#F4F1EA]">
            Direct Contact
          </h3>
          <ul className="space-y-2.5 text-sm text-[#4A5A52] dark:text-[#A9B8B0]">
            <li>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors break-all"
              >
                {settings.contactEmail}
              </a>
            </li>
            {waUrl && (
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2D6A6A] dark:text-[#6EC4A7] font-medium hover:underline"
                >
                  WhatsApp Direct
                </a>
              </li>
            )}
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/sitemap.xml" className="text-xs hover:underline opacity-80">
                Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#DFD5C3]/80 dark:border-[#24352C]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5B6B63] dark:text-[#8E9F96]">
          <span onClick={handleSecretTap} className="select-none">
            {settings.copyrightNotice}
          </span>
          <span>{profile.brandName || 'Vexora Studio'} · Owner: {profile.fullName}</span>
        </div>
      </div>
    </footer>
  );
}
