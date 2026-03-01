import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ShoppingCart, Settings, LogOut } from "lucide-react";

const ALPHA_LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663393177212/ctrFBa9TUqFriciGXSA6RL/alpha-logo_8d30b071.png";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-border sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={ALPHA_LOGO_URL} alt="Alpha Store" className="w-10 h-10" />
            <span className="text-2xl font-bold text-foreground">ALPHA</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/marketplace">
              <a className="text-foreground hover:text-secondary transition-colors font-medium">
                Marketplace
              </a>
            </Link>

            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <a className="text-foreground hover:text-secondary transition-colors font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Admin
                </a>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="gap-2"
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="mb-8 flex justify-center">
              <img src={ALPHA_LOGO_URL} alt="Alpha Store" className="w-32 h-32" />
            </div>

            <h1 className="text-7xl font-bold mb-6 text-foreground leading-tight">
              ALPHA STORE
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Premium Discord bots engineered with precision. Discover, purchase, and integrate powerful automation tools for your server.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/marketplace">
                <a>
                  <Button size="lg" className="gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Browse Bots
                  </Button>
                </a>
              </Link>

            {!isAuthenticated && (
              <a href="/login">
                <Button
                  variant="outline"
                  size="lg"
                >
                  Sign In with Discord
                </Button>
              </a>
            )}
            </div>
          </div>

          {/* Blueprint Grid Accent */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "PRECISION",
                description: "Engineered with technical excellence and mathematical precision",
                icon: "⚙️",
              },
              {
                title: "SECURE",
                description: "Discord OAuth authentication with verified account linking",
                icon: "🔐",
              },
              {
                title: "SCALABLE",
                description: "Built for growth with enterprise-grade infrastructure",
                icon: "📈",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 border border-border rounded-lg hover:border-secondary transition-colors group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground tech-label">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blueprint Geometric Accent Section */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "BOTS", value: "∞" },
              { label: "USERS", value: "∞" },
              { label: "UPTIME", value: "99.9%" },
              { label: "SUPPORT", value: "24/7" },
            ].map((stat, idx) => (
              <div key={idx} className="py-4">
                <div className="text-3xl font-bold text-secondary mb-2">{stat.value}</div>
                <div className="tech-label text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Alpha Store. All rights reserved. | Engineered with precision.</p>
        </div>
      </footer>
    </div>
  );
}
