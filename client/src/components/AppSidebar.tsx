import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Map,
  Users,
  CreditCard,
  Calendar,
  Bus,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type AppSidebarProps = {
  userRole?: "ADMIN" | "COORDINATOR" | "DRIVER" | "STUDENT";
  userName?: string;
};

export function AppSidebar({ userRole, userName }: AppSidebarProps) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const getMenuItems = () => {
    switch (userRole) {
      case "ADMIN":
      case "COORDINATOR":
        return [
          { title: "Visão Geral", icon: LayoutDashboard, url: "/" },
          { title: "Rotas", icon: Map, url: "/routes" },
          { title: "Alunos", icon: Users, url: "/students" }, // Alterado para /students
          { title: "Financeiro", icon: CreditCard, url: "/payments" },
          { title: "Configurações", icon: Settings, url: "/settings" },
        ];
      case "DRIVER":
        return [
          { title: "Lista do Dia", icon: Bus, url: "/schedule" },
          { title: "Minhas Rotas", icon: Map, url: "/routes" }, // Apenas visualização
        ];
      case "STUDENT":
        return [
          { title: "Minha Presença", icon: Calendar, url: "/my-route" },
          { title: "Pagamentos", icon: CreditCard, url: "/payments" },
        ];
      default:
        return [];
    }
  };

  const items = getMenuItems();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Bus className="h-6 w-6" />
          <span>Transporte</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Olá, {userName?.split(" ")[0]}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={location === item.url}>
                <Link href={item.url}>
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" 
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair do Sistema
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}