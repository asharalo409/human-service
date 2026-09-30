import { useEffect, useState } from 'react';
import {
  formatBanglaNumber,
  getFoundationSettings,
  getNotices,
  getProjects,
  isSupabaseConfigured,
} from '../services/supabase';
import type { AppTab, FoundationSettings, Notice, Project } from '../types';

interface HomeOverviewProps {
  setActiveTab: (tab: AppTab) => void;
}

export function HomeOverview({ setActiveTab }: HomeOverviewProps) {
  const [settings, setSettings] = useState<FoundationSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    async function loadHomeData() {
      try {
        setLoading(true);

        const [settingsData, projectsData, noticesData] = await Promise.all([
          getFoundationSettings(),
          getProjects(),
          getNotices(),
        ]);

        setSettings(settingsData);
        setProjects(projectsData);
        setNotices(noticesData);
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : 'তথ্য লোড করা যায়নি।';

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadHomeData();
  }, []);

  const totalRaised = projects.reduce(
    (total, project) => total + Number(project.raised_amount || 0),
    0,
  );

  const totalDonors = projects.reduce(
    (total, project) => total + Number(project.donor_count || 0),
    0,
  );

  const foundationName = settings?.name_bn ?? 'মানবসেবা ফাউন্ডেশন';
  const tagline =
    settings?.tagline_bn ??
    'মানবতার কল্যাণে নিবেদিত একটি স্বচ্ছ ও স্বেচ্ছাসেবী সংস্থা।';

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">স্বেচ্ছাসেবা • স্বচ্ছতা • মানবতা</p>
            <h1>{foundationName}</h1>
            <p className="hero-text">{tagline}</p>

            <div className="hero-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => setActiveTab('projects')}
              >
                চলমান প্রকল্প দেখুন
              </button>

              <button
                className="button button-secondary"
                type="button"
                onClick={() => setActiveTab('notices')}
              >
                নোটিশ বোর্ড
              </button>
            </div>
          </div>

          <aside className="hero-card">
            <span className="hero-card-icon">♥</span>
            <h2>একটি ছোট সহায়তাও মূল্যবান</h2>
            <p>
              দরিদ্র সহায়তা, শিক্ষা, চিকিৎসা, রক্তদান ও জরুরি মানবিক কাজের
              জন্য আমরা একসঙ্গে কাজ করি।
            </p>
          </aside>
        </div>
      </section>

      <section className="container section">
        {!isSupabaseConfigured && (
          <div className="alert alert-warning">
            <strong>Supabase এখনও সংযুক্ত হয়নি।</strong>
            <br />
            `.env` file-এ `VITE_SUPABASE_URL` এবং
            `VITE_SUPABASE_ANON_KEY` বসান। Vercel-এ deploy করার সময় একই
            দুইটি value Environment Variables-এ দিতে হবে।
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <strong>তথ্য লোড করা যায়নি:</strong> {error}
          </div>
        )}

        <div className="stats-grid">
          <article className="stat-card">
            <span>চলমান প্রকল্প</span>
            <strong>{loading ? '...' : formatBanglaNumber(projects.length)}</strong>
          </article>

          <article className="stat-card">
            <span>মোট উপকারভোগী দাতা</span>
            <strong>{loading ? '...' : formatBanglaNumber(totalDonors)}</strong>
          </article>

          <article className="stat-card">
            <span>সংগৃহীত অনুদান</span>
            <strong>{loading ? '...' : `৳${formatBanglaNumber(totalRaised)}`}</strong>
          </article>

          <article className="stat-card">
            <span>জরুরি নোটিশ</span>
            <strong>
              {loading
                ? '...'
                : formatBanglaNumber(
                    notices.filter((notice) => notice.is_urgent).length,
                  )}
            </strong>
          </article>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">আমাদের কাজ</p>
            <h2>মানবসেবার প্রধান ক্ষেত্র</h2>
          </div>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-icon">⌂</span>
            <h3>দরিদ্র সহায়তা</h3>
            <p>অসহায় পরিবারকে খাদ্য, পোশাক ও প্রয়োজনীয় সহায়তা প্রদান।</p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">✚</span>
            <h3>চিকিৎসা সহায়তা</h3>
            <p>জরুরি চিকিৎসা, ওষুধ এবং রক্তদাতা খুঁজে দিতে সহায়তা।</p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">◉</span>
            <h3>শিক্ষা সহায়তা</h3>
            <p>শিক্ষাসামগ্রী, বৃত্তি ও শিক্ষার্থীদের পাশে দাঁড়ানো।</p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">♧</span>
            <h3>দুর্যোগ ত্রাণ</h3>
            <p>বন্যা, শীত ও অন্যান্য দুর্যোগে ত্রাণ কার্যক্রম পরিচালনা।</p>
          </article>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">সর্বশেষ তথ্য</p>
            <h2>সাম্প্রতিক নোটিশ</h2>
          </div>

          <button
            className="text-button"
            type="button"
            onClick={() => setActiveTab('notices')}
          >
            সব নোটিশ দেখুন →
          </button>
        </div>

        {loading ? (
          <p className="status-text">তথ্য লোড হচ্ছে...</p>
        ) : notices.length === 0 ? (
          <div className="empty-state">
            <p>এখনও কোনো নোটিশ প্রকাশ করা হয়নি।</p>
          </div>
        ) : (
          <div className="notice-preview-grid">
            {notices.slice(0, 3).map((notice) => (
              <article className="notice-preview-card" key={notice.id}>
                <div className="notice-meta">
                  <span>{notice.category}</span>
                  {notice.is_urgent && <b>জরুরি</b>}
                </div>
                <h3>{notice.title_bn}</h3>
                <p>{notice.content_bn}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
