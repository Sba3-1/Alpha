import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import { useAppContext } from "./contexts/AppContext";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { theme } = useAppContext();

  return (
    <ErrorBoundary>
      <div className={theme === "dark" ? "dark" : ""}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return <AppContent />;
}

export default App;
