import { Building, Target, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="relative h-[400px] w-full">
        <img
          src="https://images.unsplash.com/photo-1559899476-b3b3d0335e06?q=80&w=2070&auto=format&fit=crop"
          alt="Modern shopping mall interior"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Sobre CC REDOMA
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Tu Destino para Compras, Gastronomía y Entretenimiento
          </h2>
          <p className="text-lg text-muted-foreground">
            En CC REDOMA, redefinimos la experiencia de compra. Somos más que un
            centro comercial; somos una comunidad vibrante donde las mejores
            marcas, sabores exquisitos y momentos inolvidables se encuentran.
            Desde nuestra apertura, nos hemos dedicado a ofrecer un espacio
            seguro, moderno y acogedor para familias, amigos y visitantes.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 text-center">
          <Card>
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ser el centro comercial líder y el corazón de la comunidad,
                reconocido por nuestra innovación, excelente servicio al cliente
                y por crear experiencias memorables que superen las expectativas
                de nuestros visitantes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ofrecer un mix comercial diverso y de alta calidad, mantener
                instalaciones de vanguardia y seguras, y organizar eventos que
                fomenten la cultura y el entretenimiento, contribuyendo
                positivamente al estilo de vida de nuestra comunidad.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Nuestras Instalaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contamos con más de 200 locales comerciales, un moderno patio de
                comidas, salas de cine de última generación, amplias zonas de
                aparcamiento y espacios dedicados para el esparcimiento
                familiar, todo diseñado para tu comodidad.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            ¿Interesado en formar parte de nuestra comunidad?
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubre las oportunidades que tenemos para tu negocio.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-block bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Contáctanos
          </a>
        </section>
      </main>
    </div>
  );
}
