
import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/use-UserProfile";
import { Card } from "@/components/ui/card";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { PasswordCard } from "@/components/profile/PasswordCard";
import { DeleteAccountCard } from "@/components/profile/DeleteAccountCard";

export default function ProfilePage() {
  const { user, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-theme-purple animate-spin rounded-full mx-auto"></div>
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="p-6">
        <p>Unable to load profile information. Please try again later.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ProfileInfoCard 
          initialName={user.name} 
          initialEmail={user.email} 
          initialAvatar={user.avatar} 
        />
        <PasswordCard />
      </div>
      
      <DeleteAccountCard />
    </div>
  );
}
