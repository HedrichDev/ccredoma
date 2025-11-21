import { useQuery } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { FileText, Search } from "lucide-react";
import { useState } from "react";
import type { ContratoAlquiler, EstadoContrato } from "@shared/schema";

export default function AdminContratos() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: contratos, isLoading } = useQuery<
    (ContratoAlquiler & { local: any; usuario: any })[]
  >({
    queryKey: ["/api/contratos"],
  });

  const filteredContratos =
    contratos?.filter(
      (contrato) =>
        contrato.local?.codigoLocal
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contrato.usuario?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Contratos
          </h1>
          <p className="text-muted-foreground">
            Administra los contratos de alquiler
          </p>
        </div>
        <Button data-testid="button-add-contrato">
          <FileText className="h-4 w-4 mr-2" />
          Nuevo Contrato
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por local o arrendatario..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contratos Registrados</CardTitle>
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
                  <TableHead>Local</TableHead>
                  <TableHead>Arrendatario</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Renta Mensual</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContratos.length > 0 ? (
                  filteredContratos.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">
                        {contrato.local?.codigoLocal || "N/A"}
                      </TableCell>
                      <TableCell>{contrato.usuario?.email || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(contrato.fechaInicio).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(contrato.fechaFin).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        ${Number(contrato.rentaMensual).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={contrato.estadoContrato as EstadoContrato}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-view-${contrato.id}`}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No se encontraron contratos
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
