import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShoppingCart, Settings, LayoutDashboard } from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

const ALPHA_LOGO_URL = "/logo.png";

type Language = "ar" | "en";

const translations = {
  ar: {
    marketplace: "سوق البوتات",
    dashboard: "لوحة التحكم",
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
    dashboard: "Dashboard",
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
  const { user, isAuthenticated } = useAuth();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
  }, []);

  const t = translations[language];

  const { data: myBots } = trpc.bots.myBots.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const hasBots = myBots && myBots.length > 0;
  const isAdmin = user?.role === "admin" || user?.discordUsername === "6uvu" || user?.discordUsername === "5mcm";

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navigation Header */}
      <header className="border-b border-border sticky top-0 bg-transparent/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={ALPHA_LOGO_URL} alt="Alpha Store" className="w-10 h-10" />
            <span className="text-2xl font-bold text-foreground tracking-tighter">ALPHA</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/marketplace">
              <span className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium cursor-pointer">
                {t.marketplace}
              </span>
            </Link>

            {isAuthenticated && hasBots && (
              <Link href="/dashboard">
                <span className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="w-4 h-4" />
                  {t.dashboard}
                </span>
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link href="/admin">
                <span className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  {t.admin}
                </span>
              </Link>
            )}

            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link href="/login">
                <Button className="gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-xl px-6">
                  {t.signIn}
                </Button>
              </Link>
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

            <h1 className="text-7xl font-bold mb-6 text-foreground leading-tight tracking-tighter overflow-hidden">
              <span className="inline-block animate-[slideDownUp_4s_ease-in-out_infinite]">
                {t.title}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.description}
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/marketplace">
                <Button size="lg" className="gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-2xl px-10 py-8 text-xl shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  <ShoppingCart className="w-6 h-6" />
                  {t.browseBot}
                </Button>
              </Link>

              {!isAuthenticated && (
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-2xl px-10 py-8 text-xl border-border/50 hover:bg-muted/50"
                  >
                    {t.signInDiscord}
                  </Button>
                </Link>
              )}
            </div>
          </div>


        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 bg-card/20 mt-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="font-medium">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
