import { useAuth } from '@clerk/clerk-react';
import { useCallback, useRef } from 'react';
import { supabase, getAuthClient } from '../lib/supabase';

export const useSupabase = () => {
  const { userId, getToken } = useAuth();
  const cachedTokenRef = useRef(null);
  const cachedClientRef = useRef(null);

  // Returns authenticated client for writes (RLS requires JWT)
  // Memoized to prevent unnecessary token fetches
  const getDb = useCallback(async () => {
    try {
      const token = await getToken({ template: 'supabase' });
      
      // Only create new client if token changed
      if (token !== cachedTokenRef.current) {
        cachedTokenRef.current = token;
        cachedClientRef.current = getAuthClient(token);
      }
      
      return cachedClientRef.current;
    } catch (error) {
      console.error('Failed to get authenticated client:', error);
      return supabase; // Fallback to public client
    }
  }, [getToken]);
  
  return { userId, supabase, getDb };
};
