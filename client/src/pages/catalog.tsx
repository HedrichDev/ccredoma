import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { LocalCard } from "@/components/local-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Building2, Search, Phone, Mail } from "lucide-react";
import type { LocalComercial, TipoLocal } from "@shared/schema";
import { Link } from "wouter";

export default function CatalogPage() {
  const [tipoFiltro, setTipoFiltro] = useState<TipoLocal | "todos">("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: locales, isLoading } = useQuery<LocalComercial[]>({
    queryKey: ["/api/locales", tipoFiltro],
  });

  const filteredLocales =
    locales?.filter((local) => {
      const matchesTipo =
        tipoFiltro === "todos" || local.tipoLocal === tipoFiltro;
      const matchesSearch = local.codigoLocal
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesTipo && matchesSearch && local.estado === "disponible";
    }) || [];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight">
                CC REDOMA
              </span>
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

      {/* Hero/Search Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Explora Nuestros Locales Disponibles
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-serif">
            Encuentra el espacio comercial perfecto para tu negocio
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-card/95 backdrop-blur-md rounded-xl p-6 shadow-lg">
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
              <Select
                value={tipoFiltro}
                onValueChange={(value) =>
                  setTipoFiltro(value as TipoLocal | "todos")
                }
              >
                <SelectTrigger
                  className="h-12 text-foreground"
                  data-testid="select-tipo-local"
                >
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="tienda">Tienda</SelectItem>
                  <SelectItem value="restaurante">Restaurante</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                  <SelectItem value="entretenimiento">
                    Entretenimiento
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="lg"
                className="h-12 px-8"
                data-testid="button-search"
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Locals */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-[400px] animate-pulse">
                  <div className="h-full bg-muted" />
                </Card>
              ))}
            </div>
          ) : filteredLocales.length > 0 ? (
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-testid="grid-locales"
            >
              {filteredLocales.map((local) => (
                <LocalCard
                  key={local.id}
                  local={local}
                  // onRequestInfo={handleRequestInfo} // Remove or adapt if catalog page doesn't have a contact dialog
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No se encontraron locales disponibles con los filtros
                seleccionados.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Info (simplified from PublicLanding) */}
      <section className="py-12 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            ¿Necesitas Ayuda?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 font-serif">
            Contacta con nosotros para encontrar tu local ideal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <span>+58 (424) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span>Contacto@ccRedoma.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/catalog">
              <Button variant="ghost">Catálogo</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost">Sobre Nosotros</Button>
            </Link>
            <Link href="/rent-simulator">
              <Button variant="ghost">Simulador de Renta</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Contacto</Button>
            </Link>
          </div>
          <p>© 2025 CC REDOMA. Todos los derechos reservados.</p>
          <p>Development HedrichDev & Asociados</p> 
        </div>
      </footer>
    </div>
  );
}
