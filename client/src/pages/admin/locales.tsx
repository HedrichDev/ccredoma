import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocalCard } from "@/components/local-card";
import { Plus, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLocalComercialSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { LocalComercial } from "@shared/schema";
import { z } from "zod";

const localFormSchema = insertLocalComercialSchema.extend({
  centroComercialId: z.string().uuid(),
  codigoLocal: z.string().min(1, "El código es requerido"),
  areaM2: z.string().min(1, "El área es requerida"),
  tipoLocal: z.enum(["tienda", "restaurante", "servicio", "entretenimiento"]),
  piso: z.string().min(1, "El piso es requerido"),
  estado: z.enum(["disponible", "ocupado", "en_mantenimiento"]),
  rentaMensual: z.string().min(1, "La renta es requerida"),
});

export default function AdminLocales() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: locales, isLoading } = useQuery<LocalComercial[]>({
    queryKey: ["/api/locales"],
  });

  const { data: centros } = useQuery<{ id: string; nombre: string }[]>({
    queryKey: ["/api/centros"],
  });

  const createLocalMutation = useMutation({
    mutationFn: async (data: z.infer<typeof localFormSchema>) => {
      return await apiRequest("POST", "/api/locales", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locales"] });
      toast({
        title: "Local creado",
        description: "El local se ha creado exitosamente",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "No se pudo crear el local",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof localFormSchema>>({
    resolver: zodResolver(localFormSchema),
    defaultValues: {
      centroComercialId: "",
      codigoLocal: "",
      areaM2: "",
      tipoLocal: "tienda",
      piso: "1",
      estado: "disponible",
      rentaMensual: "",
      caracteristicas: {},
      fotosUrls: [],
    },
  });

  const onSubmit = (data: z.infer<typeof localFormSchema>) => {
    createLocalMutation.mutate({
      ...data,
      areaM2: data.areaM2.toString(),
      rentaMensual: data.rentaMensual.toString(),
    });
  };

  const filteredLocales =
    locales?.filter(
      (local) =>
        local.codigoLocal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        local.tipoLocal.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Locales
          </h1>
          <p className="text-muted-foreground">
            Administra los locales comerciales
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-local">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Local
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Local</DialogTitle>
              <DialogDescription>
                Completa la información del local comercial
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigoLocal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código del Local</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="LC-101"
                            {...field}
                            data-testid="input-codigo"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="centroComercialId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centro Comercial</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-centro">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {centros?.map((centro) => (
                              <SelectItem key={centro.id} value={centro.id}>
                                {centro.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="areaM2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área (m²)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            data-testid="input-area"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rentaMensual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Renta Mensual ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="5000"
                            {...field}
                            data-testid="input-renta"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipoLocal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Local</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-tipo">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tienda">Tienda</SelectItem>
                            <SelectItem value="restaurante">
                              Restaurante
                            </SelectItem>
                            <SelectItem value="servicio">Servicio</SelectItem>
                            <SelectItem value="entretenimiento">
                              Entretenimiento
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="piso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Piso</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1"
                            {...field}
                            data-testid="input-piso"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-estado">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="disponible">
                              Disponible
                            </SelectItem>
                            <SelectItem value="ocupado">Ocupado</SelectItem>
                            <SelectItem value="en_mantenimiento">
                              En Mantenimiento
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createLocalMutation.isPending}
                  data-testid="button-submit"
                >
                  {createLocalMutation.isPending ? "Creando..." : "Crear Local"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Locales</CardTitle>
          <CardDescription>Filtra por código o tipo de local</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-[400px] animate-pulse">
              <div className="h-full bg-muted" />
            </Card>
          ))}
        </div>
      ) : filteredLocales.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocales.map((local) => (
            <LocalCard key={local.id} local={local} showActions={false} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No se encontraron locales</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
