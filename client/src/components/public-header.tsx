import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./theme-toggle"; // Assuming this path is correct

export function PublicHeader() {
  const [location] = useLocation();

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Catálogo", path: "/catalog" },
    { name: "Contacto", path: "/contact" },
    { name: "Acerca de", path: "/about" },
    { name: "Simulador de Alquiler", path: "/rent-simulator" },
  ];

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-4">
        <Link href="/">
          <a className="flex items-center gap-2">
            <img src="/Favicon.png" alt="CC REDOMA Logo" className="h-8 w-8" />
            <h1 className="font-bold text-lg tracking-tight">CC REDOMA</h1>
          </a>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <a
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {/* Potentially add login/signup buttons here later */}
      </div>
    </header>
  );
}
