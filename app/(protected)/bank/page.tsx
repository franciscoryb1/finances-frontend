"use client"

import { useState } from "react"
import { useBanks } from "./hooks/useBanks"
import { BankTable } from "./components/BankTable"
import { BankFormDialog } from "./components/BankFormDialog"
import type { Bank } from "@/types/bank"

export default function BanksPage() {
  const { banks, loading, error, createBank, updateBank, deactivateBank, restoreBank } = useBanks()
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const handleSubmit = (data: { name: string; country?: string; is_active: boolean }) => {
    if (selectedBank) {
      updateBank(selectedBank.id!, data)
      setSelectedBank(null)
      setEditOpen(false)
    } else {
      createBank(data)
    }
  }

  const handleToggleActive = (id: number, isActive: boolean) => {
    if (isActive) deactivateBank(id)
    else restoreBank(id)
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Bancos</h1>
        <BankFormDialog onSubmit={handleSubmit} />
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <BankTable
          data={banks}
          onEdit={(bank) => {
            setSelectedBank(bank)
            setEditOpen(true)
          }}
          onToggleActive={handleToggleActive}
        />
      )}

      {/* Modal de edición controlado */}
      {selectedBank && (
        <BankFormDialog
          bank={selectedBank}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}
