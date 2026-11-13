import { SiteSettings } from '../types';

export interface SocialLinkItem {
  key: keyof SiteSettings;
  label: string;
  url: string;
}

export const SOCIAL_PLATFORM_FIELDS: Array<{
  key: keyof SiteSettings;
  label: string;
  placeholder: string;
}> = [
  {
    key: 'facebookUrl',
    label: 'Facebook (e.g. Vexora Studio)',
    placeholder: 'https://facebook.com/...',
  },
  {
    key: 'instagramUrl',
    label: 'Instagram',
    placeholder: 'https://instagram.com/...',
  },
  {
    key: 'youtubeUrl',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@...',
  },
  {
    key: 'tiktokUrl',
    label: 'TikTok',
    placeholder: 'https://tiktok.com/@...',
  },
  {
    key: 'linkedinUrl',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/...',
  },
  {
    key: 'githubUrl',
    label: 'GitHub',
    placeholder: 'https://github.com/...',
  },
  {
    key: 'twitterUrl',
    label: 'X (Twitter)',
    placeholder: 'https://x.com/...',
  },
  {
    key: 'threadsUrl',
    label: 'Threads',
    placeholder: 'https://threads.net/@...',
  },
  {
    key: 'behanceUrl',
    label: 'Behance',
    placeholder: 'https://behance.net/...',
  },
  {
    key: 'dribbbleUrl',
    label: 'Dribbble',
    placeholder: 'https://dribbble.com/...',
  },
  {
    key: 'pinterestUrl',
    label: 'Pinterest',
    placeholder: 'https://pinterest.com/...',
  },
  {
    key: 'telegramUrl',
    label: 'Telegram',
    placeholder: 'https://t.me/...',
  },
];

export function getConnectedSocialLinks(settings: SiteSettings): SocialLinkItem[] {
  const results: SocialLinkItem[] = [];
  for (const field of SOCIAL_PLATFORM_FIELDS) {
    const raw = settings[field.key];
    if (typeof raw === 'string' && raw.trim().length > 0) {
      results.push({
        key: field.key,
        label: field.label.replace(/\s*\(.*?\)\s*/g, ''),
        url: raw.trim(),
      });
    }
  }
  return results;
}
