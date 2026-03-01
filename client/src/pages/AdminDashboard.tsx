import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<any>(null);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
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
    if (!confirm("Are you sure you want to delete this bot?")) return;

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your Discord bots</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBot ? "Edit Bot" : "Add New Bot"}</DialogTitle>
                <DialogDescription>
                  {editingBot ? "Update bot details" : "Create a new bot listing"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Bot Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter bot name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your bot"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Moderation, Utility, Fun"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (SAR)</Label>
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
                  <Label htmlFor="purchaseLink">Purchase/Invite Link</Label>
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
                    {editingBot ? "Update Bot" : "Create Bot"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseDialog} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!bots || bots.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 mb-4">No bots yet. Create your first bot!</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>Create First Bot</Button>
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
                      <CardTitle>{bot.name}</CardTitle>
                      <CardDescription>{bot.type}</CardDescription>
                    </div>
                    <div className="text-2xl font-bold">{(bot.price / 100).toFixed(2)} SAR</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{bot.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(bot)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(bot.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
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
