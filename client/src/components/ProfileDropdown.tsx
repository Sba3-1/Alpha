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
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

type Language = "ar" | "en";

const translations = {
  ar: {
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
  },
  en: {
    settings: "Settings",
    logout: "Logout",
  },
};

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
  }, []);

  const t = translations[language];

  if (!user) {
    return null;
  }

  const avatarUrl = user.discordAvatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discordId || '0') % 5}.png`;

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 rounded-full p-0 overflow-hidden hover:ring-2 hover:ring-secondary"
        >
          <img
            src={avatarUrl}
            alt={user.discordUsername || "Profile"}
            className="h-full w-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-md mx-1 mb-2">
          <img
            src={avatarUrl}
            alt={user.discordUsername || "Profile"}
            className="h-10 w-10 rounded-full border-2 border-secondary"
          />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user.discordUsername}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email || "No email"}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSettings}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>{t.settings}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
