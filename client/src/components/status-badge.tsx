import { Badge } from "@/components/ui/badge";
import type {
  EstadoLocal,
  EstadoPago,
  EstadoContrato,
  EstadoSolicitud,
} from "@shared/schema";

interface StatusBadgeProps {
  status: EstadoLocal | EstadoPago | EstadoContrato | EstadoSolicitud;
  className?: string;
}

const statusConfig = {
  disponible: {
    label: "Disponible",
    color:
      "bg-status-available/10 text-status-available border-status-available/20",
  },
  ocupado: {
    label: "Ocupado",
    color:
      "bg-status-occupied/10 text-status-occupied border-status-occupied/20",
  },
  en_mantenimiento: {
    label: "Mantenimiento",
    color:
      "bg-status-maintenance/10 text-status-maintenance border-status-maintenance/20",
  },

  pendiente: {
    label: "Pendiente",
    color:
      "bg-status-maintenance/10 text-status-maintenance border-status-maintenance/20",
  },
  pagado: {
    label: "Pagado",
    color:
      "bg-status-available/10 text-status-available border-status-available/20",
  },
  vencido: {
    label: "Vencido",
    color: "bg-status-overdue/10 text-status-overdue border-status-overdue/20",
  },

  activo: {
    label: "Activo",
    color:
      "bg-status-available/10 text-status-available border-status-available/20",
  },
  terminado: {
    label: "Terminado",
    color: "bg-muted/50 text-muted-foreground border-muted",
  },

  nueva: {
    label: "Nueva",
    color:
      "bg-status-occupied/10 text-status-occupied border-status-occupied/20",
  },
  contactada: {
    label: "Contactada",
    color:
      "bg-status-maintenance/10 text-status-maintenance border-status-maintenance/20",
  },
  cerrada: {
    label: "Cerrada",
    color: "bg-muted/50 text-muted-foreground border-muted",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.nueva;

  return (
    <Badge
      variant="outline"
      className={`${config.color} ${className || ""}`}
      data-testid={`badge-status-${status}`}
    >
      {config.label}
    </Badge>
  );
}
