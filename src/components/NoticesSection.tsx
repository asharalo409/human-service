import { useEffect, useState } from 'react';
import {
  formatBanglaDate,
  getNotices,
  isSupabaseConfigured,
} from '../services/supabase';
import type { Notice } from '../types';

export function NoticesSection() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    async function loadNotices() {
      try {
        setLoading(true);
        setNotices(await getNotices());
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'নোটিশ লোড করা যায়নি।',
        );
      } finally {
        setLoading(false);
      }
    }

    void loadNotices();
  }, []);

  return (
    <section className="container section page-section">
      <div className="page-title">
        <p className="eyebrow">আপডেট ও ঘোষণা</p>
        <h1>নোটিশ বোর্ড</h1>
        <p>সংগঠনের জরুরি বার্তা, সভা, রক্তদান, ত্রাণ ও অন্যান্য ঘোষণা।</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="alert alert-warning">
          Supabase সংযুক্ত হলে সব নোটিশ এখানে দেখা যাবে।
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <strong>সমস্যা:</strong> {error}
        </div>
      )}

      {loading ? (
        <p className="status-text">নোটিশ লোড হচ্ছে...</p>
      ) : notices.length === 0 ? (
        <div className="empty-state">
          <h2>এখনও কোনো নোটিশ নেই</h2>
          <p>
            Supabase Dashboard-এর `notices` table থেকে প্রথম নোটিশ প্রকাশ
            করুন।
          </p>
        </div>
      ) : (
        <div className="notices-list">
          {notices.map((notice) => (
            <article
              className={`notice-card ${notice.is_urgent ? 'urgent' : ''}`}
              key={notice.id}
            >
              <div className="notice-date">
                {formatBanglaDate(notice.notice_date)}
              </div>

              <div className="notice-body">
                <div className="notice-meta">
                  <span>{notice.category}</span>
                  {notice.is_urgent && <b>জরুরি ঘোষণা</b>}
                </div>

                <h2>{notice.title_bn}</h2>
                <p>{notice.content_bn}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
