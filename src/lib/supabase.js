import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Module-level variable to hold the latest token getter function
let getTokenRef = null;

// Export a setter so our React tree can provide the Clerk getToken function
export const setTokenGetter = (getter) => {
  getTokenRef = getter;
};

// Custom fetch wrapper to dynamically inject the token
const customFetch = async (url, options) => {
  // Safely instantiate a Headers object from existing options
  const headers = new Headers(options?.headers);

  // 1. ALWAYS require the Supabase Anon Key so the project is identified
  headers.set('apikey', supabaseAnonKey);

  // 2. Fetch fresh token from Clerk if getter is available
  let token = null;
  if (getTokenRef) {
    try {
      token = await getTokenRef({ template: 'supabase' });
    } catch (err) {
      console.error("Supabase customFetch: Failed to get Clerk token", err);
    }
  }

  // 3. Use the token if available, otherwise fallback to Anon Key
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers.set('Authorization', `Bearer ${supabaseAnonKey}`);
  }

  // Return the fetch call with our safely merged headers
  return fetch(url, { 
    ...options, 
    headers 
  });
};

// Create the ONE AND ONLY strict singleton client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch,
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});