import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Download,
} from "lucide-react";
import { useLocation } from "wouter";
import type {
  ContratoAlquiler,
  PagoAlquiler,
  LocalComercial,
  EstadoContrato,
  EstadoPago,
} from "@shared/schema";

export default function OwnerDashboard() {
  const [, setLocation] = useLocation();

  const { data: contrato } = useQuery<
    ContratoAlquiler & { local: LocalComercial }
  >({
    queryKey: ["/api/mi-contrato"],
  });

  const { data: pagos } = useQuery<PagoAlquiler[]>({
    queryKey: ["/api/mis-pagos"],
  });

  const pagosPendientes =
    pagos?.filter((p) => p.estadoPago === "pendiente").length || 0;
  const proximoVencimiento = pagos
    ?.filter((p) => p.estadoPago === "pendiente")
    .sort(
      (a, b) =>
        new Date(a.fechaVencimiento).getTime() -
        new Date(b.fechaVencimiento).getTime()
    )[0];

  const recentPagos = pagos?.slice(0, 10) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Dashboard</h1>
        <p className="text-muted-foreground">Información de tu local y pagos</p>
      </div>

      {contrato && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Mi Local - {contrato.local?.codigoLocal}
            </CardTitle>
            <CardDescription>
              Contrato vigente desde{" "}
              {new Date(contrato.fechaInicio).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estado del Contrato
                  </p>
                  <div className="mt-1">
                    <StatusBadge
                      status={contrato.estadoContrato as EstadoContrato}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Área del Local
                  </p>
                  <p className="text-lg font-semibold mt-1">
                    {contrato.local?.areaM2} m²
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Local</p>
                  <p className="text-lg font-semibold mt-1 capitalize">
                    {contrato.local?.tipoLocal}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Renta Mensual</p>
                  <p className="text-2xl font-bold mt-1">
                    ${Number(contrato.rentaMensual).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Fecha de Finalización
                  </p>
                  <p className="text-lg font-semibold mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(contrato.fechaFin).toLocaleDateString()}
                  </p>
                </div>
                {contrato.documentoContratoUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    data-testid="button-download-contrato"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Contrato
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pagos Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl font-bold">{pagosPendientes}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Pagos por realizar
                </p>
              </div>
              {proximoVencimiento && (
                <div className="p-4 bg-status-maintenance/10 rounded-lg border border-status-maintenance/20">
                  <p className="text-sm font-medium">Próximo vencimiento</p>
                  <p className="text-lg font-bold mt-1">
                    {new Date(
                      proximoVencimiento.fechaVencimiento
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${Number(proximoVencimiento.monto).toLocaleString()}
                  </p>
                </div>
              )}
              <Button
                className="w-full"
                onClick={() => setLocation("/owner/pagos")}
                data-testid="button-view-pagos"
              >
                Ver Todos los Pagos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                data-testid="button-contrato"
              >
                <FileText className="h-4 w-4 mr-2" />
                Contrato de Alquiler
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                data-testid="button-comprobantes"
              >
                <FileText className="h-4 w-4 mr-2" />
                Comprobantes de Pago
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/owner/maintenance-requests")}
                data-testid="button-maintenance-requests"
              >
                <FileText className="h-4 w-4 mr-2" />
                Solicitudes de Mantenimiento
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                data-testid="button-terminos"
              >
                <FileText className="h-4 w-4 mr-2" />
                Términos y Condiciones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Fecha Pago</TableHead>
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
                      {new Date(pago.fechaVencimiento).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {pago.fechaPago
                        ? new Date(pago.fechaPago).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={pago.estadoPago as EstadoPago} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
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
  );
}
