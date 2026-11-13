import React, { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Mail, MapPin, MessageCircle } from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useApp } from '../contexts/AppContext';
import { OperationType, db, handleFirestoreError } from '../lib/firebase';
import { updatePageSeo } from '../lib/seo';
import { getConnectedSocialLinks } from '../lib/social';
import { VALIDATION_LIMITS } from '../types';

const LAST_SUBMIT_KEY = 'rahi_last_msg_submit_ts';
const LAST_HASH_KEY = 'rahi_last_msg_hash';
const COOLDOWN_MS = 30_000;

export function ContactPage() {
  const { profile, settings, getWhatsappUrl, pushToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [projectType, setProjectType] = useState('Business Website');
  const [budgetRange, setBudgetRange] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    updatePageSeo({
      title: 'Contact & Hire Me',
      description:
        'Send a freelance project inquiry to Md. Humaun Husen Rahi via contact form, email, or WhatsApp.',
    });
  }, []);

  const whatsappUrl = getWhatsappUrl();
  const socialLinks = getConnectedSocialLinks(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanDesc = description.trim();

    if (cleanName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!VALIDATION_LIMITS.EMAIL_REGEX.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (cleanDesc.length < 10) {
      setErrorMsg('Please provide a brief project description (at least 10 characters).');
      return;
    }

    // Duplicate & rapid-submit abuse protection
    const now = Date.now();
    const lastTs = Number(sessionStorage.getItem(LAST_SUBMIT_KEY) || '0');
    const fingerprint = `${cleanEmail.toLowerCase()}::${cleanDesc.slice(0, 80)}`;
    const lastHash = sessionStorage.getItem(LAST_HASH_KEY);

    if (lastHash === fingerprint && now - lastTs < 10 * 60_000) {
      setErrorMsg('This message was already submitted. Thank you!');
      return;
    }
    if (now - lastTs < COOLDOWN_MS) {
      setErrorMsg('Please wait 30 seconds before sending another inquiry.');
      return;
    }

    setSubmitting(true);
    const msgId = `msg-${now}-${Math.random().toString(36).slice(2, 7)}`;

    try {
      await setDoc(doc(db, 'messages', msgId), {
        fullName: cleanName.slice(0, VALIDATION_LIMITS.NAME_MAX),
        email: cleanEmail.slice(0, 200),
        whatsapp: whatsapp.trim().slice(0, 40),
        projectType: projectType.trim().slice(0, 80),
        budgetRange: budgetRange.trim().slice(0, 60),
        description: cleanDesc.slice(0, VALIDATION_LIMITS.MESSAGE_DESC_MAX),
        status: 'unread',
        submittedAt: serverTimestamp(),
      });

      sessionStorage.setItem(LAST_SUBMIT_KEY, String(now));
      sessionStorage.setItem(LAST_HASH_KEY, fingerprint);
      setSubmitted(true);
      setFullName('');
      setEmail('');
      setWhatsapp('');
      setBudgetRange('');
      setDescription('');
      pushToast('success', 'Your message has been sent.');
    } catch (err) {
      setErrorMsg('Unable to submit message right now. Please try emailing directly.');
      handleFirestoreError(err, OperationType.CREATE, `messages/${msgId}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 sm:py-16 animate-editorial-enter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-wide text-[#2D6A6A] dark:text-[#6EC4A7]">
              Client Inquiries
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1B4332] dark:text-[#F4F1EA]">
              Let&apos;s Build Something Meaningful
            </h1>
            <p className="text-[15.5px] text-[#4A5A52] dark:text-[#C5D1CB] leading-relaxed">
              Share your website requirements, timeline, or design goals. Messages are saved privately and reviewed directly by {profile.fullName}.
            </p>
          </div>

          <div className="pt-6 border-t border-[#DFD5C3] dark:border-[#24352C] space-y-5 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#2D6A6A] dark:text-[#6EC4A7] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">Email</p>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="font-medium text-[#18221D] dark:text-[#F4F1EA] hover:underline break-all"
                >
                  {settings.contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#2D6A6A] dark:text-[#6EC4A7] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#5B6B63] dark:text-[#8E9F96]">Location</p>
                <p className="font-medium text-[#18221D] dark:text-[#F4F1EA]">
                  {profile.location}
                </p>
              </div>
            </div>

            {whatsappUrl && (
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] text-[#FAF8F3] dark:text-[#0D1411] rounded-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="pt-4 border-t border-[#DFD5C3] dark:border-[#24352C] space-y-2.5">
                <p className="text-xs font-medium text-[#5B6B63] dark:text-[#8E9F96]">
                  Connect on Social Media
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[#DFD5C3] dark:border-[#24352C] bg-white/70 dark:bg-[#141F1A] hover:border-[#1B4332] dark:hover:border-[#6EC4A7] text-[#18221D] dark:text-[#F4F1EA] transition-colors"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 border border-[#DFD5C3] dark:border-[#24352C] bg-white dark:bg-[#141F1A] rounded-2xl p-6 sm:p-9 shadow-[0_20px_50px_-30px_rgba(27,67,50,0.16)]">
          {submitted ? (
            <div className="py-10 space-y-4">
              <div className="flex items-center gap-3 text-[#1B4332] dark:text-[#6EC4A7]">
                <CheckCircle2 className="w-7 h-7" />
                <h2 className="font-display text-3xl font-semibold">
                  Message Received
                </h2>
              </div>
              <p className="text-sm text-[#4A5A52] dark:text-[#C5D1CB] leading-relaxed">
                Thank you for reaching out. Your inquiry has been saved securely and {profile.fullName} will reply via email or WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 text-xs font-medium border border-[#DFD5C3] dark:border-[#24352C] rounded-md cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div
                  role="alert"
                  className="p-3.5 text-xs font-medium text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md"
                >
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={VALIDATION_LIMITS.NAME_MAX}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6A6A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6A6A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium">WhatsApp (Optional)</label>
                  <input
                    type="tel"
                    maxLength={40}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+880..."
                    className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6A6A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium">Project Type *</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6A6A]"
                  >
                    <option value="Business Website" className="dark:bg-[#141F1A]">Business Website</option>
                    <option value="Personal Portfolio" className="dark:bg-[#141F1A]">Personal Portfolio</option>
                    <option value="E-commerce Website" className="dark:bg-[#141F1A]">E-commerce Website</option>
                    <option value="Landing Page" className="dark:bg-[#141F1A]">Landing Page</option>
                    <option value="Website Redesign" className="dark:bg-[#141F1A]">Website Redesign</option>
                    <option value="Custom Web Application" className="dark:bg-[#141F1A]">Custom Web Application</option>
                    <option value="UI/UX Design" className="dark:bg-[#141F1A]">UI/UX Design</option>
                    <option value="Other" className="dark:bg-[#141F1A]">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium">Budget Range (Optional)</label>
                  <input
                    type="text"
                    maxLength={60}
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6A6A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium">Project Description *</label>
                <textarea
                  required
                  rows={5}
                  minLength={10}
                  maxLength={VALIDATION_LIMITS.MESSAGE_DESC_MAX}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your business, goals, required pages, and preferred timeline..."
                  className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-[#DFD5C3] dark:border-[#24352C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6A6A]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-[#1B4332] hover:bg-[#143326] dark:bg-[#52A58C] dark:text-[#0D1411] text-[#FAF8F3] rounded-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Sending Message...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
