import { useAuth } from "@/_core/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

type Language = "ar" | "en";

const translations = {
  ar: {
    dashboard: "لوحة التحكم",
    admin: "لوحة الإدارة",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
  },
  en: {
    dashboard: "My Dashboard",
    admin: "Admin Dashboard",
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

  // Fetch user bots to determine if dashboard should be shown
  const { data: myBots } = trpc.bots.myBots.useQuery(undefined, {
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  const hasBots = myBots && myBots.length > 0;
  const isAdmin = user.role === "admin" || user.discordUsername === "6uvu" || user.discordUsername === "5mcm";

  const avatarUrl = user.discordAvatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discordId || '0') % 5}.png`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative h-12 w-12 rounded-full overflow-hidden hover:ring-2 hover:ring-cyan-400 transition-all focus:outline-none"
        >
          <img
            src={avatarUrl}
            alt={user.discordUsername || "Profile"}
            className="h-full w-full object-cover"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-2xl p-2 shadow-xl">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">@{user.discordUsername}</p>
        </div>
        <DropdownMenuSeparator className="bg-border/50" />
        
        {hasBots && (
          <DropdownMenuItem
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer rounded-xl focus:bg-accent focus:text-accent-foreground py-2.5"
          >
            <LayoutDashboard className="mr-3 h-4 w-4 text-cyan-400" />
            <span className="font-medium">{t.dashboard}</span>
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => navigate("/admin")}
            className="cursor-pointer rounded-xl focus:bg-accent focus:text-accent-foreground py-2.5"
          >
            <Shield className="mr-3 h-4 w-4 text-cyan-400" />
            <span className="font-medium">{t.admin}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => navigate("/settings")}
          className="cursor-pointer rounded-xl focus:bg-accent focus:text-accent-foreground py-2.5"
        >
          <Settings className="mr-3 h-4 w-4 text-cyan-400" />
          <span className="font-medium">{t.settings}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer rounded-xl focus:bg-red-500/10 focus:text-red-500 text-red-500 py-2.5"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-medium">{t.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
