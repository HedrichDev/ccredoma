
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DollarSign, SlidersHorizontal } from "lucide-react";

// --- Calculation Logic ---
const BASE_PRICE_PER_M2 = 25; // $25 per square meter

const TIPO_LOCAL_MULTIPLIERS = {
  tienda: 1.0,
  restaurante: 1.2,
  servicio: 0.9,
  entretenimiento: 1.3,
};

const PISO_MULTIPLIERS = {
  "1": 1.1, // Ground floor is more expensive
  "2": 1.0,
};

// --- Helper Functions ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

export default function RentSimulatorPage() {
  // --- State for Inputs ---
  const [area, setArea] = useState("100");
  const [tipoLocal, setTipoLocal] =
    useState<keyof typeof TIPO_LOCAL_MULTIPLIERS>("tienda");
  const [piso, setPiso] = useState<keyof typeof PISO_MULTIPLIERS>("1");

  // --- State for Results ---
  const [rentaEstimada, setRentaEstimada] = useState(0);
  const [deposito, setDeposito] = useState(0);
  const [costoInicial, setCostoInicial] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // --- Calculation Handler ---
  const handleCalculate = () => {
    const areaNum = parseFloat(area) || 0;
    const tipoMultiplier = TIPO_LOCAL_MULTIPLIERS[tipoLocal];
    const pisoMultiplier = PISO_MULTIPLIERS[piso];

    const calculatedRent =
      areaNum * BASE_PRICE_PER_M2 * tipoMultiplier * pisoMultiplier;
    const calculatedDeposito = calculatedRent * 2; // 2 months deposit
    const calculatedCostoInicial = calculatedRent + calculatedDeposito;

    setRentaEstimada(calculatedRent);
    setDeposito(calculatedDeposito);
    setCostoInicial(calculatedCostoInicial);
    setShowResults(true);
  };

  return (
    <div className="bg-gray-50 dark:bg-background">
      <header className="bg-primary/5 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary tracking-tight">
            Simulador de Renta
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Calcula una estimación del costo de alquiler para tu próximo local
            comercial en Mall Central. Completa los siguientes campos para
            obtener una proyección.
          </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Parámetros de Simulación
                </CardTitle>
                <CardDescription>
                  Ajusta los detalles para refinar tu estimación.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-8 pt-6">
            <div className="space-y-2">
              <Label htmlFor="area">Área del Local (m²)</Label>
              <Input
                id="area"
                type="number"
                placeholder="Ej: 100"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoLocal">Tipo de Local</Label>
              <Select
                value={tipoLocal}
                onValueChange={(
                  value: keyof typeof TIPO_LOCAL_MULTIPLIERS
                ) => setTipoLocal(value)}
              >
                <SelectTrigger id="tipoLocal">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tienda">Tienda (Retail)</SelectItem>
                  <SelectItem value="restaurante">Restaurante</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                  <SelectItem value="entretenimiento">
                    Entretenimiento
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="piso">Piso de Ubicación</Label>
              <Select
                value={piso}
                onValueChange={(value: keyof typeof PISO_MULTIPLIERS) =>
                  setPiso(value)
                }
              >
                <SelectTrigger id="piso">
                  <SelectValue placeholder="Selecciona un piso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Planta Baja (Piso 1)</SelectItem>
                  <SelectItem value="2">Segundo Piso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Duracion is not used in calculation, but kept for UI */}
            <div className="space-y-2">
              <Label htmlFor="duracion">Duración del Contrato (meses)</Label>
              <Input id="duracion" type="number" defaultValue="12" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button size="lg" onClick={handleCalculate}>
              Calcular Estimación
            </Button>
          </CardFooter>
        </Card>

        {/* Results Section - Conditionally rendered */}
        {showResults && (
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">
              Resultados de la Simulación
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardHeader>
                  <div className="mx-auto bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 p-3 rounded-full">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-green-800 dark:text-green-200">
                    Renta Mensual Estimada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(rentaEstimada)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Basado en {formatCurrency(rentaEstimada / (parseFloat(area) || 1))}/m²
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Depósito en Garantía</CardTitle>
                  <CardDescription>(2 meses de renta)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{formatCurrency(deposito)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Costo Total Inicial</CardTitle>
                  <CardDescription>(Depósito + 1er Mes)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {formatCurrency(costoInicial)}
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              *Nota: Todos los valores son estimaciones y están sujetos a
              cambios y negociación. Esta herramienta no constituye una oferta
              formal.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
