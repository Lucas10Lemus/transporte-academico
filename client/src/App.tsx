import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import AdminDashboard from "@/pages/AdminDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import DriverDashboard from "@/pages/DriverDashboard";
import RoleSwitcher from "@/pages/RoleSwitcher";
import NotFound from "@/pages/not-found";
import { useState } from "react";

type Role = "ADMIN" | "COORDINATOR" | "DRIVER" | "STUDENT";

function Router({ userRole }: { userRole: Role }) {
  const getDashboard = () => {
    switch (userRole) {
      case "ADMIN":
      case "COORDINATOR":
        return AdminDashboard;
      case "DRIVER":
        return DriverDashboard;
      case "STUDENT":
        return StudentDashboard;
    }
  };

  const Dashboard = getDashboard();

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/routes" component={AdminDashboard} />
      <Route path="/payments" component={AdminDashboard} />
      <Route path="/users" component={AdminDashboard} />
      <Route path="/students" component={AdminDashboard} />
      <Route path="/schedule" component={DriverDashboard} />
      <Route path="/my-route" component={StudentDashboard} />
      <Route path="/settings" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userName] = useState("João Silva");

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  if (!userRole) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RoleSwitcher onRoleSelect={setUserRole} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar userRole={userRole} userName={userName} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto p-6 bg-muted/30">
                <Router userRole={userRole} />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
