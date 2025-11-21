import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { ProtectedRoute } from "./components/protected-route";

import PublicLanding from "./pages/public-landing";
import PublicCatalog from "./pages/catalog";
import ContactPage from "./pages/contact";
import AboutPage from "./pages/about";
import RentSimulatorPage from "./pages/rent-simulator";
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/dashboard";
import AdminLocales from "./pages/admin/locales";
import AdminContratos from "./pages/admin/contratos";
import AdminSolicitudes from "./pages/admin/solicitudes";
import OwnerApprovalsPage from "./pages/admin/owner-approvals";
import FinancialReportsPage from "./pages/admin/financial-reports";
import RatesPromotionsPage from "./pages/admin/rates-promotions";
import OwnerDashboard from "./pages/owner/dashboard";
import OwnerMaintenanceRequestsPage from "./pages/owner/maintenance-requests";
import DeveloperDashboard from "./pages/developer/dashboard";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={PublicLanding} />
      <Route path="/catalog" component={PublicCatalog} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/rent-simulator" component={RentSimulatorPage} />
      <Route path="/login" component={Login} />

      {/* Admin Routes */}
      <ProtectedRoute
        path="/admin/dashboard"
        component={AdminDashboard}
        requiredRol="CentroComercialAdmin"
      />
      <ProtectedRoute
        path="/admin/locales"
        component={AdminLocales}
        requiredRol="CentroComercialAdmin"
      />
      <ProtectedRoute
        path="/admin/contratos"
        component={AdminContratos}
        requiredRol="CentroComercialAdmin"
      />
      <ProtectedRoute
        path="/admin/solicitudes"
        component={AdminSolicitudes}
        requiredRol="CentroComercialAdmin"
      />
      <ProtectedRoute
        path="/admin/owner-approvals"
        component={OwnerApprovalsPage}
        requiredRol="CentroComercialAdmin"
      />
      <ProtectedRoute
        path="/admin/financial-reports"
        component={FinancialReportsPage}
        requiredRol="CentroComercialAdmin"
      />
      <ProtectedRoute
        path="/admin/rates-promotions"
        component={RatesPromotionsPage}
        requiredRol="CentroComercialAdmin"
      />

      {/* Owner Routes */}
      <ProtectedRoute
        path="/owner/dashboard"
        component={OwnerDashboard}
        requiredRol="LocalOwner"
      />
      <ProtectedRoute
        path="/owner/maintenance-requests"
        component={OwnerMaintenanceRequestsPage}
        requiredRol="LocalOwner"
      />

      {/* Developer Routes */}
      <ProtectedRoute
        path="/developer/dashboard"
        component={DeveloperDashboard}
        requiredRol="SystemDeveloper"
      />

      {/* Not Found */}
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
