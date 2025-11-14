import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/components/dashboard-layout";

import PublicLanding from "@/pages/public-landing";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLocales from "@/pages/admin/locales";
import AdminContratos from "@/pages/admin/contratos";
import AdminSolicitudes from "@/pages/admin/solicitudes";
import OwnerDashboard from "@/pages/owner/dashboard";
import DeveloperDashboard from "@/pages/developer/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PublicLanding} />
      <Route path="/login" component={Login} />
      
      <Route path="/admin/dashboard">
        {() => (
          <DashboardLayout requiredRol="CentroComercialAdmin">
            <AdminDashboard />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/locales">
        {() => (
          <DashboardLayout requiredRol="CentroComercialAdmin">
            <AdminLocales />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/contratos">
        {() => (
          <DashboardLayout requiredRol="CentroComercialAdmin">
            <AdminContratos />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/solicitudes">
        {() => (
          <DashboardLayout requiredRol="CentroComercialAdmin">
            <AdminSolicitudes />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/owner/dashboard">
        {() => (
          <DashboardLayout requiredRol="LocalOwner">
            <OwnerDashboard />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/developer/dashboard">
        {() => (
          <DashboardLayout requiredRol="SystemDeveloper">
            <DeveloperDashboard />
          </DashboardLayout>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
