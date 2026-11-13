import { useEffect } from 'react';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { updatePageSeo } from '../lib/seo';
import { ResilientImage } from '../components/ResilientImage';

export function ProjectsPage() {
  const { projects, navigate } = useApp();

  useEffect(() => {
    updatePageSeo({
      title: 'Project Portfolio',
      description:
        "Explore real web development and branding projects by Md. Humaun Husen Rahi, including SAMIA'S CLOSET, AI Studio Selling Website, and RAHI Portfolio.",
    });
  }, []);

  const visibleProjects = projects.filter((p) => p.published);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 sm:py-16 animate-editorial-enter">
      <div className="max-w-2xl space-y-2.5 mb-12">
        <p className="text-xs font-medium tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7]">
          Case Studies
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Project Portfolio
        </h1>
        <p className="text-[15.5px] text-[#4A5A52] dark:text-[#C5D1CB] leading-relaxed">
          Selected builds, ventures, and technical architectures with real problem-solution breakdowns.
        </p>
      </div>

      <div className="space-y-9">
        {visibleProjects.map((project, idx) => (
          <article
            key={project.id}
            className="border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] rounded-2xl p-6 sm:p-9 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#F2EFE7] dark:border-[#24352C]">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                  <span className="font-mono-tabular">0{idx + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.status}</span>
                  {project.featured && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#8D5B63] dark:text-[#DFACB4] font-medium">
                        Featured
                      </span>
                    </>
                  )}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                  {project.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>

            <p className="text-[15.5px] leading-[1.7] text-[#3F4E47] dark:text-[#C5D1CB] max-w-[75ch]">
              {project.description}
            </p>

            {/* Hairline-separated Problem & Solution (avoids nested cards-within-cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#F2EFE7] dark:border-[#24352C]">
              <div className="space-y-2">
                <h3 className="text-xs font-semibold tracking-wide text-[#8D5B63] dark:text-[#DFACB4]">
                  Problem
                </h3>
                <p className="text-sm text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed">
                  {project.problem}
                </p>
              </div>
              <div className="space-y-2 md:border-l md:border-[#F2EFE7] md:dark:border-[#24352C] md:pl-8">
                <h3 className="text-xs font-semibold tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7]">
                  Solution
                </h3>
                <p className="text-sm text-[#4A5A52] dark:text-[#A9B8B0] leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {project.screenshotUrls && project.screenshotUrls.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {project.screenshotUrls.map((url, idxShot) => (
                  <div
                    key={idxShot}
                    className="aspect-[16/10] rounded-xl overflow-hidden border border-[#DFD5C3] dark:border-[#24352C]"
                  >
                    <ResilientImage
                      src={url}
                      alt={`${project.title} screenshot ${idxShot + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="pt-5 border-t border-[#F2EFE7] dark:border-[#24352C] flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                Technologies: {project.technologies.join(' · ')}
              </p>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline cursor-pointer"
              >
                <span>Discuss a Similar Build</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
