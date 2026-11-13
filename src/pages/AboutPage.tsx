import { useEffect } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { updatePageSeo } from '../lib/seo';

export function AboutPage() {
  const { profile, about, navigate } = useApp();

  useEffect(() => {
    updatePageSeo({
      title: `About ${profile.fullName}`,
      description: about.personalIntroduction.slice(0, 155),
    });
  }, [profile.fullName, about.personalIntroduction]);

  const sections = [
    { number: '01.', title: 'Personal Introduction', body: about.personalIntroduction },
    { number: '02.', title: 'My Journey', body: about.myJourney },
    { number: '03.', title: 'Web Development Background', body: about.webDevBackground },
    { number: '04.', title: 'Entrepreneurship', body: about.entrepreneurship },
    { number: '05.', title: 'Education', body: about.education },
    { number: '06.', title: 'Professional Goals', body: about.professionalGoals },
  ];

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 sm:py-16 space-y-16 animate-editorial-enter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-5">
          <div className="p-2.5 sm:p-3 rounded-2xl border border-[#D8C7A8] dark:border-[#24352C] bg-[#F2EFE7] dark:bg-[#141F1A] shadow-[0_24px_60px_-24px_rgba(27,67,50,0.2)]">
            <div className="rounded-xl overflow-hidden bg-[#E9E4D8] dark:bg-[#192620] aspect-[4/5]">
              {profile.profilePhotoUrl ? (
                <img
                  src={profile.profilePhotoUrl}
                  alt={profile.fullName}
                  loading="eager"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 text-sm text-[#5B6B63]">
                  Profile photo not yet uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <p className="text-xs font-medium tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7]">
            Biography
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
            {profile.fullName}
          </h1>
          <p className="text-base font-medium text-[#4A5A52] dark:text-[#C5D1CB]">
            {profile.professionalTitle}
            {profile.founderOf ? ` · Founder of ${profile.founderOf}` : ''}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#5B6B63] dark:text-[#8E9F96]">
            <MapPin className="w-3.5 h-3.5 text-[#2D6A6A] dark:text-[#6EC4A7]" />
            <span>{profile.location}</span>
          </div>
          <div className="pt-1 flex items-center gap-3">
            <span className="w-8 h-px bg-[#8D5B63] dark:bg-[#DFACB4]" aria-hidden="true" />
            <p className="font-display text-xl italic text-[#8D5B63] dark:text-[#DFACB4]">
              &ldquo;{profile.tagline}&rdquo;
            </p>
          </div>
          <p className="text-[15.5px] leading-[1.7] text-[#3F4E47] dark:text-[#C5D1CB] max-w-[60ch]">
            {profile.shortIntro}
          </p>
          <div className="pt-3 flex flex-wrap gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md transition-colors cursor-pointer"
            >
              <span>View My Designs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 text-sm font-medium border border-[#1B4332] dark:border-[#52A58C] hover:bg-[#1B4332]/5 rounded-md transition-colors cursor-pointer"
            >
              Hire Me
            </button>
          </div>
        </div>
      </div>

      {/* 6 Editable Biography Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-10 border-t border-[#DFD5C3] dark:border-[#24352C]">
        {sections.map((sec) => (
          <section
            key={sec.number}
            className="p-7 rounded-2xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] space-y-3 hover:border-[#1B4332]/40 dark:hover:border-[#52A58C]/45 transition-colors"
          >
            <span className="font-display italic text-2xl text-[#8D5B63] dark:text-[#DFACB4] block">
              {sec.number}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
              {sec.title}
            </h2>
            <p className="text-sm leading-[1.7] text-[#4A5A52] dark:text-[#A9B8B0] whitespace-pre-line">
              {sec.body}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
