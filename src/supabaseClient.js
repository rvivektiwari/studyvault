import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Unauthenticated client (for public reads only)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Factory: returns a Supabase client that injects the Clerk JWT
// Usage: const db = await getSupabase(getToken)
export async function getSupabase(getToken) {
  try {
    const token = await getToken({ template: 'supabase' })
    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    })
  } catch {
    // Fall back to the anonymous client if token fetch fails
    return supabase
  }
}
