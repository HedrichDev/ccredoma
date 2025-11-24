import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SolicitudInformacion, EstadoSolicitud } from "@shared/schema";

type SolicitudConLocal = SolicitudInformacion & {
  local: {
    codigoLocal: string;
    tipoLocal: string;
  };
};

export default function AdminSolicitudes() {
  const { toast } = useToast();

  const { data: solicitudes, isLoading } = useQuery<SolicitudConLocal[]>({
    queryKey: ["/api/solicitudes"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/solicitudes/${id}`, {
        estadoSolicitud: status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/solicitudes"] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la solicitud se ha actualizado",
      });
    },
  });

  const nuevas =
    solicitudes?.filter((s) => s.estadoSolicitud === "nueva").length || 0;
  const contactadas =
    solicitudes?.filter((s) => s.estadoSolicitud === "contactada").length || 0;
  const cerradas =
    solicitudes?.filter((s) => s.estadoSolicitud === "cerrada").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Solicitudes de Información
        </h1>
        <p className="text-muted-foreground">
          Gestiona las solicitudes de los visitantes
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nuevas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{nuevas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contactadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{contactadas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cerradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{cerradas}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitudes && solicitudes.length > 0 ? (
                  solicitudes.map((solicitud) => (
                    <TableRow key={solicitud.id}>
                      <TableCell className="font-medium">
                        {new Date(solicitud.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {solicitud.local?.codigoLocal || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {solicitud.nombreContacto}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {solicitud.emailContacto}
                          </p>
                          {solicitud.telefonoContacto && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {solicitud.telefonoContacto}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{solicitud.mensaje}</p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={solicitud.estadoSolicitud as EstadoSolicitud}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {solicitud.estadoSolicitud === "nueva" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: solicitud.id,
                                  status: "contactada",
                                })
                              }
                              data-testid={`button-contactar-${solicitud.id}`}
                            >
                              Contactar
                            </Button>
                          )}
                          {solicitud.estadoSolicitud === "contactada" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: solicitud.id,
                                  status: "cerrada",
                                })
                              }
                              data-testid={`button-cerrar-${solicitud.id}`}
                            >
                              Cerrar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No hay solicitudes registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
