import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { updatePageSeo } from '../lib/seo';
import { DESIGN_CATEGORIES, DesignCategory } from '../types';
import { ResilientImage } from '../components/ResilientImage';

const PAGE_SIZE = 9;

export function GalleryPage() {
  const { gallery, loadingContent, isAdmin, navigate } = useApp();
  const [category, setCategory] = useState<'All' | DesignCategory>('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  useEffect(() => {
    updatePageSeo({
      title: 'Design Gallery',
      description:
        'Public UI/UX design gallery showcasing website UI, homepages, landing pages, dashboards, app interfaces, and graphic design by Md. Humaun Husen Rahi.',
    });
  }, []);

  const publishedItems = useMemo(
    () => gallery.filter((item) => item.published),
    [gallery]
  );

  const filtered = useMemo(() => {
    if (category === 'All') return publishedItems;
    return publishedItems.filter((item) => item.category === category);
  }, [publishedItems, category]);

  const paginated = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const lightboxIndex = useMemo(
    () => (lightboxId ? filtered.findIndex((item) => item.id === lightboxId) : -1),
    [filtered, lightboxId]
  );
  const lightboxItem = lightboxIndex >= 0 ? filtered[lightboxIndex] : null;

  useEffect(() => {
    if (!lightboxItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxId(null);
      if (e.key === 'ArrowRight' && filtered.length > 1) {
        const next = filtered[(lightboxIndex + 1) % filtered.length];
        setLightboxId(next.id);
      }
      if (e.key === 'ArrowLeft' && filtered.length > 1) {
        const prev = filtered[(lightboxIndex - 1 + filtered.length) % filtered.length];
        setLightboxId(prev.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxItem, lightboxIndex, filtered]);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 sm:py-16 animate-editorial-enter">
      <div className="max-w-2xl space-y-2.5 mb-8">
        <p className="text-xs font-medium tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7]">
          Visual Portfolio
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Design Gallery
        </h1>
        <p className="text-[15.5px] text-[#4A5A52] dark:text-[#C5D1CB] leading-relaxed">
          Explore published Website UI, Homepage, Landing Page, Dashboard, App UI, and Graphic Design works uploaded directly to the portfolio archive.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="pb-6 mb-9 border-b border-[#DFD5C3] dark:border-[#24352C] flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Design categories"
          className="flex flex-wrap gap-1 p-1 bg-[#F2EFE7] dark:bg-[#141F1A] border border-[#DFD5C3]/70 dark:border-[#24352C] rounded-lg"
        >
          {(['All', ...DESIGN_CATEGORIES] as Array<'All' | DesignCategory>).map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              onClick={() => {
                setCategory(cat);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === cat
                  ? 'bg-white dark:bg-[#1E3128] text-[#1B4332] dark:text-[#F4F1EA] shadow-xs'
                  : 'text-[#4A5A52] dark:text-[#A9B8B0] hover:text-[#1B4332] dark:hover:text-[#F4F1EA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono-tabular text-[#5B6B63] dark:text-[#8E9F96]">
          {filtered.length} {filtered.length === 1 ? 'design' : 'designs'}
        </span>
      </div>

      {loadingContent ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 rounded-2xl border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7]/60 dark:bg-[#141F1A] animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] rounded-2xl p-12 text-center space-y-3.5">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
            {category === 'All'
              ? 'No published designs yet'
              : `No published designs in ${category}`}
          </h2>
          <p className="text-sm text-[#4A5A52] dark:text-[#A9B8B0] max-w-md mx-auto leading-relaxed">
            Only genuine designs uploaded and published via the Admin Panel appear here.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            {category !== 'All' && (
              <button
                type="button"
                onClick={() => setCategory('All')}
                className="px-4 py-2 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
              >
                Show All Categories
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin/gallery')}
                className="px-4 py-2 text-xs font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md cursor-pointer"
              >
                Upload Design in Admin
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {paginated.map((item) => (
              <article
                key={item.id}
                className="group border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] rounded-2xl p-2.5 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:border-[#1B4332]/45 dark:hover:border-[#52A58C]/50 hover:shadow-[0_18px_38px_-22px_rgba(27,67,50,0.22)]"
              >
                <button
                  type="button"
                  onClick={() => setLightboxId(item.id)}
                  className="relative aspect-[4/3] rounded-xl bg-[#F2EFE7] dark:bg-[#192620] overflow-hidden cursor-pointer"
                  aria-label={`View full size: ${item.title}`}
                >
                  <ResilientImage
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-3 right-3 p-2 rounded-md bg-black/65 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </button>

                <div className="px-3 pt-4 pb-2 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{item.creationDate}</span>
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-[#18221D] dark:text-[#F4F1EA]">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="text-xs leading-relaxed text-[#4A5A52] dark:text-[#A9B8B0] line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#F2EFE7] dark:border-[#24352C] flex items-center justify-between gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setLightboxId(item.id)}
                      className="font-medium text-[#1B4332] dark:text-[#6EC4A7] hover:underline cursor-pointer"
                    >
                      Inspect Full Size
                    </button>
                    {item.externalLink && (
                      <a
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#2D6A6A] dark:text-[#6EC4A7] hover:underline"
                      >
                        <span>Project Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 py-2.5 text-sm font-medium border border-[#1B4332] dark:border-[#52A58C] text-[#1B4332] dark:text-[#F4F1EA] rounded-md hover:bg-[#1B4332]/5 cursor-pointer"
              >
                Load More Designs
              </button>
            </div>
          )}
        </>
      )}

      {/* Fullscreen Lightbox Modal with Prev/Next Navigation */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxId(null)}
        >
          <div
            className="max-w-5xl w-full bg-[#FAF8F3] dark:bg-[#111B16] border border-[#DFD5C3] dark:border-[#24352C] rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#DFD5C3] dark:border-[#24352C] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">
                  {lightboxItem.category} · <span className="font-mono-tabular">{lightboxItem.creationDate}</span>
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
                  {lightboxItem.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {filtered.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxId(
                          filtered[(lightboxIndex - 1 + filtered.length) % filtered.length].id
                        )
                      }
                      aria-label="Previous design"
                      className="p-2 rounded-md border border-[#DFD5C3] dark:border-[#24352C] hover:bg-[#F2EFE7] dark:hover:bg-[#1A2A22] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxId(filtered[(lightboxIndex + 1) % filtered.length].id)
                      }
                      aria-label="Next design"
                      className="p-2 rounded-md border border-[#DFD5C3] dark:border-[#24352C] hover:bg-[#F2EFE7] dark:hover:bg-[#1A2A22] cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setLightboxId(null)}
                  aria-label="Close lightbox"
                  className="p-2 rounded-md border border-[#DFD5C3] dark:border-[#24352C] hover:bg-[#F2EFE7] dark:hover:bg-[#1A2A22] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#0D1411] flex items-center justify-center p-4">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.altText || lightboxItem.title}
                className="max-w-full max-h-[65vh] object-contain"
              />
            </div>

            <div className="px-6 py-4 border-t border-[#DFD5C3] dark:border-[#24352C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-[#4A5A52] dark:text-[#C5D1CB]">
                {lightboxItem.description}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={lightboxItem.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
                >
                  Open Original
                </a>
                {lightboxItem.externalLink && (
                  <a
                    href={lightboxItem.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md"
                  >
                    <span>Visit Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
