import { useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAi } from '../contexts/AiContext';
import { updatePageSeo } from '../lib/seo';
import { ResilientImage } from '../components/ResilientImage';

export function HomePage() {
  const {
    navigate,
    profile,
    about,
    settings,
    gallery,
    projects,
    skills,
    experience,
    services,
    isAdmin,
    getWhatsappUrl,
  } = useApp();
  const { setDrawerOpen } = useAi();

  useEffect(() => {
    updatePageSeo({
      title: settings.seoTitle || `${profile.brandName} — ${profile.fullName}`,
      description: settings.seoDescription || profile.shortIntro,
      imageUrl: settings.seoShareImageUrl || profile.profilePhotoUrl,
    });
  }, [profile, settings]);

  const featuredDesigns = gallery
    .filter((d) => d.published)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);
  const selectedProjects = projects
    .filter((p) => p.published)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);
  const topServices = services.filter((s) => s.published).slice(0, 4);
  const whatsappUrl = getWhatsappUrl();
  const leadDesign = featuredDesigns[0];
  const secondaryDesigns = featuredDesigns.slice(1);

  return (
    <main className="animate-editorial-enter">
      {/* Studio Architectural Hero */}
      <section className="relative overflow-hidden studio-hero-bg">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 sm:pt-14 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-7 py-2">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5 text-xs tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7] font-medium">
                  <span>{profile.brandName || 'Vexora Studio'}</span>
                  <span aria-hidden="true" className="text-[#D8C7A8] dark:text-[#3A5448]">·</span>
                  <span>{profile.professionalTitle}</span>
                  {profile.founderOf && (
                    <>
                      <span aria-hidden="true" className="text-[#D8C7A8] dark:text-[#3A5448]">·</span>
                      <span>Founder of {profile.founderOf}</span>
                    </>
                  )}
                </div>

                <h1 className="font-display text-[clamp(2.65rem,5vw,4.35rem)] leading-[1.03] font-semibold tracking-[-0.02em] text-[#1B4332] dark:text-[#F4F1EA]">
                  {profile.fullName}
                </h1>

                <div className="pt-1 flex items-center gap-3.5">
                  <span className="w-10 h-px bg-[#8D5B63] dark:bg-[#DFACB4] shrink-0" aria-hidden="true" />
                  <p className="font-display text-xl sm:text-2xl italic text-[#8D5B63] dark:text-[#DFACB4]">
                    &ldquo;{profile.tagline}&rdquo;
                  </p>
                </div>
              </div>

              <p className="text-[16px] leading-[1.75] text-[#3F4E47] dark:text-[#C5D1CB] max-w-[56ch]">
                {profile.shortIntro}
              </p>

              <div className="flex items-center gap-2 text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                <MapPin className="w-3.5 h-3.5 text-[#2D6A6A] dark:text-[#6EC4A7] shrink-0" />
                <span>{profile.location}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/gallery')}
                  className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] dark:hover:bg-[#418B75] text-[#FAF8F3] dark:text-[#0A120F] rounded-md transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>View My Designs</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-[#1B4332] dark:border-[#52A58C] text-[#1B4332] dark:text-[#F4F1EA] hover:bg-[#1B4332]/6 dark:hover:bg-[#52A58C]/10 rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Hire Me</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium bg-[#F2EFE7] dark:bg-[#111C17] border border-[#D8C7A8] dark:border-[#1E2E26] text-[#1B4332] dark:text-[#6EC4A7] hover:border-[#2D6A6A] rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask Studio AI</span>
                </button>
              </div>
            </div>

            {/* Real Uploaded Portrait with Architectural Museum Mat Frame */}
            <div className="lg:col-span-5 flex">
              <div className="w-full p-3 rounded-2xl border border-[#D8C7A8] dark:border-[#1E2E26] bg-[#F2EFE7] dark:bg-[#111C17] shadow-[0_32px_70px_-28px_rgba(27,67,50,0.22)] dark:shadow-[0_32px_70px_-28px_rgba(0,0,0,0.75)] flex flex-col">
                <div className="w-full flex-1 rounded-xl overflow-hidden bg-[#E9E4D8] dark:bg-[#16241D] aspect-[4/5] lg:aspect-auto lg:min-h-[470px] ring-1 ring-inset ring-black/5 dark:ring-white/5">
                  {profile.profilePhotoUrl ? (
                    <img
                      src={profile.profilePhotoUrl}
                      alt={`${profile.fullName} — ${profile.professionalTitle}`}
                      loading="eager"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-sm text-[#5B6B63] dark:text-[#8E9F96]">
                      <p className="font-medium">Profile Portrait Not Uploaded</p>
                      <p className="text-xs mt-1">
                        Upload your real photograph from Admin Panel → Profile.
                      </p>
                    </div>
                  )}
                </div>
                <div className="pt-3 px-1.5 flex items-center justify-between text-[11px] text-[#5B6B63] dark:text-[#8E9F96]">
                  <span className="font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                    {profile.brandName || 'Vexora Studio'}
                  </span>
                  <span>Owner: {profile.fullName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Studio Identity Strip */}
          <div className="mt-12 rounded-xl border border-[#DFD5C3] dark:border-[#1E2E26] bg-white/70 dark:bg-[#111C17]/80 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#DFD5C3] dark:divide-[#1E2E26]">
            <div className="p-4 sm:p-5 space-y-1">
              <p className="text-[11px] text-[#5B6B63] dark:text-[#8E9F96]">Studio Brand</p>
              <p className="font-display text-lg font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                {profile.brandName || 'Vexora Studio'}
              </p>
            </div>
            <div className="p-4 sm:p-5 space-y-1">
              <p className="text-[11px] text-[#5B6B63] dark:text-[#8E9F96]">Venture Founded</p>
              <p className="font-display text-lg font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                {profile.founderOf || "SAMIA'S CLOSET"}
              </p>
            </div>
            <div className="p-4 sm:p-5 space-y-1">
              <p className="text-[11px] text-[#5B6B63] dark:text-[#8E9F96]">Academic Track</p>
              <p className="font-display text-lg font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                HSC 2027 · Science
              </p>
            </div>
            <div className="p-4 sm:p-5 space-y-1">
              <p className="text-[11px] text-[#5B6B63] dark:text-[#8E9F96]">Base</p>
              <p className="font-display text-lg font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                Moulvibazar, BD
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Editorial Discipline Ribbon */}
      <div className="border-y border-[#DFD5C3] dark:border-[#1E2E26] bg-[#F2EFE7]/55 dark:bg-[#0E1814]">
        <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-2 font-display italic text-base sm:text-lg text-[#4A5A52] dark:text-[#A9B8B0]">
          <span>Website UI</span>
          <span aria-hidden="true" className="text-[#8D5B63] dark:text-[#DFACB4]">·</span>
          <span>Landing Pages</span>
          <span aria-hidden="true" className="text-[#8D5B63] dark:text-[#DFACB4]">·</span>
          <span>Brand Identity</span>
          <span aria-hidden="true" className="text-[#8D5B63] dark:text-[#DFACB4]">·</span>
          <span>Responsive Web Apps</span>
          <span aria-hidden="true" className="text-[#8D5B63] dark:text-[#DFACB4]">·</span>
          <span>E-Commerce Platforms</span>
        </div>
      </div>

      {/* Section 01: Editorial About Narrative */}
      <section className="bg-[#F2EFE7]/70 dark:bg-[#0E1814]">
        <div className="max-w-[1200px] mx-auto px-6 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-3">
            <p className="font-display italic text-xl text-[#8D5B63] dark:text-[#DFACB4]">
              01.
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] dark:text-[#F4F1EA] leading-tight">
              Developer &amp; Entrepreneur
            </h2>
            <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">
              Balaganj Government College · Rajnagar, Sylhet
            </p>
          </div>
          <div className="lg:col-span-8 space-y-5">
            <p className="text-[16px] leading-[1.8] text-[#3F4E47] dark:text-[#C5D1CB] max-w-[66ch]">
              {about.personalIntroduction}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="group inline-flex items-center gap-2 text-sm font-medium text-[#1B4332] dark:text-[#6EC4A7] border-b border-[#D8C7A8] dark:border-[#1E2E26] pb-0.5 hover:border-[#1B4332] dark:hover:border-[#6EC4A7] transition-colors cursor-pointer"
              >
                <span>Read Full Biography</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/assistant')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5B6B63] dark:text-[#A9B8B0] hover:text-[#1B4332] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open AI Concierge</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Featured Design Showcase (Dynamic Bento Grid) */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 sm:py-20 border-t border-[#DFD5C3] dark:border-[#1E2E26]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7]">
              02 · Visual Craft
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
              Featured Designs
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/gallery')}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open Design Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {featuredDesigns.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 border border-[#DFD5C3] dark:border-[#1E2E26] bg-white dark:bg-[#111C17] rounded-2xl p-8 sm:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7]">
                  Studio Design Archive
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                  Curated Website UI, Landing Pages &amp; Brand Graphics
                </h3>
                <p className="text-sm text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed max-w-lg">
                  Published designs uploaded through the studio Admin Console appear automatically in this spotlight and in the filterable Design Gallery.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/gallery')}
                  className="px-4 py-2.5 text-xs font-medium border border-[#DFD5C3] dark:border-[#1E2E26] rounded-md hover:border-[#1B4332] transition-colors cursor-pointer"
                >
                  Visit Design Gallery
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin/gallery')}
                    className="px-4 py-2.5 text-xs font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0A120F] rounded-md cursor-pointer"
                  >
                    Upload First Design
                  </button>
                )}
              </div>
            </div>
            <div className="lg:col-span-5 border border-[#DFD5C3] dark:border-[#1E2E26] bg-[#F2EFE7]/75 dark:bg-[#111C17] rounded-2xl p-8 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#8D5B63] dark:text-[#DFACB4]">
                  Archive Categories
                </p>
                <ul className="divide-y divide-[#DFD5C3] dark:divide-[#1E2E26] text-sm text-[#18221D] dark:text-[#F4F1EA]">
                  <li className="py-2.5 flex justify-between">
                    <span>Website UI &amp; Homepages</span>
                    <span className="font-mono-tabular text-xs text-[#5B6B63]">01</span>
                  </li>
                  <li className="py-2.5 flex justify-between">
                    <span>E-Commerce Storefronts</span>
                    <span className="font-mono-tabular text-xs text-[#5B6B63]">02</span>
                  </li>
                  <li className="py-2.5 flex justify-between">
                    <span>Dashboards &amp; App Interfaces</span>
                    <span className="font-mono-tabular text-xs text-[#5B6B63]">03</span>
                  </li>
                  <li className="py-2.5 flex justify-between">
                    <span>Brand &amp; Social Graphics</span>
                    <span className="font-mono-tabular text-xs text-[#5B6B63]">04</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline cursor-pointer self-start"
              >
                <span>Inspect Built Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : secondaryDesigns.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
            {leadDesign && (
              <button
                key={leadDesign.id}
                type="button"
                onClick={() => navigate('/gallery')}
                className="lg:col-span-7 group text-left border border-[#DFD5C3] dark:border-[#1E2E26] bg-white dark:bg-[#111C17] rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-[#1B4332]/45 dark:hover:border-[#52A58C]/50 hover:shadow-[0_20px_40px_-24px_rgba(27,67,50,0.22)] cursor-pointer"
              >
                <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#F2EFE7] dark:bg-[#16241D]">
                  <ResilientImage
                    src={leadDesign.imageUrl}
                    alt={leadDesign.altText || leadDesign.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-2 pt-4 pb-2 space-y-1.5">
                  <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                    {leadDesign.category} · <span className="font-mono-tabular">{leadDesign.creationDate}</span>
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-2xl font-semibold text-[#18221D] dark:text-[#F4F1EA]">
                      {leadDesign.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#5B6B63] dark:text-[#8E9F96] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  {leadDesign.description && (
                    <p className="text-xs text-[#4A5A52] dark:text-[#A9B8B0] line-clamp-2 leading-relaxed">
                      {leadDesign.description}
                    </p>
                  )}
                </div>
              </button>
            )}

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {secondaryDesigns.map((design) => (
                <button
                  key={design.id}
                  type="button"
                  onClick={() => navigate('/gallery')}
                  className="group text-left border border-[#DFD5C3] dark:border-[#1E2E26] bg-white dark:bg-[#111C17] rounded-2xl p-2.5 flex flex-col sm:flex-col lg:flex-row gap-4 items-stretch transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1B4332]/45 dark:hover:border-[#52A58C]/50 cursor-pointer"
                >
                  <div className="aspect-[4/3] lg:w-44 lg:aspect-square rounded-xl overflow-hidden bg-[#F2EFE7] dark:bg-[#16241D] shrink-0">
                    <ResilientImage
                      src={design.imageUrl}
                      alt={design.altText || design.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="px-1.5 py-1 flex flex-col justify-between gap-2 flex-1 min-w-0">
                    <div className="space-y-1">
                      <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                        {design.category} · <span className="font-mono-tabular">{design.creationDate}</span>
                      </p>
                      <h3 className="font-display text-xl font-semibold text-[#18221D] dark:text-[#F4F1EA] line-clamp-2">
                        {design.title}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1B4332] dark:text-[#6EC4A7]">
                      <span>Inspect Work</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredDesigns.map((design) => (
              <button
                key={design.id}
                type="button"
                onClick={() => navigate('/gallery')}
                className="group text-left border border-[#DFD5C3] dark:border-[#1E2E26] bg-white dark:bg-[#111C17] rounded-2xl p-2.5 transition-all duration-200 hover:-translate-y-1 hover:border-[#1B4332]/40 dark:hover:border-[#52A58C]/50 hover:shadow-[0_18px_36px_-22px_rgba(27,67,50,0.22)] cursor-pointer"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F2EFE7] dark:bg-[#16241D]">
                  <ResilientImage
                    src={design.imageUrl}
                    alt={design.altText || design.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-2.5 pt-3.5 pb-2 space-y-1">
                  <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                    {design.category} · <span className="font-mono-tabular">{design.creationDate}</span>
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-[#18221D] dark:text-[#F4F1EA] line-clamp-1">
                      {design.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#5B6B63] dark:text-[#8E9F96] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Section 03: Technical Craft Ledger + Experience Timeline */}
      <section className="border-t border-[#DFD5C3] dark:border-[#1E2E26] bg-[#F2EFE7]/60 dark:bg-[#0E1814]">
        <div className="max-w-[1200px] mx-auto px-6 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7]">
                  03 · Technical Stack
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                  Skills &amp; Technologies
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/skills')}
                className="text-xs font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                All Skills →
              </button>
            </div>
            <div className="divide-y divide-[#DFD5C3] dark:divide-[#1E2E26] border-y border-[#DFD5C3] dark:border-[#1E2E26]">
              {skills.slice(0, 6).map((skill) => (
                <div
                  key={skill.id}
                  className="py-3.5 flex items-baseline justify-between gap-4 transition-colors hover:bg-[#FAF8F3]/70 dark:hover:bg-[#111C17] px-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#18221D] dark:text-[#F4F1EA]">
                      {skill.name}
                    </p>
                    <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                      {skill.category}
                    </p>
                  </div>
                  {skill.proficiency && (
                    <span className="text-xs font-mono-tabular text-[#2D6A6A] dark:text-[#6EC4A7]">
                      {skill.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7]">
                  04 · Background
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                  Experience &amp; Education
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/experience')}
                className="text-xs font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Full Timeline →
              </button>
            </div>
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-[#D8C7A8] dark:before:bg-[#1E2E26]">
              {experience.slice(0, 3).map((item) => (
                <div key={item.id} className="relative space-y-1.5">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rotate-45 border border-[#1B4332] dark:border-[#6EC4A7] bg-[#FAF8F3] dark:bg-[#0E1814]"
                  />
                  <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96] font-mono-tabular">
                    {item.startDate} — {item.isCurrent ? 'Present' : item.endDate || 'Completed'}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                    {item.title} · {item.organization}
                  </h3>
                  <p className="text-sm text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 04 & 05: Freelance Services & Selected Projects */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 sm:py-20 space-y-16">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7]">
                05 · How I Can Help
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                Freelance Services
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>All Services</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topServices.map((svc, idx) => (
              <div
                key={svc.id}
                className="p-6 rounded-xl border border-[#DFD5C3] dark:border-[#1E2E26] bg-white dark:bg-[#111C17] hover:border-[#1B4332]/45 dark:hover:border-[#52A58C]/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between gap-5"
              >
                <div className="space-y-2.5">
                  <span className="font-display italic text-2xl text-[#8D5B63] dark:text-[#DFACB4] block">
                    0{idx + 1}.
                  </span>
                  <h3 className="text-base font-semibold text-[#18221D] dark:text-[#F4F1EA]">
                    {svc.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#4A5A52] dark:text-[#A9B8B0]">
                    {svc.description}
                  </p>
                </div>
                {svc.startingPrice && (
                  <p className="text-xs font-mono-tabular text-[#1B4332] dark:text-[#6EC4A7] pt-3 border-t border-[#F2EFE7] dark:border-[#1E2E26]">
                    From {svc.startingPrice}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Projects */}
        <div className="pt-14 border-t border-[#DFD5C3] dark:border-[#1E2E26]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7]">
                06 · Selected Work
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                Projects &amp; Ventures
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {selectedProjects.map((project, idx) => (
              <article
                key={project.id}
                className="group p-7 rounded-2xl border border-[#DFD5C3] dark:border-[#1E2E26] bg-white dark:bg-[#111C17] hover:border-[#1B4332]/45 dark:hover:border-[#52A58C]/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                    <span className="font-mono-tabular">0{idx + 1}</span>
                    <span>{project.status}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#F2EFE7] dark:border-[#1E2E26] space-y-3">
                  <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96] line-clamp-1">
                    {project.technologies.join(' · ')}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/projects')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline cursor-pointer"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Executive Studio Contact Banner */}
        <div className="rounded-2xl bg-[#163829] dark:bg-[#11221B] border border-[#1B4332] dark:border-[#1E2E26] text-[#FAF8F3] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-[0_24px_50px_-24px_rgba(27,67,50,0.45)]">
          <div className="space-y-2.5 max-w-xl">
            <p className="text-xs tracking-wide text-[#D8C7A8]">
              {profile.brandName || 'Vexora Studio'} · Available for Inquiries
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#FAF8F3]">
              Have a website or brand project in mind?
            </h2>
            <p className="text-sm text-[#D8E2DC] leading-relaxed">
              Reach out directly via the inquiry form, email ({settings.contactEmail}), or ask our AI assistant to scope your requirements first.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-[#D8C7A8] hover:bg-[#E4D6BD] text-[#163829] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Hire Me</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-[#FAF8F3]/35 text-[#FAF8F3] hover:bg-white/10 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Studio AI</span>
            </button>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-[#FAF8F3]/35 text-[#FAF8F3] hover:bg-white/10 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
