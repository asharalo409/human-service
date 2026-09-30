export type AppTab = 'home' | 'projects' | 'notices';

export type ProjectStatus = 'ongoing' | 'completed' | 'paused';

export interface Project {
  id: string;
  title_bn: string;
  category: string;
  description_bn: string;
  target_amount: number;
  raised_amount: number;
  donor_count: number;
  status: ProjectStatus;
  location_bn: string | null;
  image_url: string | null;
  start_date: string | null;
  created_at: string;
}

export interface Notice {
  id: string;
  title_bn: string;
  category: string;
  content_bn: string;
  notice_date: string;
  is_urgent: boolean;
  created_at: string;
}

export interface FoundationSettings {
  id: 'main';
  name_bn: string;
  name_en: string;
  tagline_bn: string;
  hotline: string | null;
  logo_url: string | null;
  cover_photo_url: string | null;
  updated_at: string;
}
