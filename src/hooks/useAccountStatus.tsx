import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useAccountStatus = () => {
  const { user } = useAuth();
  const [accountStatus, setAccountStatus] = useState<string>("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAccountStatus();
    }
  }, [user]);

  const loadAccountStatus = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_status')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setAccountStatus(profile.account_status || "active");
      }
    } catch (error) {
      console.error('Error loading account status:', error);
    } finally {
      setLoading(false);
    }
  };

  return { accountStatus, loading, isActive: accountStatus === 'active' };
};
