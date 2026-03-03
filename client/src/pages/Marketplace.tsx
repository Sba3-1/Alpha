import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShoppingCart, ExternalLink } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useState, useEffect } from "react";
import { Link } from "wouter";

type Language = "ar" | "en";

const translations = {
  ar: {
    marketplace: "سوق البوتات",
    home: "الرئيسية",
    admin: "الإدارة",
    discover: "اكتشف واشتري بوتات Discord المميزة",
    noBots: "لا توجد بوتات متاحة حالياً. تحقق لاحقاً!",
    returnHome: "العودة للرئيسية",
    price: "السعر",
    purchase: "شراء",
    underMaintenance: "الموقع تحت الصيانة حالياً، يرجى المحاولة لاحقاً.",
    free: "مجاني",
    soldOut: "نفذت الكمية",
    getBot: "الحصول على البوت",
  },
  en: {
    marketplace: "Bot Marketplace",
    home: "Home",
    admin: "Admin",
    discover: "Discover and purchase premium Discord bots",
    noBots: "No bots available yet. Check back soon!",
    returnHome: "Return to Home",
    price: "Price",
    purchase: "Purchase",
    underMaintenance: "The site is currently under maintenance, please try again later.",
    free: "Free",
    soldOut: "Sold Out",
    getBot: "Get Bot",
  },
};

export default function Marketplace() {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: bots, isLoading, error, refetch } = trpc.bots.list.useQuery();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
  }, []);

  const t = translations[language];

  const handlePurchase = (bot: any) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    
    if (bot.soldOut === 1) return;

    if (bot.price === 0) {
      window.open(bot.purchaseLink, "_blank");
    } else {
      alert(t.underMaintenance);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent dark">
        <Loader2 className="animate-spin w-8 h-8 text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent dark text-foreground">
      <header className="sticky top-0 bg-transparent/95 backdrop-blur z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground tracking-tighter">
              ALPHA
            </span>
            <span className="text-sm text-muted-foreground">{t.marketplace}</span>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="/">
              <span className="text-foreground/80 hover:text-foreground transition-colors font-medium cursor-pointer">
                {t.home}
              </span>
            </Link>
            {(user?.role === "admin" || user?.discordUsername === "6uvu" || user?.discordUsername === "5mcm") && (
              <Link href="/admin">
                <span className="text-foreground/80 hover:text-foreground transition-colors font-medium cursor-pointer">
                  {t.admin}
                </span>
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground/80">@{user?.discordUsername}</span>
                  <ProfileDropdown />
                </div>
                <button onClick={() => logout()} className="bg-muted/50 px-6 py-2 rounded-xl hover:bg-muted font-bold text-sm">Logout</button>
              </div>
            ) : (
              <Button className="gap-2 rounded-xl px-6 bg-cyan-400 hover:bg-cyan-500 text-black font-bold" onClick={() => window.location.href = '/login'}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 flex justify-between items-center">
          <h2 className="text-4xl font-bold tracking-tighter">{t.marketplace}</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-2 hover:bg-secondary/10" onClick={() => refetch()}>
            <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {!bots || bots.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-muted-foreground mb-4">{t.noBots}</p>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              {t.returnHome}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <Card
                key={bot.id}
                className={`flex flex-col h-full bg-card/40/50 border-border/50 hover:shadow-lg transition-all rounded-2xl overflow-hidden ${bot.soldOut === 1 ? 'opacity-75 grayscale-[0.5]' : 'hover:border-cyan-400/50'}`}
              >
                <CardHeader className="relative">
                  {bot.soldOut === 1 && (
                    <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter shadow-lg">
                      {t.soldOut}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center overflow-hidden border border-border/50">
                      {bot.imageUrl ? (
                        <img src={bot.imageUrl} alt={bot.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 to-muted" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-foreground font-bold">{bot.name}</CardTitle>
                      <CardDescription className="text-xs text-cyan-400 font-bold uppercase tracking-widest mt-1">
                        {bot.type}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">
                    {bot.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-t border-border/50 pt-4">
                      <span className="text-xs font-bold text-muted-foreground uppercase">{t.price}</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-bold ${bot.soldOut === 1 ? 'text-muted-foreground' : 'text-cyan-400'}`}>
                          {bot.price === 0 ? t.free : (bot.price / 100).toFixed(2)}
                        </span>
                        {bot.price !== 0 && <span className="text-sm text-muted-foreground font-bold">SAR</span>}
                      </div>
                    </div>

                    <Button
                      variant="default"
                      disabled={bot.soldOut === 1}
                      className={`w-full py-6 font-bold rounded-xl transition-all ${
                        bot.soldOut === 1 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                        : 'bg-cyan-400 hover:bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                      }`}
                      onClick={() => handlePurchase(bot)}
                    >
                      {bot.soldOut === 1 ? (
                        t.soldOut
                      ) : bot.price === 0 ? (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {t.getBot}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {t.purchase}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
