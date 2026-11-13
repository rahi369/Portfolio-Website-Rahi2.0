export function updatePageSeo(params: {
  title: string;
  description: string;
  imageUrl?: string;
  jsonLd?: Record<string, unknown>;
}) {
  const fullTitle = params.title.includes('RAHI')
    ? params.title
    : `${params.title} — RAHI | Md. Humaun Husen Rahi`;
  document.title = fullTitle;

  const setMeta = (selector: string, content: string) => {
    const el = document.querySelector<HTMLMetaElement>(selector);
    if (el && content) {
      el.content = content;
    }
  };

  setMeta('meta[name="description"]', params.description);
  setMeta('meta[property="og:title"]', fullTitle);
  setMeta('meta[property="og:description"]', params.description);
  setMeta('meta[name="twitter:title"]', fullTitle);
  setMeta('meta[name="twitter:description"]', params.description);
  if (params.imageUrl) {
    setMeta('meta[property="og:image"]', params.imageUrl);
  }

  const existingDynamic = document.getElementById('dynamic-json-ld');
  if (existingDynamic) {
    existingDynamic.remove();
  }
  if (params.jsonLd) {
    const script = document.createElement('script');
    script.id = 'dynamic-json-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(params.jsonLd);
    document.head.appendChild(script);
  }
}
