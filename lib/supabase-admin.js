// ============================================================
// Supabase Admin Client Configuration
// Server-side ONLY - uses service role key
// NEVER import this in client components!
// ============================================================

import { createClient } from '@supabase/supabase-js';

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
