import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Strict singleton — anon client for public reads
// Disable auth persistence since we use Clerk for auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})

// Single auth client — created ONCE globally, never duplicated
let _authClient = null
let _currentToken = null

/**
 * Returns the single auth client with updated JWT header.
 * Prevents GoTrueClient duplication by reusing one instance.
 */
export function getAuthClient(token) {
  if (!token) return supabase
  
  if (!_authClient) {
    _authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    _currentToken = token
  } else if (token !== _currentToken) {
    _currentToken = token
  }
  
  return _authClient
}
