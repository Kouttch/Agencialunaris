import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<'admin' | 'moderator' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);
  const [managedClients, setManagedClients] = useState<string[]>([]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user');
        } else {
          setRole(data?.role || 'user');
          
          // If moderator, fetch managed clients
          if (data?.role === 'moderator') {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('manager_id, user_id')
              .eq('manager_id', user.id);
            
            if (profileData) {
              setManagedClients(profileData.map(p => p.user_id));
            }
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user]);

  return { 
    role, 
    isAdmin: role === 'admin', 
    isModerator: role === 'moderator',
    loading,
    managedClients
  };
};
