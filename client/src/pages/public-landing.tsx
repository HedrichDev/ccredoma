import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { LocalCard } from "@/components/local-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Building2, MapPin, Shield, TrendingUp, Phone, Mail, Search, Menu } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@assets/generated_images/Shopping_mall_hero_image_1ec9a257.png";
import type { LocalComercial, TipoLocal } from "@shared/schema";
import { Link } from "wouter";

const contactFormSchema = z.object({
  nombreContacto: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  emailContacto: z.string().email("Email inválido"),
  telefonoContacto: z.string().optional(),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

export default function PublicLanding() {
  const { toast } = useToast();
  const [tipoFiltro, setTipoFiltro] = useState<TipoLocal | "todos">("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocal, setSelectedLocal] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: locales, isLoading } = useQuery<LocalComercial[]>({
    queryKey: ["/api/locales", tipoFiltro],
  });

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      nombreContacto: "",
      emailContacto: "",
      telefonoContacto: "",
      mensaje: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    if (!selectedLocal) return;
    
    toast({
      title: "Solicitud enviada",
      description: "Nos pondremos en contacto contigo pronto.",
    });
    
    form.reset();
    setDialogOpen(false);
    setSelectedLocal(null);
  };

  const handleRequestInfo = (localId: string) => {
    setSelectedLocal(localId);
    setDialogOpen(true);
  };

  const filteredLocales = locales?.filter(local => {
    const matchesTipo = tipoFiltro === "todos" || local.tipoLocal === tipoFiltro;
    const matchesSearch = local.codigoLocal.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTipo && matchesSearch && local.estado === "disponible";
  }) || [];

  const stats = [
    { value: "50+", label: "Espacios Disponibles" },
    { value: "95%", label: "Tasa de Ocupación" },
    { value: "1,200m²", label: "Área Promedio" },
    { value: "15+", label: "Años de Experiencia" },
  ];

  const benefits = [
    {
      icon: MapPin,
      title: "Ubicación Premium",
      description: "En el corazón de la ciudad con fácil acceso y alta visibilidad",
    },
    {
      icon: Shield,
      title: "Seguridad 24/7",
      description: "Sistema de seguridad integral con vigilancia constante",
    },
    {
      icon: Building2,
      title: "Espacios Modernos",
      description: "Locales completamente equipados con diseño contemporáneo",
    },
    {
      icon: TrendingUp,
      title: "Alto Tráfico",
      description: "Miles de visitantes diarios garantizan exposición constante",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight">ERP Centro Comercial</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/catalog">
                <Button variant="ghost" data-testid="button-catalog">
                  Catálogo
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">
                  Iniciar Sesión
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-32">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
            Encuentra Tu Espacio Comercial Ideal
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto font-serif">
            Espacios modernos en ubicaciones premium para hacer crecer tu negocio
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-xl p-6 shadow-2xl">
            <div className="grid md:grid-cols-[1fr,200px,auto] gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código de local..."
                  className="pl-10 h-12 text-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-local"
                />
              </div>
              <Select value={tipoFiltro} onValueChange={(value) => setTipoFiltro(value as TipoLocal | "todos")}>
                <SelectTrigger className="h-12 text-foreground" data-testid="select-tipo-local">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="tienda">Tienda</SelectItem>
                  <SelectItem value="restaurante">Restaurante</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                  <SelectItem value="entretenimiento">Entretenimiento</SelectItem>
                </SelectContent>
              </Select>
              <Button size="lg" className="h-12 px-8" data-testid="button-search">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Locals */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Locales Disponibles</h2>
            <p className="text-xl text-muted-foreground font-serif">
              Explora nuestros espacios comerciales disponibles
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-[400px] animate-pulse">
                  <div className="h-full bg-muted" />
                </Card>
              ))}
            </div>
          ) : filteredLocales.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-locales">
              {filteredLocales.map((local) => (
                <LocalCard
                  key={local.id}
                  local={local}
                  onRequestInfo={handleRequestInfo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No se encontraron locales disponibles con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">¿Por Qué Elegir Nuestro Centro?</h2>
            <p className="text-xl text-muted-foreground font-serif">
              Beneficios que impulsan tu éxito
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-6">¿Listo para Empezar?</h2>
          <p className="text-xl text-muted-foreground mb-8 font-serif">
            Contacta con nuestro equipo para más información
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span>info@centrocomercial.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Request Info Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-request-info">
          <DialogHeader>
            <DialogTitle>Solicitar Información</DialogTitle>
            <DialogDescription>
              Completa el formulario y nos pondremos en contacto contigo pronto.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombreContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-nombre" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefonoContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (Opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-telefono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mensaje"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} data-testid="input-mensaje" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" data-testid="button-submit-request">
                Enviar Solicitud
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-card py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/catalog">
              <Button variant="link">Catálogo</Button>
            </Link>
            <Link href="/about">
              <Button variant="link">Sobre Nosotros</Button>
            </Link>
            <Link href="/rent-simulator">
              <Button variant="link">Simulador de Renta</Button>
            </Link>
            <Link href="/contact">
              <Button variant="link">Contacto</Button>
            </Link>
          </div>
          <p>© 2024 ERP Centro Comercial. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
