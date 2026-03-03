import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

const ALPHA_LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663393177212/ctrFBa9TUqFriciGXSA6RL/alpha_logo_imgur_aa3f1fac.webp";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleDiscordLogin = () => {
    window.location.href = "/api/discord/login";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <img src={ALPHA_LOGO_URL} alt="Alpha Store" className="w-32 h-32 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 text-foreground tracking-tighter">Login</h1>
          <p className="text-lg text-muted-foreground">Sign in to manage your bots</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleDiscordLogin}
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3671a19.8062 19.8062 0 00-4.8851-1.5152.074.074 0 00-.0784.0371c-.211.3671-.444.8427-.607 1.2177-.56-.0841-1.116-.0841-1.67-.0841-.554 0-1.11 0-1.67.0841-.163-.3875-.405-.8506-.618-1.2177a.077.077 0 00-.0785-.037 19.7514 19.7514 0 00-4.8852 1.515.07.07 0 00-.0329.0318C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.0315.0553c1.5 1.0961 2.9159 1.7667 4.3159 2.1973a.08.08 0 00.086-.0286c.462-.6171.873-1.2653 1.215-1.9475a.077.077 0 00-.0424-.1082c-.635-.2381-1.235-.5244-1.829-.8425a.077.077 0 01-.0076-.1277c.122-.0918.245-.1875.363-.2852a.077.077 0 01.079-.0105c3.858 1.7625 8.04 1.7625 11.896 0a.077.077 0 01.079.009c.118.0977.242.1934.365.2857a.077.077 0 01-.007.1279c-.594.3181-1.194.6044-1.829.8425a.077.077 0 00-.042.1083c.342.6823.753 1.3304 1.215 1.9475a.076.076 0 00.085.0286c1.4-.4306 2.816-1.1012 4.315-2.1973a.077.077 0 00.032-.0552c.504-4.544-.847-8.505-3.554-12.0383a.05.05 0 00-.031-.0169zM8.02 15.3312c-1.1825 0-2.1569-.9718-2.1569-2.1771 0-1.2053.9518-2.1771 2.1569-2.1771 1.2051 0 2.1779.9718 2.1569 2.1771 0 1.2053-.9518 2.1771-2.1569 2.1771zm7.9748 0c-1.1825 0-2.1569-.9718-2.1569-2.1771 0-1.2053.9518-2.1771 2.1569-2.1771 1.2051 0 2.1779.9718 2.1569 2.1771 0 1.2053-.9518 2.1771-2.1569 2.1771z" />
            </svg>
            Login with Discord
          </button>

          <div className="text-center text-sm text-muted-foreground">
            <p>By signing in, you agree to our Terms of Service</p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-card/50 rounded-2xl border border-border/50">
          <h3 className="font-bold text-foreground mb-3">Secure Access</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              Direct Discord integration
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              No password required
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              Instant profile sync
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
