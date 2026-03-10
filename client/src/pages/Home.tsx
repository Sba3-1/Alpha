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
    description: "بوتات Discord متقدمة. دقة، أمان، واحترافية.",
    precision: "موثوق في العمل الحر",
    precisionDesc: "نحن جهة موثوقة ومعتمدة في منصات العمل الحر لضمان جودة الخدمة",
    secure: "أمان فائق",
    secureDesc: "نظام تشفير متقدم لحماية بياناتك ومعاملاتك من أي تسريب",
    scalable: "حماية متكاملة",
    scalableDesc: "الموقع محمي بأحدث تقنيات الحماية ضد الهجمات الإلكترونية",
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
    description: "Premium Discord bots. Precision, Security, Excellence.",
    precision: "FREELANCE TRUSTED",
    precisionDesc: "Verified and trusted in freelance platforms ensuring top-tier service quality",
    secure: "ULTRA SECURE",
    secureDesc: "Advanced encryption systems to protect your data and transactions from leaks",
    scalable: "FULL PROTECTION",
    scalableDesc: "The site is protected with the latest security technologies against cyber attacks",
    footer: "© 2026 Alpha Store. All rights reserved. | Engineered with precision.",
  },
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);

    // Security Protection: Prevent right-click, copy, and F12
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
    };
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

            <div className="overflow-hidden mb-8">
              <div className="animate-[slideDownUp_4s_ease-in-out_infinite]">
                <h1 className="text-7xl font-black mb-4 text-foreground leading-tight tracking-tighter">
                  {t.title}
                </h1>
                <p className="text-2xl font-medium text-cyan-400/80 max-w-2xl mx-auto tracking-wide">
                  {t.description}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap mt-12 mb-24">
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

      {/* Features & Trust Section - Bottom */}
      <section className="py-24 border-t border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
              {language === 'ar' ? 'لماذا تختار متجر ألفا؟' : 'Why Choose Alpha Store?'}
            </h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Security Card */}
            <div className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all duration-500 hover:translate-y-[-5px]">
              <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🛡️</div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.secure}</h3>
              <p className="text-muted-foreground leading-relaxed">{t.secureDesc}</p>
            </div>

            {/* Protection Card */}
            <div className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all duration-500 hover:translate-y-[-5px]">
              <div className="w-14 h-14 rounded-2xl bg-blue-400/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🔒</div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.scalable}</h3>
              <p className="text-muted-foreground leading-relaxed">{t.scalableDesc}</p>
            </div>

            {/* Trust Card */}
            <div className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-green-400/50 transition-all duration-500 hover:translate-y-[-5px]">
              <div className="w-14 h-14 rounded-2xl bg-green-400/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">💎</div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.precision}</h3>
              <p className="text-muted-foreground leading-relaxed">{t.precisionDesc}</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-20">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                {language === 'ar' ? 'نظام محمي بالكامل' : 'FULLY PROTECTED SYSTEM'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-400/10 border border-green-400/20 backdrop-blur-md">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A11.955 11.955 0 0112 21.056a11.955 11.955 0 018.618-3.04z"></path></svg>
              <span className="text-xs font-black text-green-400 uppercase tracking-widest">
                {language === 'ar' ? 'موثوق في العمل الحر' : 'FREELANCE VERIFIED'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-400/10 border border-blue-400/20 backdrop-blur-md">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
                {language === 'ar' ? 'تشفير بيانات متقدم' : 'ADVANCED ENCRYPTION'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 bg-black/40">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="font-medium">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
