import { useEffect } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { updatePageSeo } from '../lib/seo';
import { ResilientImage } from '../components/ResilientImage';

export function ExperiencePage() {
  const { experience, achievements, settings } = useApp();

  useEffect(() => {
    updatePageSeo({
      title: 'Experience & Achievements',
      description:
        'Work experience, education timeline, achievements, and downloadable CV for Md. Humaun Husen Rahi.',
    });
  }, []);

  const expList = experience.filter((e) => e.kind === 'experience');
  const eduList = experience.filter((e) => e.kind === 'education');
  const publishedAchievements = achievements.filter((a) => a.published);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 sm:py-16 space-y-16 animate-editorial-enter">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div className="max-w-2xl space-y-2.5">
          <p className="text-xs font-medium tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7]">
            Timeline &amp; Credentials
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
            Experience &amp; Achievements
          </h1>
          <p className="text-[15.5px] text-[#4A5A52] dark:text-[#C5D1CB] leading-relaxed">
            Verified entrepreneurial ventures, freelance roles, education, and certificates.
          </p>
        </div>

        {settings.cvPublic && settings.cvUrl && (
          <a
            href={settings.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={settings.cvFileName || 'Rahi-CV.pdf'}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download CV / Resume</span>
          </a>
        )}
      </div>

      {/* Work Experience */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Experience
        </h2>
        <div className="border-t border-[#DFD5C3] dark:border-[#24352C] divide-y divide-[#DFD5C3] dark:divide-[#24352C]">
          {expList.map((item) => (
            <div
              key={item.id}
              className="py-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start"
            >
              <div className="md:col-span-3">
                <span className="text-xs font-mono-tabular text-[#2D6A6A] dark:text-[#6EC4A7]">
                  {item.startDate} — {item.isCurrent ? 'Present' : item.endDate || ''}
                </span>
              </div>
              <div className="md:col-span-9 space-y-1.5">
                <h3 className="font-display text-2xl font-semibold text-[#18221D] dark:text-[#F4F1EA]">
                  {item.title} · {item.organization}
                </h3>
                <p className="text-sm text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed max-w-[68ch]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-6 pt-4 border-t border-[#DFD5C3] dark:border-[#24352C]">
        <h2 className="font-display text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Education
        </h2>
        {eduList.length === 0 ? (
          <div className="p-7 rounded-2xl border border-[#DFD5C3] dark:border-[#24352C] bg-white/75 dark:bg-[#141F1A] text-sm text-[#5B6B63] dark:text-[#8E9F96]">
            No education entries added yet. Add academic records from Admin Panel → Experience &amp; Education.
          </div>
        ) : (
          <div className="border-t border-[#DFD5C3] dark:border-[#24352C] divide-y divide-[#DFD5C3] dark:divide-[#24352C]">
            {eduList.map((item) => (
              <div
                key={item.id}
                className="py-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start"
              >
                <div className="md:col-span-3">
                  <span className="text-xs font-mono-tabular text-[#2D6A6A] dark:text-[#6EC4A7]">
                    {item.startDate} — {item.isCurrent ? 'Present' : item.endDate || ''}
                  </span>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <h3 className="font-display text-2xl font-semibold text-[#18221D] dark:text-[#F4F1EA]">
                    {item.title} · {item.organization}
                  </h3>
                  <p className="text-sm text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed max-w-[68ch]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Achievements & Certificates */}
      <section className="space-y-6 pt-4 border-t border-[#DFD5C3] dark:border-[#24352C]">
        <h2 className="font-display text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Achievements &amp; Certificates
        </h2>
        {publishedAchievements.length === 0 ? (
          <div className="p-7 rounded-2xl border border-[#DFD5C3] dark:border-[#24352C] bg-white/75 dark:bg-[#141F1A] text-sm text-[#5B6B63] dark:text-[#8E9F96]">
            No certificates or achievements published yet. Upload verified certificates in Admin Panel → Achievements.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {publishedAchievements.map((ach) => (
              <article
                key={ach.id}
                className="border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] rounded-2xl p-2.5 flex flex-col"
              >
                {ach.imageUrl && (
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F2EFE7] dark:bg-[#192620]">
                    <ResilientImage
                      src={ach.imageUrl}
                      alt={ach.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                      {ach.issuer} · <span className="font-mono-tabular">{ach.issueDate}</span>
                    </p>
                    <h3 className="font-display text-xl font-semibold text-[#18221D] dark:text-[#F4F1EA]">
                      {ach.title}
                    </h3>
                    <p className="text-xs text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                  {ach.certificateUrl && (
                    <a
                      href={ach.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7] hover:underline pt-2"
                    >
                      <span>View Certificate</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
