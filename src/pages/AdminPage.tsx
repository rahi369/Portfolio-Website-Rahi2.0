import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { PRIVATE_ADMIN_ENTRY } from '../lib/firebase';
import { updatePageSeo } from '../lib/seo';
import { AdminLayout } from './admin/AdminLayout';
import {
  AdminDashboardSection,
  AdminGallerySection,
  AdminProfileSection,
  AdminProjectsSection,
} from './admin/AdminCoreSections';
import {
  AdminAchievementsSection,
  AdminExperienceSection,
  AdminMessagesSection,
  AdminSeoSection,
  AdminServicesSection,
  AdminSettingsSection,
  AdminSkillsSection,
} from './admin/AdminManageSections';

const ADMIN_ROUTE_TITLES: Record<string, string> = {
  '/admin': 'Admin Console',
  '/admin/dashboard': 'Admin Overview',
  '/admin/profile': 'Edit Profile & About',
  '/admin/gallery': 'Manage Design Gallery',
  '/admin/projects': 'Manage Projects',
  '/admin/skills': 'Manage Skills',
  '/admin/experience': 'Manage Experience & Education',
  '/admin/services': 'Manage Services',
  '/admin/messages': 'Contact Inquiries',
  '/admin/achievements': 'Achievements & CV Upload',
  '/admin/seo': 'SEO Settings',
  '/admin/settings': 'Site Settings',
};

export function AdminPage() {
  const { route, navigate, isAdmin, authReady } = useApp();

  const normalizedRoute = route.replace(/\/+$/, '') || '/admin';

  useEffect(() => {
    const title = ADMIN_ROUTE_TITLES[normalizedRoute] || 'Console';
    updatePageSeo({
      title: `${title} — RAHI`,
      description: 'Protected portfolio administration workspace for Md. Humaun Husen Rahi.',
    });
  }, [normalizedRoute]);

  useEffect(() => {
    if (!authReady) return;
    if (
      isAdmin &&
      (normalizedRoute === '/admin' || normalizedRoute === PRIVATE_ADMIN_ENTRY)
    ) {
      navigate('/admin/dashboard');
    }
  }, [authReady, isAdmin, normalizedRoute, PRIVATE_ADMIN_ENTRY, navigate]);

  const renderSection = () => {
    switch (normalizedRoute) {
      case '/admin':
      case '/admin/dashboard':
      case PRIVATE_ADMIN_ENTRY:
        return <AdminDashboardSection />;
      case '/admin/profile':
        return <AdminProfileSection />;
      case '/admin/gallery':
        return <AdminGallerySection />;
      case '/admin/projects':
        return <AdminProjectsSection />;
      case '/admin/skills':
        return <AdminSkillsSection />;
      case '/admin/experience':
        return <AdminExperienceSection />;
      case '/admin/services':
        return <AdminServicesSection />;
      case '/admin/messages':
        return <AdminMessagesSection />;
      case '/admin/achievements':
        return <AdminAchievementsSection />;
      case '/admin/seo':
        return <AdminSeoSection />;
      case '/admin/settings':
        return <AdminSettingsSection />;
      default:
        return <AdminDashboardSection />;
    }
  };

  return <AdminLayout>{renderSection()}</AdminLayout>;
}
