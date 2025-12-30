// ============================================================
// Supabase Client Configuration
// Browser client for CalGeo (client-side safe)
// ============================================================

import { createClient } from '@supabase/supabase-js';

// Browser client - uses anon key (safe for client-side)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
