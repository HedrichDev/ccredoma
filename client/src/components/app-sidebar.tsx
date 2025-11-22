import {
  Building2,
  Home,
  LayoutDashboard,
  FileText,
  DollarSign,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import type { RolNombre } from "@shared/schema";
import { signOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AppSidebarProps {
  rol: RolNombre;
  userName?: string;
}

export function AppSidebar({ rol, userName }: AppSidebarProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      setLocation("/login");
    } catch {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  const adminItems = [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Locales", url: "/admin/locales", icon: Building2 },
    { title: "Contratos", url: "/admin/contratos", icon: FileText },
    { title: "Pagos", url: "/admin/pagos", icon: DollarSign },
    { title: "Solicitudes", url: "/admin/solicitudes", icon: MessageSquare },
    { title: "Usuarios", url: "/admin/usuarios", icon: Users },
  ];

  const ownerItems = [
    { title: "Mi Dashboard", url: "/owner/dashboard", icon: Home },
    { title: "Mi Contrato", url: "/owner/contrato", icon: FileText },
    { title: "Mis Pagos", url: "/owner/pagos", icon: DollarSign },
  ];

  const developerItems = [
    { title: "Monitoreo", url: "/developer/dashboard", icon: BarChart3 },
    { title: "Logs del Sistema", url: "/developer/logs", icon: Settings },
  ];

  const items =
    rol === "CentroComercialAdmin"
      ? adminItems
      : rol === "LocalOwner"
        ? ownerItems
        : developerItems;

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <img src="/Favicon.png" alt="CC REDOMA Logo" className="h-8 w-8" />
            <div>
              <h2 className="font-bold text-lg tracking-tight">CC REDOMA</h2>
              <p className="text-xs text-muted-foreground">
                {rol.replace(/([A-Z])/g, " $1").trim()}
              </p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <a
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault();
                        setLocation(item.url);
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {userName && (
          <div className="p-4 text-sm text-muted-foreground">{userName}</div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
