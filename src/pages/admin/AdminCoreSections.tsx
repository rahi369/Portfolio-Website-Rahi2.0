import React, { useEffect, useState } from 'react';
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Database, Eye, EyeOff, Plus, Trash2, Upload } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { OperationType, db, handleFirestoreError } from '../../lib/firebase';
import { uploadAssetFile } from '../../lib/upload';
import {
  DESIGN_CATEGORIES,
  DesignCategory,
  DesignItem,
  ProjectItem,
} from '../../types';
import { ConfirmDialog } from './AdminLayout';

export function AdminDashboardSection() {
  const {
    gallery,
    projects,
    messages,
    skills,
    services,
    hasSeededFirestore,
    seedInitialPortfolioToFirestore,
    navigate,
  } = useApp();

  const publishedDesigns = gallery.filter((d) => d.published).length;
  const unreadMessages = messages.filter((m) => m.status === 'unread').length;
  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96] mt-1">
            Live portfolio counts, unread inquiries, and quick management actions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void seedInitialPortfolioToFirestore()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md cursor-pointer shrink-0"
        >
          <Database className="w-3.5 h-3.5" />
          <span>
            {hasSeededFirestore
              ? 'Re-Sync Defaults to Firestore'
              : 'Initialize Firestore Content'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A]">
          <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">Published Designs</p>
          <p className="font-mono-tabular text-3xl font-semibold mt-2">
            {publishedDesigns}
          </p>
        </div>
        <div className="p-5 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A]">
          <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">Projects</p>
          <p className="font-mono-tabular text-3xl font-semibold mt-2">
            {projects.length}
          </p>
        </div>
        <div className="p-5 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A]">
          <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">Unread Messages</p>
          <p className="font-mono-tabular text-3xl font-semibold mt-2">
            {unreadMessages}
          </p>
        </div>
        <div className="p-5 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A]">
          <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">Skills &amp; Services</p>
          <p className="font-mono-tabular text-3xl font-semibold mt-2">
            {skills.length} / {services.length}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] space-y-4">
        <h2 className="font-display text-2xl font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="px-4 py-2 text-xs font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md cursor-pointer"
          >
            Upload Design Image
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-4 py-2 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
          >
            Add / Edit Project
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/profile')}
            className="px-4 py-2 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
          >
            Edit Profile &amp; Bio
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/messages')}
            className="px-4 py-2 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
          >
            Review Inquiries
          </button>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="p-6 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Recent Messages</h2>
          <button
            type="button"
            onClick={() => navigate('/admin/messages')}
            className="text-xs font-medium text-[#2D6A6A] dark:text-[#6EC4A7] hover:underline cursor-pointer"
          >
            Open Inbox
          </button>
        </div>
        {recentMessages.length === 0 ? (
          <p className="text-sm text-[#5B6B63] dark:text-[#8E9F96]">
            No visitor messages received yet.
          </p>
        ) : (
          <div className="divide-y divide-[#F2EFE7] dark:divide-[#24352C]">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {msg.fullName} · {msg.projectType}
                  </p>
                  <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96] truncate">
                    {msg.description}
                  </p>
                </div>
                <span className="text-xs capitalize font-medium text-[#2D6A6A] dark:text-[#6EC4A7] shrink-0">
                  {msg.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminProfileSection() {
  const { profile, about, settings, pushToast } = useApp();

  const [fullName, setFullName] = useState(profile.fullName);
  const [brandName, setBrandName] = useState(profile.brandName);
  const [professionalTitle, setProfessionalTitle] = useState(profile.professionalTitle);
  const [founderOf, setFounderOf] = useState(profile.founderOf || '');
  const [location, setLocation] = useState(profile.location);
  const [tagline, setTagline] = useState(profile.tagline);
  const [shortIntro, setShortIntro] = useState(profile.shortIntro);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(profile.profilePhotoUrl);

  const [personalIntroduction, setPersonalIntroduction] = useState(about.personalIntroduction);
  const [myJourney, setMyJourney] = useState(about.myJourney);
  const [webDevBackground, setWebDevBackground] = useState(about.webDevBackground);
  const [entrepreneurship, setEntrepreneurship] = useState(about.entrepreneurship);
  const [education, setEducation] = useState(about.education);
  const [professionalGoals, setProfessionalGoals] = useState(about.professionalGoals);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile.fullName);
    setBrandName(profile.brandName);
    setProfessionalTitle(profile.professionalTitle);
    setFounderOf(profile.founderOf || '');
    setLocation(profile.location);
    setTagline(profile.tagline);
    setShortIntro(profile.shortIntro);
    setProfilePhotoUrl(profile.profilePhotoUrl);
  }, [profile]);

  useEffect(() => {
    setPersonalIntroduction(about.personalIntroduction);
    setMyJourney(about.myJourney);
    setWebDevBackground(about.webDevBackground);
    setEntrepreneurship(about.entrepreneurship);
    setEducation(about.education);
    setProfessionalGoals(about.professionalGoals);
  }, [about]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const res = await uploadAssetFile(file, {
        cloudName: settings.cloudinaryCloudName,
        uploadPreset: settings.cloudinaryUploadPreset,
      });
      setProfilePhotoUrl(res.url);
      pushToast('success', 'Profile photo uploaded. Click Save Profile to publish.');
    } catch (err) {
      pushToast('error', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      input.value = '';
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_profile', 'main'), {
        fullName: fullName.trim(),
        brandName: brandName.trim(),
        professionalTitle: professionalTitle.trim(),
        founderOf: founderOf.trim(),
        location: location.trim(),
        tagline: tagline.trim(),
        shortIntro: shortIntro.trim(),
        profilePhotoUrl: profilePhotoUrl.trim(),
        updatedAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'site_about', 'main'), {
        personalIntroduction: personalIntroduction.trim(),
        myJourney: myJourney.trim(),
        webDevBackground: webDevBackground.trim(),
        entrepreneurship: entrepreneurship.trim(),
        education: education.trim(),
        professionalGoals: professionalGoals.trim(),
        updatedAt: serverTimestamp(),
      });
      pushToast('success', 'Profile & biography saved to Firestore.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'site_profile/main');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Profile &amp; Biography Management
        </h1>
        <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96] mt-1">
          Changes update the Home Hero and About Me page dynamically.
        </p>
      </div>

      <div className="p-6 sm:p-7 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] space-y-5">
        <h2 className="font-display text-2xl font-semibold">Identity &amp; Hero Portrait</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-24 h-28 rounded-lg overflow-hidden border border-[#DFD5C3] dark:border-[#24352C] bg-[#F2EFE7] shrink-0">
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt={fullName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#5B6B63]">
                No photo
              </div>
            )}
          </div>
          <div className="space-y-2 flex-1">
            <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#1B4332] dark:border-[#52A58C] rounded-md cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingPhoto ? 'Uploading...' : 'Upload Profile Photo'}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <input
              type="text"
              value={profilePhotoUrl}
              onChange={(e) => setProfilePhotoUrl(e.target.value)}
              placeholder="Or paste photo URL / path"
              className="w-full px-3 py-2 text-xs bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Brand Wordmark</label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Professional Title</label>
            <input
              type="text"
              required
              value={professionalTitle}
              onChange={(e) => setProfessionalTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Founder Of</label>
            <input
              type="text"
              value={founderOf}
              onChange={(e) => setFounderOf(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Brand Tagline</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium">Hero Short Introduction</label>
          <textarea
            rows={3}
            required
            value={shortIntro}
            onChange={(e) => setShortIntro(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
          />
        </div>
      </div>

      <div className="p-6 sm:p-7 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] space-y-4">
        <h2 className="font-display text-2xl font-semibold">About Me Page Sections</h2>
        {(
          [
            ['Personal Introduction', personalIntroduction, setPersonalIntroduction],
            ['My Journey', myJourney, setMyJourney],
            ['Web Development Background', webDevBackground, setWebDevBackground],
            ['Entrepreneurship', entrepreneurship, setEntrepreneurship],
            ['Education', education, setEducation],
            ['Professional Goals', professionalGoals, setProfessionalGoals],
          ] as Array<[string, string, (val: string) => void]>
        ).map(([label, val, setter]) => (
          <div key={label} className="space-y-1.5">
            <label className="block text-xs font-medium">{label}</label>
            <textarea
              rows={3}
              value={val}
              onChange={(e) => setter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 text-sm font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md cursor-pointer"
      >
        {saving ? 'Saving...' : 'Save Profile & About'}
      </button>
    </form>
  );
}

export function AdminGallerySection() {
  const { gallery, settings, pushToast } = useApp();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DesignCategory>('Website UI');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [creationDate, setCreationDate] = useState(new Date().toISOString().slice(0, 10));
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DesignItem | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('Website UI');
    setImageUrl('');
    setAltText('');
    setExternalLink('');
    setCreationDate(new Date().toISOString().slice(0, 10));
    setPublished(true);
    setFeatured(false);
  };

  const handleEditSelect = (item: DesignItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setAltText(item.altText);
    setExternalLink(item.externalLink || '');
    setCreationDate(item.creationDate);
    setPublished(item.published);
    setFeatured(item.featured);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAssetFile(file, {
        cloudName: settings.cloudinaryCloudName,
        uploadPreset: settings.cloudinaryUploadPreset,
      });
      setImageUrl(res.url);
      if (!altText) setAltText(title || file.name);
      pushToast('success', 'Design image uploaded.');
    } catch (err) {
      pushToast('error', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      input.value = '';
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      pushToast('error', 'Please upload an image or provide an image URL.');
      return;
    }
    setSaving(true);
    const id = editingId || `design-${Date.now()}`;
    try {
      if (editingId) {
        await updateDoc(doc(db, 'gallery', editingId), {
          title: title.trim(),
          description: description.trim(),
          category,
          imageUrl: imageUrl.trim(),
          altText: (altText || title).trim(),
          externalLink: externalLink.trim(),
          creationDate: creationDate.trim(),
          published,
          featured,
          updatedAt: serverTimestamp(),
        });
        pushToast('success', 'Design updated.');
      } else {
        await setDoc(doc(db, 'gallery', id), {
          title: title.trim(),
          description: description.trim(),
          category,
          imageUrl: imageUrl.trim(),
          altText: (altText || title).trim(),
          externalLink: externalLink.trim(),
          creationDate: creationDate.trim(),
          published,
          featured,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        pushToast('success', 'Design added to gallery.');
      }
      resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `gallery/${id}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item: DesignItem) => {
    try {
      await updateDoc(doc(db, 'gallery', item.id), {
        published: !item.published,
        updatedAt: serverTimestamp(),
      });
      pushToast('info', item.published ? 'Design unpublished.' : 'Design published.');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `gallery/${item.id}`);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, 'gallery', deleteTarget.id));
      pushToast('info', 'Design deleted.');
      if (editingId === deleteTarget.id) resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${deleteTarget.id}`);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Design Gallery Management
        </h1>
        <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96] mt-1">
          Only published designs are visible on the public Design Gallery page.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="p-6 sm:p-7 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">
            {editingId ? 'Edit Design' : 'Upload New Design'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Design Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DesignCategory)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            >
              {DESIGN_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-[#141F1A]">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium">Design Image *</label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#1B4332] dark:border-[#52A58C] rounded-md cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Choose Image File'}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste hosted image URL"
              className="flex-1 min-w-[200px] px-3 py-2 text-xs bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="h-32 rounded-md border border-[#DFD5C3] dark:border-[#24352C] object-cover"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">SEO Alt Text</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Accessible image description"
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Creation Date</label>
            <input
              type="date"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">External Link (Optional)</label>
            <input
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-[#1B4332]"
            />
            <span>Published Publicly</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-[#1B4332]"
            />
            <span>Featured on Home</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{saving ? 'Saving...' : editingId ? 'Update Design' : 'Save Design'}</span>
        </button>
      </form>

      {/* Existing Gallery Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] rounded-xl overflow-hidden flex flex-col"
          >
            <div className="aspect-[16/9] bg-[#F2EFE7] dark:bg-[#192620]">
              <img
                src={item.imageUrl}
                alt={item.altText || item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-[#5B6B63]">
                  {item.category} · {item.creationDate} ·{' '}
                  {item.published ? 'Published' : 'Unpublished'}
                </p>
                <h3 className="text-base font-semibold mt-0.5">{item.title}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F2EFE7] dark:border-[#24352C]">
                <button
                  type="button"
                  onClick={() => handleEditSelect(item)}
                  className="px-3 py-1.5 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleTogglePublish(item)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
                >
                  {item.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{item.published ? 'Unpublish' : 'Publish'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="ml-auto p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer"
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Design"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export function AdminProjectsSection() {
  const { projects, settings, pushToast } = useApp();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [techText, setTechText] = useState('React, TypeScript, Tailwind CSS, Firebase');
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [status, setStatus] = useState('In Production');
  const [featured, setFeatured] = useState(true);
  const [published, setPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setProblem('');
    setSolution('');
    setTechText('React, Tailwind CSS, Firebase');
    setScreenshotUrls([]);
    setLiveDemoUrl('');
    setGithubUrl('');
    setStatus('Active');
    setFeatured(false);
    setPublished(true);
  };

  const selectForEdit = (proj: ProjectItem) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setProblem(proj.problem);
    setSolution(proj.solution);
    setTechText(proj.technologies.join(', '));
    setScreenshotUrls(proj.screenshotUrls || []);
    setLiveDemoUrl(proj.liveDemoUrl || '');
    setGithubUrl(proj.githubUrl || '');
    setStatus(proj.status);
    setFeatured(proj.featured);
    setPublished(proj.published);
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAssetFile(file, {
        cloudName: settings.cloudinaryCloudName,
        uploadPreset: settings.cloudinaryUploadPreset,
      });
      setScreenshotUrls((prev) => [...prev, res.url].slice(0, 6));
      pushToast('success', 'Screenshot attached.');
    } catch (err) {
      pushToast('error', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      input.value = '';
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || `proj-${Date.now()}`;
    const technologies = techText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 16);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      problem: problem.trim(),
      solution: solution.trim(),
      technologies,
      screenshotUrls,
      liveDemoUrl: liveDemoUrl.trim(),
      githubUrl: githubUrl.trim(),
      status: status.trim(),
      featured,
      published,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), payload);
        pushToast('success', 'Project updated.');
      } else {
        await setDoc(doc(db, 'projects', id), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        pushToast('success', 'Project saved.');
      }
      resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `projects/${id}`);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, 'projects', deleteTarget.id));
      pushToast('info', 'Project deleted.');
      if (editingId === deleteTarget.id) resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${deleteTarget.id}`);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
          Projects Management
        </h1>
        <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96] mt-1">
          Manage case studies, screenshots, tech stacks, and verified links.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="p-6 sm:p-7 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">
            {editingId ? 'Edit Project' : 'Add Project'}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs underline cursor-pointer">
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
          />
          <input
            type="text"
            required
            placeholder="Project Status (e.g. In Production)"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
          />
        </div>

        <textarea
          rows={2}
          required
          placeholder="Short project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <textarea
            rows={2}
            placeholder="Problem addressed"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
          />
          <textarea
            rows={2}
            placeholder="Solution implemented"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className="px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
          />
        </div>

        <input
          type="text"
          placeholder="Technologies (comma-separated)"
          value={techText}
          onChange={(e) => setTechText(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="url"
            placeholder="Live Demo URL (optional)"
            value={liveDemoUrl}
            onChange={(e) => setLiveDemoUrl(e.target.value)}
            className="px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
          />
          <input
            type="url"
            placeholder="GitHub URL (optional)"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="px-3 py-2 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#1B4332] dark:border-[#52A58C] rounded-md cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Uploading...' : 'Attach Project Screenshot'}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleScreenshotUpload}
              className="hidden"
            />
          </label>
          {screenshotUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {screenshotUrls.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Screenshot ${idx + 1}`}
                    className="h-20 w-32 object-cover rounded border border-[#DFD5C3]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setScreenshotUrls((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-xs cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-[#1B4332]"
            />
            <span>Published</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-[#1B4332]"
            />
            <span>Featured on Home</span>
          </label>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium bg-[#1B4332] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md cursor-pointer"
        >
          {editingId ? 'Update Project' : 'Save Project'}
        </button>
      </form>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-xl border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <p className="text-xs text-[#5B6B63]">
                {proj.status} · {proj.published ? 'Published' : 'Draft'}
              </p>
              <h3 className="text-base font-semibold">{proj.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => selectForEdit(proj)}
                className="px-3 py-1.5 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(proj)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer"
                aria-label={`Delete ${proj.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Project"
        message={`Delete "${deleteTarget?.title}" permanently?`}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
