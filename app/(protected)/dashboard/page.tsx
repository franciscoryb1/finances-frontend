import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* ENCABEZADO */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general de tus finanzas personales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-10 w-32 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
            Filtro fecha
          </div>
          <div className="h-10 w-40 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
            + Nueva transacción
          </div>
        </div>
      </header>

      {/* CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Balance general</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-600">
            $ ———
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingresos del mes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-blue-600">
            $ ———
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos del mes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-red-600">
            $ ———
          </CardContent>
        </Card>
      </section>

      {/* GRÁFICOS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="h-[300px] flex items-center justify-center text-muted-foreground">
          📊 Gráfico de ingresos/gastos
        </Card>
        <Card className="h-[300px] flex items-center justify-center text-muted-foreground">
          🧩 Gráfico de categorías
        </Card>
      </section>

      {/* TABLA */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Transacciones recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              📋 Tabla de movimientos
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
