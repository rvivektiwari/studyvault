import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase, setTokenGetter } from '../lib/supabase';

export const useSupabase = () => {
  const { getToken, userId } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (getToken) {
      setTokenGetter(getToken);
      setIsReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  // Return protected instance and convenience attributes
  return useMemo(() => ({ supabase, userId, isReady }), [userId, isReady]);
};