import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Play, Square, Bot, ShoppingBag, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import ProfileDropdown from "@/components/ProfileDropdown";
import { toast } from "sonner";

type Language = "ar" | "en";

const translations = {
  ar: {
    title: "لوحة تحكم المستخدم",
    welcome: "أهلاً بك،",
    myBots: "بوتاتي المشتراة",
    noBots: "لم تقم بشراء أي بوتات بعد. قم بزيارة المتجر لاكتشاف المزيد!",
    visitMarketplace: "زيارة المتجر",
    status: "الحالة",
    start: "تشغيل",
    stop: "إيقاف",
    running: "يعمل",
    stopped: "متوقف",
    home: "الرئيسية",
    marketplace: "المتجر",
    refresh: "تحديث",
    activeBots: "البوتات النشطة",
    totalBots: "إجمالي البوتات",
  },
  en: {
    title: "User Dashboard",
    welcome: "Welcome,",
    myBots: "My Purchased Bots",
    noBots: "You haven't purchased any bots yet. Visit the marketplace to discover more!",
    visitMarketplace: "Visit Marketplace",
    status: "Status",
    start: "Start",
    stop: "Stop",
    running: "Running",
    stopped: "Stopped",
    home: "Home",
    marketplace: "Marketplace",
    refresh: "Refresh",
    activeBots: "Active Bots",
    totalBots: "Total Bots",
  },
};

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
  }, []);

  const t = translations[language];

  const { data: myBots, isLoading, refetch } = trpc.bots.myBots.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const toggleStatusMutation = trpc.bots.toggleStatus.useMutation();

  useEffect(() => {
    if (!isLoading && (!myBots || myBots.length === 0)) {
      // If user has no bots, they shouldn't be here based on the new logic
      // But we'll handle it gracefully in the UI
    }
  }, [myBots, isLoading]);

  if (!isAuthenticated) {
    navigate("/login", { replace: true });
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark bg-background">
        <Loader2 className="animate-spin w-8 h-8 text-cyan-400" />
      </div>
    );
  }

  const handleToggleStatus = async (botId: number, currentStatus: string) => {
    const action = currentStatus === "running" ? "stop" : "start";
    try {
      await toggleStatusMutation.mutateAsync({ id: botId, action });
      toast.success(`Bot ${action === "start" ? "started" : "stopped"} successfully!`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update bot status");
    }
  };

  const activeBotsCount = myBots?.filter(bot => bot.status === 'running').length || 0;

  return (
    <div className="min-h-screen dark text-foreground bg-background">
      <header className="sticky top-0 z-50 backdrop-blur border-b border-border/50 bg-background/95">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="text-2xl font-bold tracking-tighter">ALPHA</span>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium">{t.home}</a>
              <a href="/marketplace" className="text-foreground/80 hover:text-cyan-400 transition-colors font-medium">{t.marketplace}</a>
            </nav>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-bold mb-2 tracking-tighter">{t.title}</h1>
            <p className="text-muted-foreground text-lg">{t.welcome} <span className="text-cyan-400 font-bold">@{user?.discordUsername}</span></p>
          </div>
          <div className="flex gap-4">
             <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.activeBots}</p>
                <p className="text-2xl font-bold text-green-400">{activeBotsCount} / {myBots?.length || 0}</p>
             </div>
             <Button variant="outline" onClick={() => refetch()} className="rounded-xl h-12 w-12 p-0 border-border/50">
                <RefreshCw className={`w-5 h-5 ${toggleStatusMutation.isPending ? 'animate-spin' : ''}`} />
             </Button>
          </div>
        </div>

        {!myBots || myBots.length === 0 ? (
          <Card className="bg-card/40 border-border/50 rounded-[2rem] p-16 text-center border-dashed">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-foreground">{t.noBots}</p>
                <p className="text-muted-foreground">Get your first professional Discord bot today.</p>
              </div>
              <Button onClick={() => navigate("/marketplace")} className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-2xl px-8 py-6 h-auto text-lg shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                {t.visitMarketplace}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myBots.map((bot) => (
              <Card key={bot.id} className="bg-card/40 border-border/50 rounded-[2rem] overflow-hidden hover:border-cyan-400/30 transition-all group flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center overflow-hidden border border-border/30">
                       {bot.imageUrl ? (
                         <img src={bot.imageUrl} alt={bot.name} className="w-full h-full object-cover" />
                       ) : (
                         <Bot className="w-8 h-8 text-cyan-400/50" />
                       )}
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      bot.status === 'running' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {bot.status === 'running' ? t.running : t.stopped}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight mb-1">{bot.name}</CardTitle>
                    <CardDescription className="text-cyan-400/70 font-bold text-xs uppercase tracking-widest">{bot.type}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-8 line-clamp-3 leading-relaxed">
                    {bot.description}
                  </p>
                  <div className="mt-auto pt-6 border-t border-border/30">
                    <Button 
                      onClick={() => handleToggleStatus(bot.id, bot.status)}
                      disabled={toggleStatusMutation.isPending}
                      className={`w-full gap-3 font-bold rounded-2xl py-6 h-auto transition-all ${
                        bot.status === 'running' 
                        ? 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20' 
                        : 'bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/20'
                      }`}
                    >
                      {bot.status === 'running' ? (
                        <>
                          <Square className="w-4 h-4 fill-current" />
                          {t.stop}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          {t.start}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
