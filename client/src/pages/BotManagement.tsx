import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Play, Square, Settings, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ProfileDropdown from "@/components/ProfileDropdown";
import { toast } from "sonner";

type Language = "ar" | "en";

const translations = {
  ar: {
    title: "إدارة البوتات الخاصة بي",
    description: "تحكم في بوتات Discord التي قمت بشرائها",
    noBots: "لم تقم بشراء أي بوتات بعد. قم بزيارة المتجر لاكتشاف المزيد!",
    visitMarketplace: "زيارة المتجر",
    status: "الحالة",
    actions: "الإجراءات",
    start: "تشغيل",
    stop: "إيقاف",
    running: "يعمل",
    stopped: "متوقف",
    home: "الرئيسية",
    marketplace: "سوق البوتات",
    refresh: "تحديث",
  },
  en: {
    title: "My Bot Management",
    description: "Control and manage your purchased Discord bots",
    noBots: "You haven't purchased any bots yet. Visit the marketplace to discover more!",
    visitMarketplace: "Visit Marketplace",
    status: "Status",
    actions: "Actions",
    start: "Start",
    stop: "Stop",
    running: "Running",
    stopped: "Stopped",
    home: "Home",
    marketplace: "Marketplace",
    refresh: "Refresh",
  },
};

export default function BotManagement() {
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

  if (!isAuthenticated) {
    navigate("/login", { replace: true });
    return null;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark">
        <Loader2 className="animate-spin w-8 h-8 text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="text-2xl font-bold text-foreground">ALPHA</span>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-foreground hover:text-cyan-400 transition-colors font-medium">{t.home}</a>
              <a href="/marketplace" className="text-foreground hover:text-cyan-400 transition-colors font-medium">{t.marketplace}</a>
            </nav>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground tracking-tighter">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
          </div>
          <Button variant="outline" onClick={() => refetch()} className="gap-2 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${toggleStatusMutation.isPending ? 'animate-spin' : ''}`} />
            {t.refresh}
          </Button>
        </div>

        {!myBots || myBots.length === 0 ? (
          <Card className="bg-card/40 border-border/50 rounded-3xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Settings className="w-16 h-16 text-muted-foreground/50" />
              <p className="text-xl text-muted-foreground">{t.noBots}</p>
              <Button onClick={() => navigate("/marketplace")} className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-xl mt-4">
                {t.visitMarketplace}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBots.map((bot) => (
              <Card key={bot.id} className="bg-card/40 border-border/50 rounded-2xl overflow-hidden hover:border-cyan-400/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">{bot.name}</CardTitle>
                      <CardDescription>{bot.type}</CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      bot.status === 'running' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {bot.status === 'running' ? t.running : t.stopped}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    {bot.description}
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleToggleStatus(bot.id, bot.status)}
                      disabled={toggleStatusMutation.isPending}
                      className={`flex-1 gap-2 font-bold rounded-xl ${
                        bot.status === 'running' 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {bot.status === 'running' ? (
                        <>
                          <Square className="w-4 h-4" />
                          {t.stop}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
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
      </div>
    </div>
  );
}
