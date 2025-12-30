import { useEffect } from "react";
import { Notification } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useNotifications() {
  const queryClient = useQueryClient();

  /* ---------------- Fetch notifications ---------------- */
  const {
    data: notifications = [],
    isLoading,
  } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notifications");
      return response.data;
    },
    placeholderData: [],
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ---------------- Mark one as read (optimistic) ---------------- */
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/notifications/${id}/read`);
      return res.data;
    },
    onMutate: async (id) => {
      const previousNotifications =
        queryClient.getQueryData<Notification[]>(["notifications"]);

      queryClient.setQueryData<Notification[]>(["notifications"], (old = []) =>
        old.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );

      return { previousNotifications };
    },
    onError: (_, __, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  /* ---------------- Mark all as read ---------------- */
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put("/notifications/read-all");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  /* ---------------- Delete notification ---------------- */
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/notifications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,

    /* exposed actions */
    fetchNotifications: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),

    markAsRead: (id: string) =>
      markAsReadMutation.mutateAsync(id),

    markAllAsRead: () =>
      markAllAsReadMutation.mutateAsync(),

    deleteNotification: (id: string) =>
      deleteNotificationMutation.mutateAsync(id),
  };
}
