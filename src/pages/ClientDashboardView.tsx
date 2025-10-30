import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import ModernDashboard from "@/components/ModernDashboard";

interface UserProfile {
  full_name: string;
  company: string;
}

export default function ClientDashboardView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useUserRole();
  const userId = searchParams.get('userId');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, company')
        .eq('user_id', userId)
        .maybeSingle();

      if (profile) {
        setUserProfile(profile);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">ID do usuário não fornecido</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pb-24">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold mb-2">
          Dashboard - {userProfile?.full_name || 'Cliente'}
        </h1>
        {userProfile?.company && (
          <p className="text-muted-foreground">{userProfile.company}</p>
        )}
      </div>

      <ModernDashboard userId={userId} isAdmin={isAdmin} />
    </div>
  );
}
