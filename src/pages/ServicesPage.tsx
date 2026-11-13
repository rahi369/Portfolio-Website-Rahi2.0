import { useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { updatePageSeo } from '../lib/seo';
import { ResilientImage } from '../components/ResilientImage';

export function ServicesPage() {
  const { services, navigate } = useApp();

  useEffect(() => {
    updatePageSeo({
      title: 'Freelance Services',
      description:
        'Business websites, personal portfolios, e-commerce development, landing pages, redesigns, maintenance, and custom web applications by Md. Humaun Husen Rahi.',
    });
  }, []);

  const visibleServices = services.filter((s) => s.published);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 sm:py-16 animate-editorial-enter">
      <div className="max-w-2xl space-y-2.5 mb-12">
        <p className="text-xs font-medium tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7]">
          Services
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Freelance Services
        </h1>
        <p className="text-[15.5px] text-[#4A5A52] dark:text-[#C5D1CB] leading-relaxed">
          End-to-end web development and UI/UX design tailored to your business goals and timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {visibleServices.map((svc, idx) => (
          <section
            key={svc.id}
            className="border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#1B4332]/45 dark:hover:border-[#52A58C]/50 transition-all duration-200 hover:-translate-y-0.5"
          >
            {svc.imageUrl && (
              <div className="aspect-[16/9] bg-[#F2EFE7] dark:bg-[#192620]">
                <ResilientImage
                  src={svc.imageUrl}
                  alt={svc.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display italic text-2xl text-[#8D5B63] dark:text-[#DFACB4]">
                    0{idx + 1}.
                  </span>
                  {svc.startingPrice && (
                    <span className="font-mono-tabular text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7] whitespace-nowrap shrink-0">
                      From {svc.startingPrice}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                  {svc.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#4A5A52] dark:text-[#A9B8B0]">
                  {svc.description}
                </p>
                {svc.features && svc.features.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {svc.features.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-[#3F4E47] dark:text-[#C5D1CB]"
                      >
                        <Check className="w-3.5 h-3.5 text-[#2D6A6A] dark:text-[#6EC4A7] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-[#F2EFE7] dark:border-[#24352C]">
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline cursor-pointer"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
