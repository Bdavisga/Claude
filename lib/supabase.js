// ============================================================
// Supabase Client Configuration
// Browser and Server clients for CalGeo
// ============================================================

import { createClient } from '@supabase/supabase-js';

// Browser client - uses anon key (safe for client-side)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server client - uses service role key (server-side only)
// This bypasses Row Level Security - use carefully!
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
