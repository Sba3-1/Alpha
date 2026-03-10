import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Settings, LayoutDashboard, Shield, Lock, CheckCircle, Zap, Globe, MessageSquare, Code, Cpu, Bell, ChevronDown } from "lucide-react";
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

  // Random grid glow positions
  const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPos({
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <div 
        className="grid-glow" 
        style={{ '--gx': glowPos.x, '--gy': glowPos.y } as React.CSSProperties}
      ></div>
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
            <div className="mb-12 flex justify-center">
              <img src={ALPHA_LOGO_URL} alt="Alpha Store" className="w-48 h-48 drop-shadow-[0_0_30px_rgba(0,163,255,0.4)] hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="relative mb-12 min-h-[220px] flex flex-col items-center justify-center overflow-hidden">
              <h1 className="text-6xl md:text-7xl font-black mb-6 text-white leading-tight tracking-tighter animate-[slideFromRight_10s_ease-in-out_infinite]">
                {t.title}
              </h1>
              <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl mx-auto tracking-wide animate-[slideFromLeft_10s_ease-in-out_infinite]">
                {t.description}
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 mt-12 mb-24">
              <Link href="/marketplace">
                <Button size="lg" className="gap-3 bg-cyan-400 hover:bg-cyan-500 text-black font-black rounded-2xl px-14 py-9 text-2xl shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(34,211,238,0.6)]">
                  <ShoppingCart className="w-8 h-8" />
                  {language === 'ar' ? 'تصفح الروبوتات' : 'Browse Bots'}
                </Button>
              </Link>
              
              <div className="flex gap-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <Button size="lg" variant="outline" className="gap-2 border-white/10 hover:bg-white/5 text-white font-bold rounded-2xl px-8 py-6 text-lg">
                        <LayoutDashboard className="w-5 h-5" />
                        {t.dashboard}
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin">
                        <Button size="lg" variant="outline" className="gap-2 border-cyan-400/20 hover:bg-cyan-400/5 text-cyan-400 font-bold rounded-2xl px-8 py-6 text-lg">
                          <Settings className="w-5 h-5" />
                          {t.admin}
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Feature 1 */}
            <Link href="/info/security">
              <div className="glass-card p-8 cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 flex items-center justify-center mb-6 group-hover:bg-cyan-400/20 transition-colors">
                  <Shield className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t.secure}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.secureDesc}</p>
              </div>
            </Link>

            {/* Feature 2 */}
            <Link href="/info/protection">
              <div className="glass-card p-8 cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-blue-400/10 flex items-center justify-center mb-6 group-hover:bg-blue-400/20 transition-colors">
                  <Lock className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t.scalable}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.scalableDesc}</p>
              </div>
            </Link>

            {/* Feature 3 */}
            <Link href="/info/trust">
              <div className="glass-card p-8 cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-green-400/10 flex items-center justify-center mb-6 group-hover:bg-green-400/20 transition-colors">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t.precision}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.precisionDesc}</p>
              </div>
            </Link>

            {/* New Solo-Safety Style Features */}
            <div className="glass-card p-8 group">
              <div className="w-16 h-16 rounded-2xl bg-purple-400/10 flex items-center justify-center mb-6 group-hover:bg-purple-400/20 transition-colors">
                <Bell className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? 'إشعارات فورية' : 'Instant Notifications'}</h3>
              <p className="text-muted-foreground leading-relaxed">{language === 'ar' ? 'ابقَ على اطلاع دائم بنشاط بوتاتك من خلال نظام إشعارات متطور.' : 'Stay updated with your bot activity through an advanced notification system.'}</p>
            </div>

            <div className="glass-card p-8 group">
              <div className="w-16 h-16 rounded-2xl bg-orange-400/10 flex items-center justify-center mb-6 group-hover:bg-orange-400/20 transition-colors">
                <Code className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? 'أكواد مبسطة' : 'Simplified Code'}</h3>
              <p className="text-muted-foreground leading-relaxed">{language === 'ar' ? 'سهولة في التعامل والدمج حتى لو لم تكن خبيراً في البرمجة.' : 'Easy to handle and integrate even if you are not a programming expert.'}</p>
            </div>

            <div className="glass-card p-8 group">
              <div className="w-16 h-16 rounded-2xl bg-pink-400/10 flex items-center justify-center mb-6 group-hover:bg-pink-400/20 transition-colors">
                <MessageSquare className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? 'دعم متواصل' : 'Continuous Support'}</h3>
              <p className="text-muted-foreground leading-relaxed">{language === 'ar' ? 'فريق دعم فني متاح على مدار الساعة لمساعدتك في أي وقت.' : 'Technical support team available 24/7 to assist you at any time.'}</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-20">
            <Link href="/info/protection">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 backdrop-blur-md cursor-pointer hover:bg-cyan-400/20 transition-all">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
                <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                  {language === 'ar' ? 'نظام محمي بالكامل' : 'FULLY PROTECTED SYSTEM'}
                </span>
              </div>
            </Link>
            <Link href="/info/trust">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-400/10 border border-green-400/20 backdrop-blur-md cursor-pointer hover:bg-green-400/20 transition-all">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-xs font-black text-green-400 uppercase tracking-widest">
                  {language === 'ar' ? 'موثوق في العمل الحر' : 'FREELANCE VERIFIED'}
                </span>
              </div>
            </Link>
            <Link href="/info/security">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-400/10 border border-blue-400/20 backdrop-blur-md cursor-pointer hover:bg-blue-400/20 transition-all">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
                  {language === 'ar' ? 'تشفير بيانات متقدم' : 'ADVANCED ENCRYPTION'}
                </span>
              </div>
            </Link>
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
