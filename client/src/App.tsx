import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Páginas
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import DriverDashboard from "@/pages/DriverDashboard";
import RoutesPage from "@/pages/RoutesPage"; // Importe a página de rotas
import StudentsPage from "@/pages/StudentsPage"; // Importe a página de alunos
import NotFound from "@/pages/not-found";
import PaymentsPage from "@/pages/PaymentsPage";
import SettingsPage from "@/pages/SettingsPage";

function Router() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return <Login />;
  }

  // Define qual é a "Home" de cada usuário
  const getDashboard = () => {
    switch (user.role) {
      case "ADMIN":
      case "COORDINATOR":
        return AdminDashboard;
      case "DRIVER":
        return DriverDashboard;
      case "STUDENT":
        return StudentDashboard;
      default:
        return Login;
    }
  };

  const Dashboard = getDashboard();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-muted/10">
        <AppSidebar userRole={user.role} userName={user.fullName} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <Route path="/" component={Dashboard} />
              
              {/* Rotas de Admin */}
              <Route path="/routes" component={RoutesPage} />     {/* Página de Rotas Real */}
              <Route path="/students" component={StudentsPage} /> {/* Página de Alunos Real */}
              <Route path="/payments" component={PaymentsPage} />  {/* Página de Pagamentos Real */}
              <Route path="/settings" component={SettingsPage} />
              
              {/* Rotas Específicas */}
              <Route path="/schedule" component={DriverDashboard} />
              <Route path="/my-route" component={StudentDashboard} />
              
              {/* Fallbacks (Páginas ainda não criadas) */}
              <Route path="/users" component={AdminDashboard} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;