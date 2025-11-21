import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import {
  Building2,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Shield,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type {
  LocalComercial,
  ContratoAlquiler,
  PagoAlquiler,
  EstadoPago,
} from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const { data: locales } = useQuery<LocalComercial[]>({
    queryKey: ["/api/locales"],
  });

  const { data: contratos } = useQuery<ContratoAlquiler[]>({
    queryKey: ["/api/contratos"],
  });

  const { data: pagos } = useQuery<PagoAlquiler[]>({
    queryKey: ["/api/pagos"],
  });

  const totalLocales = locales?.length || 0;
  const localesOcupados =
    locales?.filter((l) => l.estado === "ocupado").length || 0;
  const localesDisponibles =
    locales?.filter((l) => l.estado === "disponible").length || 0;
  const tasaOcupacion =
    totalLocales > 0
      ? ((localesOcupados / totalLocales) * 100).toFixed(0)
      : "0";

  const pagosVencidos =
    pagos?.filter((p) => p.estadoPago === "vencido").length || 0;

  const ingresosMensuales =
    pagos
      ?.filter((p) => p.estadoPago === "pagado")
      .reduce((sum, p) => sum + Number(p.monto), 0) || 0;

  const contratosActivos =
    contratos?.filter((c) => c.estadoContrato === "activo").length || 0;

  const recentPagos = pagos?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Dashboard Administrativo
        </h1>
        <p className="text-muted-foreground">
          Vista general del centro comercial
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Tasa de Ocupación"
          value={`${tasaOcupacion}%`}
          icon={TrendingUp}
          description={`${localesOcupados} de ${totalLocales} locales ocupados`}
        />
        <MetricCard
          title="Ingresos Mensuales"
          value={`$${ingresosMensuales.toLocaleString()}`}
          icon={DollarSign}
          description="Total de pagos recibidos"
        />
        <MetricCard
          title="Locales Disponibles"
          value={localesDisponibles}
          icon={Building2}
          description="Listos para alquilar"
        />
        <MetricCard
          title="Pagos Vencidos"
          value={pagosVencidos}
          icon={AlertCircle}
          description="Requieren atención"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contratos Activos</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/admin/contratos")}
              data-testid="button-view-all-contratos"
            >
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total de contratos activos
                </span>
                <span className="text-2xl font-bold">{contratosActivos}</span>
              </div>
              <Button
                className="w-full"
                onClick={() => setLocation("/admin/contratos")}
                data-testid="button-manage-contratos"
              >
                Gestionar Contratos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pagos Recientes</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/admin/pagos")}
              data-testid="button-view-all-pagos"
            >
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPagos.length > 0 ? (
                  recentPagos.map((pago) => (
                    <TableRow key={pago.id}>
                      <TableCell className="font-medium">
                        {pago.mesAnio}
                      </TableCell>
                      <TableCell>
                        ${Number(pago.monto).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={pago.estadoPago as EstadoPago} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      No hay pagos registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => setLocation("/admin/locales")}
              data-testid="button-manage-locales"
            >
              <Building2 className="h-6 w-6" />
              <span>Gestionar Locales</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => setLocation("/admin/owner-approvals")}
              data-testid="button-approve-owners"
            >
              <Shield className="h-6 w-6" />
              <span>Aprobar Propietarios</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => setLocation("/admin/financial-reports")}
              data-testid="button-financial-reports"
            >
              <FileText className="h-6 w-6" />
              <span>Reportes Financieros</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => setLocation("/admin/rates-promotions")}
              data-testid="button-rates-promotions"
            >
              <DollarSign className="h-6 w-6" />
              <span>Tarifas y Promociones</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => setLocation("/admin/solicitudes")}
              data-testid="button-view-solicitudes"
            >
              <AlertCircle className="h-6 w-6" />
              <span>Ver Solicitudes</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => setLocation("/admin/usuarios")}
              data-testid="button-manage-users"
            >
              <TrendingUp className="h-6 w-6" />
              <span>Gestionar Usuarios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
