import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAppContext } from "./contexts/AppContext";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

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
  return (
    <AppContent />
  );
}

export default App;
