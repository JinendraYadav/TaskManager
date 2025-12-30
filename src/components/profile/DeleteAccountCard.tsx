import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

export function DeleteAccountCard() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure? This will permanently delete your account."
    );
    if (!confirmed) return;

    try {
      await api.delete("/users/me");

      localStorage.clear();
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-destructive/5">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          Permanently delete your account and all associated data.
        </p>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
