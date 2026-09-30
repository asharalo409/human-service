import { useEffect, useState } from 'react';
import {
  formatBanglaDate,
  formatBanglaMoney,
  formatBanglaNumber,
  getProjects,
  isSupabaseConfigured,
} from '../services/supabase';
import type { Project } from '../types';

function getStatusLabel(status: Project['status']): string {
  if (status === 'completed') {
    return 'সম্পন্ন';
  }

  if (status === 'paused') {
    return 'সাময়িক বন্ধ';
  }

  return 'চলমান';
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    async function loadProjects() {
      try {
        setLoading(true);
        setProjects(await getProjects());
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'প্রকল্প লোড করা যায়নি।',
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProjects();
  }, []);

  return (
    <section className="container section page-section">
      <div className="page-title">
        <p className="eyebrow">স্বচ্ছ মানবিক উদ্যোগ</p>
        <h1>আমাদের প্রকল্পসমূহ</h1>
        <p>
          চলমান, সম্পন্ন এবং ভবিষ্যৎ মানবসেবা কার্যক্রমের বিস্তারিত এখানে
          প্রকাশ করা হবে।
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="alert alert-warning">
          Supabase সংযুক্ত হলে প্রকল্পসমূহ এখানে দেখা যাবে।
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <strong>সমস্যা:</strong> {error}
        </div>
      )}

      {loading ? (
        <p className="status-text">প্রকল্প লোড হচ্ছে...</p>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h2>এখনও কোনো প্রকল্প যোগ করা হয়নি</h2>
          <p>
            Supabase Dashboard-এর Table Editor থেকে `projects` table-এ প্রথম
            প্রকল্প যোগ করুন।
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => {
            const target = Number(project.target_amount || 0);
            const raised = Number(project.raised_amount || 0);
            const progress =
              target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;

            return (
              <article className="project-card" key={project.id}>
                <div className="project-image">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title_bn} />
                  ) : (
                    <span>মানবসেবা</span>
                  )}
                </div>

                <div className="project-content">
                  <div className="project-topline">
                    <span className="category-pill">{project.category}</span>
                    <span className={`status-pill ${project.status}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  <h2>{project.title_bn}</h2>
                  <p>{project.description_bn}</p>

                  {project.location_bn && (
                    <p className="project-location">স্থান: {project.location_bn}</p>
                  )}

                  <div className="progress-label">
                    <span>সংগৃহীত: {formatBanglaMoney(raised)}</span>
                    <span>{formatBanglaNumber(progress)}%</span>
                  </div>

                  <div
                    className="progress-track"
                    aria-label={`অনুদান অগ্রগতি ${progress}%`}
                  >
                    <span
                      className="progress-value"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="project-footer">
                    <span>লক্ষ্য: {formatBanglaMoney(target)}</span>
                    <span>দাতা: {formatBanglaNumber(project.donor_count)}</span>
                  </div>

                  {project.start_date && (
                    <small>
                      শুরু: {formatBanglaDate(project.start_date)}
                    </small>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
