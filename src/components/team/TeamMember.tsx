
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { User } from "@/types";

interface TeamMemberProps {
  member: User;
}

export function TeamMember({ member }: TeamMemberProps) {
  return (
    <div className="flex items-center space-x-3 p-2 border rounded-md">
      <Avatar>
        <AvatarImage src={member.avatar} alt={member.name} />
        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{member.name}</p>
        <p className="text-xs text-muted-foreground">{member.email}</p>
      </div>
      <Button variant="ghost" size="sm" className="ml-auto">
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  );
}
