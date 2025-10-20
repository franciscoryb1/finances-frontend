"use client"

import { useBanks } from "./hooks/useBanks"
import { BankTable } from "./components/BankTable"
import { BankFormDialog } from "./components/BankFormDialog"

export default function BanksPage() {
  const { banks, loading, error, createBank } = useBanks()

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Bancos</h1>
        {/* Botón de agregar banco alineado a la derecha */}
        <BankFormDialog onSubmit={createBank} />
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <BankTable data={banks} onAdd={() => { }} />
      )}

    </section>
  )
}
