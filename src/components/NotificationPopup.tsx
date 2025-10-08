import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationPopup() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadNotifications();
      
      // Subscribe to new notifications
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          () => loadNotifications()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(3);

    if (data) {
      setNotifications(data.filter(n => !dismissed.includes(n.id)));
    }
  };

  const handleDismiss = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setDismissed([...dismissed, notificationId]);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <Card key={notification.id} className="shadow-lg border-2 border-primary/20 animate-in slide-in-from-right">
          <CardHeader className="pb-3 flex flex-row items-start justify-between">
            <CardTitle className="text-base">{notification.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleDismiss(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(notification.created_at).toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
