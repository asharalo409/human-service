import { useState } from 'react';
import { HomeOverview } from './components/HomeOverview';
import { Navbar } from './components/Navbar';
import { NoticesSection } from './components/NoticesSection';
import { ProjectsSection } from './components/ProjectsSection';
import type { AppTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  function renderActivePage() {
    if (activeTab === 'projects') {
      return <ProjectsSection />;
    }

    if (activeTab === 'notices') {
      return <NoticesSection />;
    }

    return <HomeOverview setActiveTab={setActiveTab} />;
  }

  return (
    <div className="app-shell">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">{renderActivePage()}</main>

      <footer className="site-footer">
        <div className="container footer-content">
          <p>© {new Date().getFullYear()} মানবসেবা ফাউন্ডেশন</p>
          <p>মানবতার কল্যাণে একসঙ্গে কাজ করি।</p>
        </div>
      </footer>
    </div>
  );
}
