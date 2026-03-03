import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: userBots, isLoading } = trpc.userBots.list.useQuery();
  const { mutate: updateStatus } = trpc.userBots.updateStatus.useMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!userBots || userBots.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Bots</CardTitle>
            <CardDescription>You haven't purchased any bots yet</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Go to Marketplace</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeBotsCount = userBots.filter((ub) => ub.status === "running").length;

  const handleToggleBot = (userBotId: number, currentStatus: string) => {
    const newStatus = currentStatus === "running" ? "stopped" : "running";
    updateStatus({ userBotId, status: newStatus as "running" | "stopped" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your purchased bots</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userBots.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Bots you own</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeBotsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently running</p>
            </CardContent>
          </Card>
        </div>

        {/* Bots List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Bots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userBots.map((userBot) => (
              <Card key={userBot.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">Bot #{userBot.botId}</CardTitle>
                      <CardDescription>
                        Purchased on {userBot.purchaseDate ? new Date(userBot.purchaseDate).toLocaleDateString() : "N/A"}
                      </CardDescription>
                    </div>
                    <Badge variant={userBot.status === "running" ? "default" : "secondary"}>
                      {userBot.status === "running" ? "🟢 Running" : "🔴 Stopped"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Status:</strong> {userBot.status}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Created:</strong> {userBot.createdAt ? new Date(userBot.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={userBot.status === "running" ? "destructive" : "default"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleToggleBot(userBot.id, userBot.status)}
                    >
                      {userBot.status === "running" ? "Stop" : "Start"}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
