import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Route, 
  DollarSign, 
  Users, 
  Settings,
  Bus,
  GraduationCap,
  Shield
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Role = "ADMIN" | "COORDINATOR" | "DRIVER" | "STUDENT";

interface AppSidebarProps {
  userRole: Role;
  userName: string;
}

export function AppSidebar({ userRole, userName }: AppSidebarProps) {
  const [location] = useLocation();

  const roleIcons = {
    ADMIN: Shield,
    COORDINATOR: Users,
    DRIVER: Bus,
    STUDENT: GraduationCap,
  };

  const adminItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Routes", url: "/routes", icon: Route },
    { title: "Payments", url: "/payments", icon: DollarSign },
    { title: "Users", url: "/users", icon: Users },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const coordinatorItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Routes", url: "/routes", icon: Route },
    { title: "Students", url: "/students", icon: GraduationCap },
    { title: "Payments", url: "/payments", icon: DollarSign },
  ];

  const driverItems = [
    { title: "Today's Route", url: "/", icon: Route },
    { title: "Schedule", url: "/schedule", icon: LayoutDashboard },
    { title: "Students", url: "/students", icon: GraduationCap },
  ];

  const studentItems = [
    { title: "Home", url: "/", icon: LayoutDashboard },
    { title: "My Route", url: "/my-route", icon: Route },
    { title: "Payments", url: "/payments", icon: DollarSign },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case "ADMIN":
        return adminItems;
      case "COORDINATOR":
        return coordinatorItems;
      case "DRIVER":
        return driverItems;
      case "STUDENT":
        return studentItems;
    }
  };

  const RoleIcon = roleIcons[userRole];
  const menuItems = getMenuItems();

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Bus className="h-8 w-8 text-primary" />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg truncate">TransportHub</h2>
            <p className="text-xs text-muted-foreground truncate">Academic Transport</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <Badge variant="secondary" className="text-xs">
              <RoleIcon className="h-3 w-3 mr-1" />
              {userRole}
            </Badge>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
