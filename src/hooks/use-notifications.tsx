import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api'; // ✅ using your axios instance

export function useNotifications() {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data;
    },
    placeholderData: [],
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    },
    onMutate: async (notificationId) => {
      const previousNotifications = queryClient.getQueryData(['notifications']);

      queryClient.setQueryData(['notifications'], (old: Notification[] = []) =>
        old.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      return { previousNotifications };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['notifications'], context?.previousNotifications);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    setUnreadCount(
      notifications.filter((notification: Notification) => !notification.isRead).length
    );
  }, [notifications]);

  return {
    notifications,
    markAsRead,
    unreadCount,
  };
}