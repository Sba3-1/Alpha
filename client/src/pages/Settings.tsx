import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

type Language = "ar" | "en";

const translations = {
  ar: {
    settings: "الإعدادات",
    back: "رجوع",
    language: "اللغة",
    selectLanguage: "اختر اللغة",
    theme: "المظهر",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    account: "الحساب",
    email: "البريد الإلكتروني",
    username: "اسم المستخدم",
    admin: "إدارة الأدمنز",
    admins: "الأدمنز",
    addAdmin: "إضافة أدمن",
    removeAdmin: "إزالة أدمن",
    onlyOwner: "فقط صاحب الحساب يمكنه إدارة الأدمنز",
  },
  en: {
    settings: "Settings",
    back: "Back",
    language: "Language",
    selectLanguage: "Select Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    account: "Account",
    email: "Email",
    username: "Username",
    admin: "Admin Management",
    admins: "Admins",
    addAdmin: "Add Admin",
    removeAdmin: "Remove Admin",
    onlyOwner: "Only the account owner can manage admins",
  },
};

export default function Settings() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;
    if (saved) {
      setLanguage(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    // Apply language globally
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const t = translations[language];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const isOwner = user?.role === "admin" && user?.id === 1; // Owner check

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">{t.settings}</h1>
        </div>
      </header>

      {/* Settings Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t.language}</CardTitle>
            <CardDescription>{t.selectLanguage}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              variant={language === "en" ? "default" : "outline"}
              onClick={() => handleLanguageChange("en")}
            >
              English
            </Button>
            <Button
              variant={language === "ar" ? "default" : "outline"}
              onClick={() => handleLanguageChange("ar")}
            >
              العربية
            </Button>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t.theme}</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => toggleTheme && toggleTheme("light")}
            >
              {t.lightMode}
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => toggleTheme && toggleTheme("dark")}
            >
              {t.darkMode}
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t.account}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t.username}</p>
              <p className="font-semibold">{user?.discordUsername}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.email}</p>
              <p className="font-semibold">{user?.email || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Management */}
        {isOwner && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t.admin}</CardTitle>
              <CardDescription>{t.onlyOwner}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Admin management UI coming soon. You can manage admins here.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
