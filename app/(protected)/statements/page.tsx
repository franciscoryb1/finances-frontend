"use client"

import { useState, useEffect } from "react"
import { useStatement } from "./hooks/useStatement"
import { StatementTable } from "./components/StatementTable"
import { StatementFormDialog } from "./components/StatementFormDialog"
import type { Statement } from "@/types/statement"
import type { CreditCard } from "@/types/creditCard"
import { api } from "@/lib/axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function StatementsPage() {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null)
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [loadingCards, setLoadingCards] = useState(true)

  const {
    statements,
    loading,
    error,
    fetchStatements,
    createStatement,
    updateStatement,
    deleteStatement,
  } = useStatement(selectedCardId || undefined)

  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 🔹 Cargar tarjetas de crédito activas
  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        setLoadingCards(true)
        const { data } = await api.get<CreditCard[]>("/cards")
        const activeCards = data.filter((c) => c.is_active)
        setCreditCards(activeCards)
        
        // Seleccionar automáticamente la primera tarjeta si existe
        if (activeCards.length > 0 && !selectedCardId) {
          setSelectedCardId(activeCards[0].id!)
        }
      } catch (err) {
        console.error("Error al cargar las tarjetas:", err)
      } finally {
        setLoadingCards(false)
      }
    }

    fetchCreditCards()
  }, [])

  const handleEdit = (statement: Statement) => {
    setSelectedStatement(statement)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este resumen?")) {
      deleteStatement(id)
    }
  }

  const handleSubmit = (formData: Omit<Statement, "id" | "created_at">) => {
    if (selectedStatement) {
      updateStatement(selectedStatement.id!, formData)
    } else {
      createStatement(formData)
    }
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedStatement(null)
      setIsDialogOpen(false)
    }
  }

  return (
    <section>
      {/* Header con título, selector de tarjeta y botón de agregar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Resúmenes de tarjeta</h1>
          <StatementFormDialog onSubmit={createStatement} />
        </div>

        {/* Selector de tarjeta */}
        <div className="max-w-md">
          <Label>Seleccionar tarjeta</Label>
          <Select
            value={selectedCardId ? String(selectedCardId) : ""}
            onValueChange={(value) => setSelectedCardId(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tarjeta" />
            </SelectTrigger>
            <SelectContent>
              {loadingCards ? (
                <div className="p-2 text-sm text-muted-foreground">Cargando...</div>
              ) : creditCards.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  No hay tarjetas activas
                </div>
              ) : (
                creditCards.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cuerpo principal */}
      {!selectedCardId ? (
        <p className="text-muted-foreground">Selecciona una tarjeta para ver sus resúmenes</p>
      ) : loading ? (
        <p>Cargando resúmenes...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : statements.length === 0 ? (
        <p className="text-muted-foreground">No hay resúmenes para esta tarjeta</p>
      ) : (
        <StatementTable
          data={statements}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal de edición */}
      {selectedStatement && (
        <StatementFormDialog
          statement={selectedStatement}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}