import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetricCard } from "@/components/metric-card";
import { Activity, Database, Users, AlertTriangle } from "lucide-react";

export default function DeveloperDashboard() {
  const { data: systemStats } = useQuery<any>({
    queryKey: ["/api/system/stats"],
  });

  const recentLogs = [
    { id: "1", timestamp: new Date().toISOString(), level: "INFO", message: "Usuario admin@example.com inició sesión", source: "auth" },
    { id: "2", timestamp: new Date().toISOString(), level: "INFO", message: "Nuevo local creado: LC-101", source: "locales" },
    { id: "3", timestamp: new Date().toISOString(), level: "WARN", message: "Intento de acceso no autorizado detectado", source: "security" },
    { id: "4", timestamp: new Date().toISOString(), level: "INFO", message: "Pago registrado exitosamente", source: "pagos" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Panel de Desarrollo</h1>
        <p className="text-muted-foreground">Monitoreo y administración del sistema</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Estado del Sistema"
          value="Operativo"
          icon={Activity}
          description="Todos los servicios funcionando"
        />
        <MetricCard
          title="Base de Datos"
          value="100%"
          icon={Database}
          description="Conexión estable"
        />
        <MetricCard
          title="Usuarios Activos"
          value={systemStats?.activeUsers || 0}
          icon={Users}
          description="Sesiones actuales"
        />
        <MetricCard
          title="Alertas"
          value="0"
          icon={AlertTriangle}
          description="Sin problemas críticos"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead>Mensaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        log.level === "WARN"
                          ? "bg-status-maintenance/10 text-status-maintenance"
                          : "bg-status-available/10 text-status-available"
                      }`}
                    >
                      {log.level}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.source}</TableCell>
                  <TableCell className="text-sm">{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">CPU</span>
                <span className="text-sm font-medium">12%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "12%" }} />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Memoria</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }} />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Almacenamiento</span>
                <span className="text-sm font-medium">67%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "67%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de la Base de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Usuarios</span>
                <span className="text-lg font-bold">{systemStats?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Locales</span>
                <span className="text-lg font-bold">{systemStats?.totalLocales || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Contratos</span>
                <span className="text-lg font-bold">{systemStats?.totalContratos || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Pagos</span>
                <span className="text-lg font-bold">{systemStats?.totalPagos || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
