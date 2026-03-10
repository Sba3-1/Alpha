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
      {/* Navigation Header - Centered Floating */}
      <header className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-3xl px-8 py-4 flex items-center justify-between gap-12">
          {/* Left Side - Logo */}
          <div className="flex items-center gap-3">
            <img src={ALPHA_LOGO_URL} alt="Alpha Store" className="w-10 h-10" />
            <span className="text-xl font-black text-foreground tracking-tighter">ALPHA STORE</span>
          </div>

          {/* Center - Menu */}
          <nav className="flex items-center gap-6">
            <Link href="/marketplace">
              <span className="text-sm font-bold text-foreground/90 hover:text-cyan-400 transition-colors cursor-pointer">
                {t.marketplace}
              </span>
            </Link>

            {isAuthenticated && hasBots && (
              <Link href="/dashboard">
                <span className="text-sm font-bold text-foreground/90 hover:text-cyan-400 transition-colors flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="w-4 h-4" />
                  {t.dashboard}
                </span>
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link href="/admin">
                <span className="text-sm font-bold text-foreground/90 hover:text-cyan-400 transition-colors flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  {t.admin}
                </span>
              </Link>
            )}
          </nav>

          {/* Right Side - Profile/Auth */}
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <Link href="/login">
              <Button className="gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-lg px-6 py-2 text-sm">
                {t.signIn}
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="relative mb-8 min-h-[160px] flex flex-col items-center justify-center overflow-hidden">
              <h1 className="text-7xl md:text-8xl font-black mb-6 text-white leading-tight tracking-tighter animate-[slideFromRight_10s_ease-in-out_infinite]">
                {t.title}
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-muted-foreground/80 max-w-2xl mx-auto tracking-wide animate-[slideFromLeft_10s_ease-in-out_infinite]">
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

          <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Row 1 - Large Feature (Security) */}
            <Link href="/info/security">
              <div className="glass-card p-8 cursor-pointer group bg-gradient-to-br from-cyan-500/10 to-cyan-400/5 hover:from-cyan-500/20 hover:to-cyan-400/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-cyan-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-400/30 transition-colors">
                    <Shield className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{t.secure}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t.secureDesc}</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Row 2 - Three Small Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature 2 - Protection */}
              <Link href="/info/protection">
                <div className="glass-card p-6 cursor-pointer group bg-gradient-to-br from-blue-500/10 to-blue-400/5 hover:from-blue-500/20 hover:to-blue-400/10 hover:shadow-[0_0_40px_rgba(96,165,250,0.4)] transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-blue-400/20 flex items-center justify-center mb-4 group-hover:bg-blue-400/30 transition-colors">
                    <Lock className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.scalable}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.scalableDesc}</p>
                </div>
              </Link>

              {/* Feature 3 - Trust */}
              <Link href="/info/trust">
                <div className="glass-card p-6 cursor-pointer group bg-gradient-to-br from-green-500/10 to-green-400/5 hover:from-green-500/20 hover:to-green-400/10 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-green-400/20 flex items-center justify-center mb-4 group-hover:bg-green-400/30 transition-colors">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.precision}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.precisionDesc}</p>
                </div>
              </Link>

              {/* Feature 4 - Notifications */}
              <a href="https://discord.gg/yFZTCSFNJG" target="_blank" rel="noopener noreferrer">
                <div className="glass-card p-6 cursor-pointer group bg-gradient-to-br from-purple-500/10 to-purple-400/5 hover:from-purple-500/20 hover:to-purple-400/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-purple-400/20 flex items-center justify-center mb-4 group-hover:bg-purple-400/30 transition-colors">
                    <Bell className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'إشعارات فورية' : 'Instant Notifications'}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{language === 'ar' ? 'ابقَ على اطلاع دائم بنشاط بوتاتك من خلال نظام إشعارات متطور.' : 'Stay updated with your bot activity through an advanced notification system.'}</p>
                </div>
              </a>
            </div>

            {/* Row 3 - Large Feature (Code) */}
            <div className="glass-card p-8 group bg-gradient-to-br from-orange-500/10 to-orange-400/5 hover:from-orange-500/20 hover:to-orange-400/10 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-3xl bg-orange-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-400/30 transition-colors">
                  <Code className="w-10 h-10 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">{language === 'ar' ? 'أكواد مبسطة' : 'Simplified Code'}</h3>
                  <p className="text-muted-foreground leading-relaxed">{language === 'ar' ? 'سهولة في التعامل والدمج حتى لو لم تكن خبيراً في البرمجة.' : 'Easy to handle and integrate even if you are not a programming expert.'}</p>
                </div>
              </div>
            </div>

            {/* Row 4 - Three Small Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature 5 - Support */}
              <a href="https://discord.gg/yFZTCSFNJG" target="_blank" rel="noopener noreferrer">
                <div className="glass-card p-6 cursor-pointer group bg-gradient-to-br from-pink-500/10 to-pink-400/5 hover:from-pink-500/20 hover:to-pink-400/10 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-pink-400/20 flex items-center justify-center mb-4 group-hover:bg-pink-400/30 transition-colors">
                    <MessageSquare className="w-8 h-8 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'دعم متواصل' : 'Continuous Support'}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{language === 'ar' ? 'فريق دعم فني متاح على مدار الساعة لمساعدتك في أي وقت.' : 'Technical support team available 24/7 to assist you at any time.'}</p>
                </div>
              </a>

              {/* Feature 6 - Placeholder */}
              <div className="glass-card p-6 group bg-gradient-to-br from-indigo-500/10 to-indigo-400/5 hover:from-indigo-500/20 hover:to-indigo-400/10 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-indigo-400/20 flex items-center justify-center mb-4 group-hover:bg-indigo-400/30 transition-colors">
                  <Zap className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'أداء عالي' : 'High Performance'}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{language === 'ar' ? 'سرعة فائقة وأداء محسّن لأفضل تجربة مستخدم.' : 'Lightning-fast speed and optimized performance for the best experience.'}</p>
              </div>

              {/* Feature 7 - Placeholder */}
              <div className="glass-card p-6 group bg-gradient-to-br from-rose-500/10 to-rose-400/5 hover:from-rose-500/20 hover:to-rose-400/10 hover:shadow-[0_0_40px_rgba(244,63,94,0.4)] transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-rose-400/20 flex items-center justify-center mb-4 group-hover:bg-rose-400/30 transition-colors">
                  <Cpu className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'تقنية متقدمة' : 'Advanced Technology'}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{language === 'ar' ? 'استخدام أحدث التقنيات والأدوات في المجال.' : 'Using the latest technologies and tools in the industry.'}</p>
              </div>
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
