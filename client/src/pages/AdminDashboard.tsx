import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import ProfileDropdown from "@/components/ProfileDropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Language = "ar" | "en";

const translations = {
  ar: {
    dashboard: "لوحة التحكم",
    manageBot: "إدارة بوتات Discord",
    addBot: "إضافة بوت",
    editBot: "تعديل البوت",
    addNewBot: "إضافة بوت جديد",
    updateBotDetails: "تحديث تفاصيل البوت",
    createBotListing: "إنشاء قائمة بوت جديدة",
    botName: "اسم البوت",
    enterBotName: "أدخل اسم البوت",
    description: "الوصف",
    describeBotName: "وصف البوت",
    type: "النوع",
    typeExample: "مثال: الإشراف، الأداة، المرح",
    price: "السعر (ريال سعودي)",
    purchaseLink: "رابط الشراء/الدعوة",
    createBot: "إنشاء البوت",
    updateBot: "تحديث البوت",
    cancel: "إلغاء",
    noBots: "لا توجد بوتات حالياً. أنشئ أول بوت لك!",
    createFirstBot: "إنشاء أول بوت",
    edit: "تعديل",
    delete: "حذف",
    deleteConfirm: "هل أنت متأكد من رغبتك في حذف هذا البوت؟",
    accessDenied: "تم رفض الوصول",
    noPermission: "ليس لديك صلاحية للوصول إلى هذه الصفحة",
    home: "الرئيسية",
    marketplace: "سوق البوتات",
  },
  en: {
    dashboard: "Admin Dashboard",
    manageBot: "Manage your Discord bots",
    addBot: "Add Bot",
    editBot: "Edit Bot",
    addNewBot: "Add New Bot",
    updateBotDetails: "Update bot details",
    createBotListing: "Create a new bot listing",
    botName: "Bot Name",
    enterBotName: "Enter bot name",
    description: "Description",
    describeBotName: "Describe your bot",
    type: "Type",
    typeExample: "e.g., Moderation, Utility, Fun",
    price: "Price (SAR)",
    purchaseLink: "Purchase/Invite Link",
    createBot: "Create Bot",
    updateBot: "Update Bot",
    cancel: "Cancel",
    noBots: "No bots yet. Create your first bot!",
    createFirstBot: "Create First Bot",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this bot?",
    accessDenied: "Access Denied",
    noPermission: "You don't have permission to access this page.",
    home: "Home",
    marketplace: "Marketplace",
  },
};

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
  }, []);

  const t = translations[language];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    price: "",
    purchaseLink: "",
  });

  // Queries and mutations
  const { data: bots, isLoading, refetch } = trpc.bots.list.useQuery();
  const createBotMutation = trpc.bots.create.useMutation();
  const updateBotMutation = trpc.bots.update.useMutation();
  const deleteBotMutation = trpc.bots.delete.useMutation();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">{t.accessDenied}</h2>
          <p className="text-muted-foreground">{t.noPermission}</p>
        </div>
      </div>
    );
  }

  const handleOpenDialog = (bot?: any) => {
    if (bot) {
      setEditingBot(bot);
      setFormData({
        name: bot.name,
        description: bot.description || "",
        type: bot.type,
        price: (bot.price / 100).toString(),
        purchaseLink: bot.purchaseLink,
      });
    } else {
      setEditingBot(null);
      setFormData({
        name: "",
        description: "",
        type: "",
        price: "",
        purchaseLink: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBot(null);
    setFormData({
      name: "",
      description: "",
      type: "",
      price: "",
      purchaseLink: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const price = Math.round(parseFloat(formData.price) * 100);

      if (editingBot) {
        await updateBotMutation.mutateAsync({
          id: editingBot.id,
          name: formData.name,
          description: formData.description,
          type: formData.type,
          price,
          purchaseLink: formData.purchaseLink,
        });
        toast.success("Bot updated successfully!");
      } else {
        await createBotMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          price,
          purchaseLink: formData.purchaseLink,
        });
        toast.success("Bot created successfully!");
      }

      handleCloseDialog();
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save bot");
    }
  };

  const handleDelete = async (botId: number) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      await deleteBotMutation.mutateAsync({ id: botId });
      toast.success("Bot deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete bot");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="text-2xl font-bold text-foreground">ALPHA</span>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-foreground hover:text-secondary transition-colors font-medium">
                {t.home}
              </a>
              <a href="/marketplace" className="text-foreground hover:text-secondary transition-colors font-medium">
                {t.marketplace}
              </a>
            </nav>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">{t.dashboard}</h1>
            <p className="text-muted-foreground">{t.manageBot}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                {t.addBot}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBot ? t.editBot : t.addNewBot}</DialogTitle>
                <DialogDescription>
                  {editingBot ? t.updateBotDetails : t.createBotListing}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.botName}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.enterBotName}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t.describeBotName}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">{t.type}</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder={t.typeExample}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">{t.price}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="purchaseLink">{t.purchaseLink}</Label>
                  <Input
                    id="purchaseLink"
                    type="url"
                    value={formData.purchaseLink}
                    onChange={(e) => setFormData({ ...formData, purchaseLink: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingBot ? t.updateBot : t.createBot}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseDialog} className="flex-1">
                    {t.cancel}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!bots || bots.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">{t.noBots}</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>{t.createFirstBot}</Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bots.map((bot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-foreground">{bot.name}</CardTitle>
                      <CardDescription>{bot.type}</CardDescription>
                    </div>
                    <div className="text-2xl font-bold text-secondary">{(bot.price / 100).toFixed(2)} SAR</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{bot.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(bot)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      {t.edit}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(bot.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t.delete}
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
