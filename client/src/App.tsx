import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Footer from "./components/Footer";
import BotManagement from "./pages/BotManagement";
import UserDashboard from "./pages/UserDashboard";
import FreelanceCertificate from "./pages/FreelanceCertificate";
import InfoPage from "./pages/InfoPage";
import Terms from "./pages/Terms";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/bot-management"} component={BotManagement} />
      <Route path={"/dashboard"} component={UserDashboard} />
      <Route path={"/certificate"} component={FreelanceCertificate} />
      <Route path={"/info/:type"} component={InfoPage} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable={false}>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
