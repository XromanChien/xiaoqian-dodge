import { createClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();
// Configuration is optional while the backend is being set up: keep the game playable.
let client = null;
if (url && key) {
  try {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  } catch {
    console.warn('Supabase 設定無效，請檢查 Project URL 與公開金鑰。');
  }
}
export const supabase = client;
export const leaderboardConfigured = Boolean(supabase);
