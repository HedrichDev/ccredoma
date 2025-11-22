import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { ProtectedRoute } from "./components/protected-route";
import { PublicLayout } from "./components/public-layout"; // Import PublicLayout

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
      <Route path="/login" component={Login} /> {/* Direct Login */}
      <Route path="/"> {/* Grouped public routes under PublicLayout */}
        <PublicLayout>
          <Switch>
            <Route path="/" component={PublicLanding} />
            <Route path="/catalog" component={PublicCatalog} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/rent-simulator" component={RentSimulatorPage} />
            <Route component={NotFound} /> {/* Not Found for public paths inside PublicLayout */}
          </Switch>
        </PublicLayout>
      </Route>
      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <ProtectedRoute
          component={AdminDashboard}
          requiredRol="CentroComercialAdmin"
        />
      </Route>
      <Route path="/admin/locales">
        <ProtectedRoute
          component={AdminLocales}
          requiredRol="CentroComercialAdmin"
        />
      </Route>
      <Route path="/admin/contratos">
        <ProtectedRoute
          component={AdminContratos}
          requiredRol="CentroComercialAdmin"
        />
      </Route>
      <Route path="/admin/solicitudes">
        <ProtectedRoute
          component={AdminSolicitudes}
          requiredRol="CentroComercialAdmin"
        />
      </Route>
      <Route path="/admin/owner-approvals">
        <ProtectedRoute
          component={OwnerApprovalsPage}
          requiredRol="CentroComercialAdmin"
        />
      </Route>
      <Route path="/admin/financial-reports">
        <ProtectedRoute
          component={FinancialReportsPage}
          requiredRol="CentroComercialAdmin"
        />
      </Route>
      <Route path="/admin/rates-promotions">
        <ProtectedRoute
          component={RatesPromotionsPage}
          requiredRol="CentroComercialAdmin"
        />
      </Route>
      {/* Owner Routes */}
      <Route path="/owner/dashboard">
        <ProtectedRoute component={OwnerDashboard} requiredRol="LocalOwner" />
      </Route>
      <Route path="/owner/maintenance-requests">
        <ProtectedRoute
          component={OwnerMaintenanceRequestsPage}
          requiredRol="LocalOwner"
        />
      </Route>
      {/* Developer Routes */}
      <Route path="/developer/dashboard">
        <ProtectedRoute
          component={DeveloperDashboard}
          requiredRol="SystemDeveloper"
        />
      </Route>
      {/* Not Found - This will catch any routes not matched by the specific public or protected routes */}
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
