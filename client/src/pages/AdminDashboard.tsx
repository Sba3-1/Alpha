import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Edit2, UserPlus, Shield, Bot, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ProfileDropdown from "@/components/ProfileDropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Language = "ar" | "en";

const translations = {
  ar: {
    dashboard: "لوحة التحكم للمشرف",
    manageBots: "إدارة البوتات",
    manageAdmins: "إدارة المشرفين",
    addBot: "إضافة بوت",
    editBot: "تعديل البوت",
    botName: "اسم البوت",
    description: "الوصف",
    type: "النوع",
    price: "السعر (SAR)",
    purchaseLink: "رابط الشراء",
    inviteLink: "رابط الانفايت",
    botToken: "توكن البوت (Discord Token)",
    assignTo: "تعيين لمستخدم (اختياري)",
    none: "لا يوجد",
    save: "حفظ",
    cancel: "إلغاء",
    deleteConfirm: "هل أنت متأكد من الحذف؟",
    adminUsername: "اسم مستخدم ديسكورد",
    promote: "ترقية لمشرف",
    demote: "إزالة الإشراف",
    accessDenied: "تم رفض الوصول",
    home: "الرئيسية",
    marketplace: "المتجر",
    imageUrl: "رابط الصورة",
    profileImage: "صورة البروفايل",
    soldOut: "نفذت الكمية",
    available: "متوفر",
  },
  en: {
    dashboard: "Admin Dashboard",
    manageBots: "Manage Bots",
    manageAdmins: "Manage Admins",
    addBot: "Add Bot",
    editBot: "Edit Bot",
    botName: "Bot Name",
    description: "Description",
    type: "Type",
    price: "Price (SAR)",
    purchaseLink: "Purchase Link",
    inviteLink: "Invite Link",
    botToken: "Bot Token (Discord Token)",
    assignTo: "Assign to User (Optional)",
    none: "None",
    save: "Save",
    cancel: "Cancel",
    deleteConfirm: "Are you sure you want to delete?",
    adminUsername: "Discord Username",
    promote: "Promote to Admin",
    demote: "Demote from Admin",
    accessDenied: "Access Denied",
    home: "Home",
    marketplace: "Marketplace",
    imageUrl: "Image URL",
    profileImage: "Profile Image",
    soldOut: "Sold Out",
    available: "Available",
  },
};

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"bots" | "admins">("bots");
  const [isBotDialogOpen, setIsBotDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
  }, []);

  const t = translations[language];

  const [botFormData, setBotFormData] = useState({
    name: "",
    description: "",
    type: "Moderation",
    price: "",
    purchaseLink: "",
    inviteLink: "",
    imageUrl: "",
    token: "",
    userId: "none",
    soldOut: 0,
  });

  const [adminUsername, setAdminUsername] = useState("");

  const { data: bots, isLoading: botsLoading, refetch: refetchBots } = trpc.bots.list.useQuery();
  const { data: admins, refetch: refetchAdmins } = trpc.admin.listAdmins.useQuery();
  const { data: usersList } = trpc.admin.listUsers.useQuery();
  
  const createBotMutation = trpc.bots.create.useMutation();
  const updateBotMutation = trpc.bots.update.useMutation();
  const deleteBotMutation = trpc.bots.delete.useMutation();
  const promoteMutation = trpc.admin.promoteByUsername.useMutation();
  const demoteMutation = trpc.admin.demoteFromAdmin.useMutation();

  if (!isAuthenticated || (user?.role !== "admin" && user?.discordUsername !== "6uvu" && user?.discordUsername !== "5mcm")) {
    if (isAuthenticated) return <div className="min-h-screen flex items-center justify-center dark text-foreground"><h1>{t.accessDenied}</h1></div>;
    navigate("/login");
    return null;
  }

  const handleOpenBotDialog = (bot?: any) => {
    if (bot) {
      setEditingBot(bot);
      setBotFormData({
        name: bot.name,
        description: bot.description || "",
        type: bot.type,
        price: (bot.price / 100).toString(),
        purchaseLink: bot.purchaseLink,
        inviteLink: bot.inviteLink || "",
        imageUrl: bot.imageUrl || "",
        token: bot.token || "",
        userId: bot.userId ? bot.userId.toString() : "none",
        soldOut: bot.soldOut,
      });
    } else {
      setEditingBot(null);
      setBotFormData({
        name: "",
        description: "",
        type: "Moderation",
        price: "",
        purchaseLink: "",
        inviteLink: "",
        imageUrl: "",
        token: "",
        userId: "none",
        soldOut: 0,
      });
    }
    setIsBotDialogOpen(true);
  };

  const handleBotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const price = Math.round(parseFloat(botFormData.price) * 100);
      const payload = {
        ...botFormData,
        price,
        userId: botFormData.userId === "none" ? undefined : parseInt(botFormData.userId),
      };

      if (editingBot) {
        await updateBotMutation.mutateAsync({ id: editingBot.id, ...payload });
        toast.success("Bot updated!");
      } else {
        await createBotMutation.mutateAsync(payload);
        toast.success("Bot created!");
      }
      setIsBotDialogOpen(false);
      refetchBots();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteBot = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await deleteBotMutation.mutateAsync({ id });
      toast.success("Bot deleted!");
      refetchBots();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePromoteAdmin = async () => {
    if (!adminUsername) return;
    try {
      await promoteMutation.mutateAsync({ username: adminUsername });
      toast.success("Admin added!");
      setAdminUsername("");
      refetchAdmins();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen dark text-foreground bg-background">
      <header className="border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tighter">ALPHA ADMIN</span>
            <nav className="flex gap-6">
              <button onClick={() => setActiveTab("bots")} className={`font-bold transition-colors ${activeTab === "bots" ? "text-cyan-400" : "text-muted-foreground hover:text-foreground"}`}>{t.manageBots}</button>
              <button onClick={() => setActiveTab("admins")} className={`font-bold transition-colors ${activeTab === "admins" ? "text-cyan-400" : "text-muted-foreground hover:text-foreground"}`}>{t.manageAdmins}</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-bold hover:text-cyan-400 transition-colors">{t.home}</a>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {activeTab === "bots" ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
                <Bot className="w-10 h-10 text-cyan-400" />
                {t.manageBots}
              </h1>
              <Button onClick={() => handleOpenBotDialog()} className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-xl gap-2">
                <Plus className="w-4 h-4" /> {t.addBot}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bots?.map(bot => (
                <Card key={bot.id} className="bg-card/40 border-border/50 rounded-2xl overflow-hidden hover:border-cyan-400/30 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-xl font-bold">{bot.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenBotDialog(bot)} className="h-8 w-8 text-muted-foreground hover:text-cyan-400">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBot(bot.id)} className="h-8 w-8 text-muted-foreground hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{bot.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{bot.description}</p>
                      <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                        <span className="text-cyan-400 font-bold">{(bot.price / 100).toFixed(2)} SAR</span>
                        <span className="text-xs text-muted-foreground">Owner ID: {bot.userId || "None"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
              <Shield className="w-10 h-10 text-cyan-400" />
              {t.manageAdmins}
            </h1>
            
            <Card className="bg-card/40 border-border/50 rounded-3xl p-8">
              <div className="flex gap-4 mb-8">
                <div className="flex-1">
                  <Label className="font-bold mb-2 block">{t.adminUsername}</Label>
                  <Input value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} placeholder="e.g. username" className="bg-muted/30 border-none rounded-xl" />
                </div>
                <Button onClick={handlePromoteAdmin} className="mt-auto bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-xl gap-2">
                  <UserPlus className="w-4 h-4" /> {t.promote}
                </Button>
              </div>

              <div className="space-y-4">
                {admins?.map(admin => (
                  <div key={admin.id} className="flex justify-between items-center p-4 bg-muted/20 rounded-2xl border border-border/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center font-bold text-cyan-400">
                        {admin.discordUsername?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold">@{admin.discordUsername}</p>
                        <p className="text-xs text-muted-foreground">ID: {admin.id}</p>
                      </div>
                    </div>
                    {admin.discordUsername !== "6uvu" && (
                      <Button variant="ghost" size="sm" onClick={async () => {
                        try {
                          await demoteMutation.mutateAsync({ userId: admin.id });
                          toast.success("Admin demoted!");
                          refetchAdmins();
                        } catch (err: any) { toast.error(err.message); }
                      }} className="text-red-400 hover:bg-red-500/10 rounded-xl">{t.demote}</Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={isBotDialogOpen} onOpenChange={setIsBotDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{editingBot ? t.editBot : t.addBot}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBotSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">{t.botName}</Label>
                <Input value={botFormData.name} onChange={e => setBotFormData({...botFormData, name: e.target.value})} className="bg-muted/30 border-none rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">{t.type}</Label>
                <Input value={botFormData.type} onChange={e => setBotFormData({...botFormData, type: e.target.value})} className="bg-muted/30 border-none rounded-xl" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">{t.description}</Label>
              <Textarea value={botFormData.description} onChange={e => setBotFormData({...botFormData, description: e.target.value})} className="bg-muted/30 border-none rounded-xl min-h-[100px]" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">{t.price}</Label>
                <Input type="number" value={botFormData.price} onChange={e => setBotFormData({...botFormData, price: e.target.value})} className="bg-muted/30 border-none rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">{t.purchaseLink}</Label>
                <Input value={botFormData.purchaseLink} onChange={e => setBotFormData({...botFormData, purchaseLink: e.target.value})} className="bg-muted/30 border-none rounded-xl" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">{t.inviteLink}</Label>
              <Input value={botFormData.inviteLink} onChange={e => setBotFormData({...botFormData, inviteLink: e.target.value})} className="bg-muted/30 border-none rounded-xl" placeholder="https://discord.com/api/oauth2/authorize?..." />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">{t.profileImage}</Label>
              <Input value={botFormData.imageUrl} onChange={e => setBotFormData({...botFormData, imageUrl: e.target.value})} className="bg-muted/30 border-none rounded-xl" placeholder="https://example.com/bot-image.png" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-cyan-400">{t.botToken}</Label>
              <Input value={botFormData.token} onChange={e => setBotFormData({...botFormData, token: e.target.value})} className="bg-cyan-400/10 border-cyan-400/30 rounded-xl focus:border-cyan-400" placeholder="MTAx..." />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">{t.assignTo}</Label>
              <Select value={botFormData.userId} onValueChange={val => setBotFormData({...botFormData, userId: val})}>
                <SelectTrigger className="bg-muted/30 border-none rounded-xl">
                  <SelectValue placeholder={t.none} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  <SelectItem value="none">{t.none}</SelectItem>
                  {usersList?.map(u => (
                    <SelectItem key={u.id} value={u.id.toString()}>@{u.discordUsername} ({u.id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsBotDialogOpen(false)} className="flex-1 rounded-xl font-bold">{t.cancel}</Button>
              <Button type="submit" className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-xl">{t.save}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
