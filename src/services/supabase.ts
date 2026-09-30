import { createClient } from '@supabase/supabase-js';
import type { FoundationSettings, Notice, Project } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env
  .VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-supabase'),
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase সংযুক্ত নেই। .env file এবং Vercel Environment Variables পরীক্ষা করুন।',
    );
  }

  return supabase;
}

export async function getFoundationSettings(): Promise<FoundationSettings | null> {
  const client = requireSupabase();

  const { data, error } = await client
    .from('foundation_settings')
    .select('*')
    .eq('id', 'main')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as FoundationSettings | null;
}

export async function getProjects(): Promise<Project[]> {
  const client = requireSupabase();

  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Project[];
}

export async function getNotices(): Promise<Notice[]> {
  const client = requireSupabase();

  const { data, error } = await client
    .from('notices')
    .select('*')
    .order('is_urgent', { ascending: false })
    .order('notice_date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Notice[];
}

export function formatBanglaNumber(value: number): string {
  return new Intl.NumberFormat('bn-BD').format(value);
}

export function formatBanglaMoney(value: number): string {
  return `৳${new Intl.NumberFormat('bn-BD', {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatBanglaDate(dateValue: string): string {
  const date = new Date(`${dateValue}T00:00:00`);

  return new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
