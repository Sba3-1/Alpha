import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShoppingCart, ExternalLink } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

import { useState } from "react";
import { Link } from "wouter";

export default function Marketplace() {
  const { user, isAuthenticated } = useAuth();
  const { data: bots, isLoading, error } = trpc.bots.list.useQuery();
  const [selectedBot, setSelectedBot] = useState<number | null>(null);

  const handlePurchase = (botId: number) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    setSelectedBot(botId);
    alert("Payment integration coming soon! Please check back later.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error loading bots</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold text-foreground hover:text-secondary transition-colors">
              ALPHA
            </a>
          </Link>
          <div className="flex gap-4">
            <Link href="/">
              <a className="text-foreground hover:text-secondary transition-colors font-medium">
                Home
              </a>
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <a className="text-foreground hover:text-secondary transition-colors font-medium">
                  Admin
                </a>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4 text-foreground">BOT MARKETPLACE</h1>
          <p className="text-lg text-muted-foreground">
            Discover and purchase premium Discord bots
          </p>
        </div>

        {!bots || bots.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-muted-foreground mb-4">No bots available yet. Check back soon!</p>
            <Link href="/">
              <a>
                <Button variant="outline">Return to Home</Button>
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <Card
                key={bot.id}
                className="flex flex-col h-full hover:shadow-lg transition-all hover:border-secondary"
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-2xl text-foreground">{bot.name}</CardTitle>
                      <CardDescription className="text-xs tech-label mt-2">
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
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <span className="text-xs tech-label">PRICE</span>
                      <span className="text-3xl font-bold text-secondary">
                        {(bot.price / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">SAR</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        className="flex-1 gap-2"
                        onClick={() => handlePurchase(bot.id)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Purchase
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(bot.purchaseLink, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
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
