import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Checks if Supabase credentials are provided in .env.local
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Public Supabase client for reading data (subject to RLS)
export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-key"
)

// Server-side admin client that bypasses RLS policies
// Used in Server Actions for administrative updates
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseServiceKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)
