import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { updatePageSeo } from '../lib/seo';
import { SKILL_CATEGORIES } from '../types';

export function SkillsPage() {
  const { skills } = useApp();

  useEffect(() => {
    updatePageSeo({
      title: 'Skills & Technologies',
      description:
        'Confirmed frontend, backend, database, UI/UX design, AI workflow, and deployment skills of Md. Humaun Husen Rahi.',
    });
  }, []);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 sm:py-16 animate-editorial-enter">
      <div className="max-w-2xl space-y-2.5 mb-12">
        <p className="text-xs font-medium tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7]">
          Technical Capabilities
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Skills &amp; Technologies
        </h1>
        <p className="text-[15.5px] text-[#4A5A52] dark:text-[#C5D1CB] leading-relaxed">
          Core tools and disciplines used across client builds and personal ventures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {SKILL_CATEGORIES.map((category, idx) => {
          const items = skills.filter((s) => s.category === category);
          if (items.length === 0) return null;
          return (
            <section
              key={category}
              className="p-7 rounded-2xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] space-y-5 hover:border-[#1B4332]/40 dark:hover:border-[#52A58C]/45 transition-colors"
            >
              <div className="pb-3.5 border-b border-[#F2EFE7] dark:border-[#24352C] flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                  {category}
                </h2>
                <span className="font-display italic text-lg text-[#8D5B63] dark:text-[#DFACB4]">
                  0{idx + 1}
                </span>
              </div>
              <div className="divide-y divide-[#F2EFE7] dark:divide-[#24352C]">
                {items.map((skill) => (
                  <div key={skill.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-sm font-semibold text-[#18221D] dark:text-[#F4F1EA]">
                        {skill.name}
                      </h3>
                      {skill.proficiency && (
                        <span className="text-xs font-mono-tabular text-[#2D6A6A] dark:text-[#6EC4A7]">
                          {skill.proficiency}
                        </span>
                      )}
                    </div>
                    {skill.description && (
                      <p className="text-xs leading-relaxed text-[#4A5A52] dark:text-[#A9B8B0]">
                        {skill.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
