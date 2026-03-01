import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";
import { ShoppingCart, Settings, LogOut } from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

const ALPHA_LOGO_URL = "https://cdn.discordapp.com/attachments/1448837993505755380/1477800356527210527/Screenshot_2026-03-01_163950-removebg-preview.png";

type Language = "ar" | "en";

const translations = {
  ar: {
    marketplace: "سوق البوتات",
    admin: "الإدارة",
    signIn: "تسجيل الدخول",
    signInDiscord: "تسجيل الدخول عبر Discord",
    browseBot: "تصفح البوتات",
    title: "متجر ألفا",
    description: "بوتات Discord متقدمة مصممة بدقة. اكتشف واشتري وادمج أدوات أتمتة قوية لخادمك",
    precision: "الدقة",
    precisionDesc: "مصممة بتميز تقني وبدقة رياضية",
    secure: "آمن",
    secureDesc: "مصادقة Discord مع ربط حساب موثق",
    scalable: "قابل للتوسع",
    scalableDesc: "مبني للنمو مع بنية تحتية من الدرجة الأولى",
    footer: "© 2026 متجر ألفا. جميع الحقوق محفوظة. | مصمم بدقة.",
  },
  en: {
    marketplace: "Marketplace",
    admin: "Admin",
    signIn: "Sign In",
    signInDiscord: "Sign In with Discord",
    browseBot: "Browse Bots",
    title: "ALPHA STORE",
    description: "Premium Discord bots engineered with precision. Discover, purchase, and integrate powerful automation tools for your server.",
    precision: "PRECISION",
    precisionDesc: "Engineered with technical excellence and mathematical precision",
    secure: "SECURE",
    secureDesc: "Discord OAuth authentication with verified account linking",
    scalable: "SCALABLE",
    scalableDesc: "Built for growth with enterprise-grade infrastructure",
    footer: "© 2026 Alpha Store. All rights reserved. | Engineered with precision.",
  },
};

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
  }, []);

  const t = translations[language];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={ALPHA_LOGO_URL} alt="Alpha Store" className="w-10 h-10" />
            <span className="text-2xl font-bold text-foreground">ALPHA</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/marketplace">
              <span className="text-foreground hover:text-secondary transition-colors font-medium cursor-pointer">
                {t.marketplace}
              </span>
            </Link>

            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <span className="text-foreground hover:text-secondary transition-colors font-medium flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  {t.admin}
                </span>
              </Link>
            )}

            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <a href="/login">
                <Button className="gap-2">
                  {t.signIn}
                </Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="mb-8 flex justify-center">
              <img src={ALPHA_LOGO_URL} alt="Alpha Store" className="w-32 h-32" />
            </div>

            <h1 className="text-7xl font-bold mb-6 text-foreground leading-tight">
              {t.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.description}
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/marketplace">
                <Button size="lg" className="gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t.browseBot}
                </Button>
              </Link>

              {!isAuthenticated && (
                <a href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                  >
                    {t.signInDiscord}
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Blueprint Grid Accent */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: t.precision,
                description: t.precisionDesc,
                icon: "⚙️",
              },
              {
                title: t.secure,
                description: t.secureDesc,
                icon: "🔐",
              },
              {
                title: t.scalable,
                description: t.scalableDesc,
                icon: "📈",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 border border-border rounded-lg hover:border-secondary transition-colors group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground tech-label">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
