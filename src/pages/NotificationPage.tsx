import { useEffect, useState, useCallback } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/helpers";

export default function NotificationsPage() {
    const {
        notifications,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        unreadCount,
        isLoading,
    } = useNotifications();

    const { toast } = useToast();

    const loadNotifications = useCallback(async () => {
        try {
            await fetchNotifications();
        } catch {
            toast({
                title: "Error",
                description: "Failed to load notifications",
                variant: "destructive",
            });
        }
    }, [fetchNotifications, toast]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>

                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            await markAllAsRead();
                            toast({
                                title: "All caught up",
                                description: "All notifications marked as read",
                                duration: 1500,
                            });
                        }}
                    >
                        <Check className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-10 text-muted-foreground">
                    Loading notifications...
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex justify-center py-10 text-muted-foreground">
                    You have no notifications
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`transition ${!notification.isRead ? "bg-muted/50" : ""
                                }`}
                        >
                            <CardContent className="flex items-start justify-between gap-4 p-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">
                                            {notification.message}
                                        </p>
                                        {!notification.isRead && (
                                            <Badge variant="secondary" className="text-xs">
                                                New
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDateTime(notification.createdAt)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!notification.isRead && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => deleteNotification(notification.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Separator />
        </div>
    );
}
