import { useAuth } from '@clerk/clerk-react';
import { getSupabase } from '../supabaseClient';

export const useSupabase = () => {
  const { getToken, userId } = useAuth();
  
  return {
    userId,
    getSupabase: async () => {
      return await getSupabase(getToken);
    }
  };
};
