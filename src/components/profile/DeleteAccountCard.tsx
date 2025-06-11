
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DeleteAccountCard() {
  return (
    <Card className="bg-destructive/5">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="destructive">Delete Account</Button>
      </CardContent>
    </Card>
  );
}
