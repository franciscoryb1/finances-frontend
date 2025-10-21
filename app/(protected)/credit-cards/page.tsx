"use client"

import { useState } from "react"
import { useCreditCard } from "./hooks/useCreditCard"
import { CreditCardTable } from "./components/CreditCardTable"
import { CreditCardFormDialog } from "./components/CreditCardFormDialog"
import type { CreditCard } from "@/types/creditCard"

export default function CreditCardsPage() {
  const {
    creditCards,
    loading,
    error,
    createCreditCard,
    updateCreditCard,
    deactivateCreditCard,
    restoreCreditCard,
  } = useCreditCard()

  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (card: CreditCard) => {
    setSelectedCard(card)
    setIsDialogOpen(true)
  }

  const handleToggleActive = (id: number, isActive: boolean) => {
    if (isActive) deactivateCreditCard(id)
    else restoreCreditCard(id)
  }

  const handleSubmit = (formData: Omit<CreditCard, "id" | "user_id">) => {
    if (selectedCard) {
      updateCreditCard(selectedCard.id!, formData)
    } else {
      createCreditCard(formData)
    }
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedCard(null)
      setIsDialogOpen(false)
    }
  }

  return (
    <section>
      {/* Header con título y botón de agregar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Tarjetas de crédito</h1>
        <CreditCardFormDialog onSubmit={createCreditCard} />
      </div>

      {/* Cuerpo principal */}
      {loading ? (
        <p>Cargando tarjetas...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <CreditCardTable
          data={creditCards}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
        />
      )}

      {/* Modal de edición */}
      {selectedCard && (
        <CreditCardFormDialog
          card={selectedCard}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}
