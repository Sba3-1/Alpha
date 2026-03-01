import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const avatarUrl = user.discordAvatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discordId || '0') % 5}.png`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 rounded-full p-0 overflow-hidden"
        >
          <img
            src={avatarUrl}
            alt={user.discordUsername || "Profile"}
            className="h-full w-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-3 p-2">
          <img
            src={avatarUrl}
            alt={user.discordUsername || "Profile"}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">{user.discordUsername}</p>
            <p className="text-xs text-muted-foreground">{user.email || "No email"}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
