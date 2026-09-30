import type { AppTab } from '../types';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const navItems: Array<{ id: AppTab; label: string }> = [
  { id: 'home', label: 'হোম' },
  { id: 'projects', label: 'প্রকল্পসমূহ' },
  { id: 'notices', label: 'নোটিশ বোর্ড' },
];

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <header className="site-header">
      <div className="container header-content">
        <button
          className="brand"
          type="button"
          onClick={() => setActiveTab('home')}
          aria-label="হোম পেজে যান"
        >
          <span className="brand-mark" aria-hidden="true">
            ম
          </span>

          <span className="brand-text">
            <strong>মানবসেবা ফাউন্ডেশন</strong>
            <small>Manobseba Foundation</small>
          </span>
        </button>

        <nav className="main-navigation" aria-label="মূল নেভিগেশন">
          {navItems.map((item) => (
            <button
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
