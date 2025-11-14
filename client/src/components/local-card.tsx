import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { Building2, Maximize2, MapPin } from "lucide-react";
import type { LocalComercial } from "@shared/schema";

interface LocalCardProps {
  local: LocalComercial & { centroComercial?: { nombre: string } };
  onViewDetails?: (id: string) => void;
  onRequestInfo?: (id: string) => void;
  showActions?: boolean;
}

export function LocalCard({ local, onViewDetails, onRequestInfo, showActions = true }: LocalCardProps) {
  const imageUrl = local.fotosUrls && local.fotosUrls.length > 0 
    ? local.fotosUrls[0] 
    : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop";

  const tipoLocalLabels: Record<string, string> = {
    tienda: "Tienda",
    restaurante: "Restaurante",
    servicio: "Servicio",
    entretenimiento: "Entretenimiento",
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid={`card-local-${local.id}`}>
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={`Local ${local.codigoLocal}`}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg tracking-tight" data-testid={`text-local-code-${local.id}`}>
              {local.codigoLocal}
            </h3>
            {local.centroComercial && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {local.centroComercial.nombre}
              </p>
            )}
          </div>
          <StatusBadge status={local.estado} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{tipoLocalLabels[local.tipoLocal]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{local.areaM2} m²</span>
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">Piso {local.piso}</p>
          <p className="text-xl font-semibold mt-1" data-testid={`text-rent-${local.id}`}>
            ${Number(local.rentaMensual).toLocaleString()}/mes
          </p>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewDetails(local.id)}
              data-testid={`button-view-${local.id}`}
            >
              Ver Detalles
            </Button>
          )}
          {onRequestInfo && local.estado === "disponible" && (
            <Button
              className="flex-1"
              onClick={() => onRequestInfo(local.id)}
              data-testid={`button-request-${local.id}`}
            >
              Solicitar Info
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
