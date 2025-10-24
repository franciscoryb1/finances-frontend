"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Statement } from "@/types/statement"
import type { CreditCard } from "@/types/creditCard"
import { api } from "@/lib/axios"

interface Props {
  statement?: Statement
  onSubmit: (data: Omit<Statement, "id" | "created_at">) => void
  triggerText?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function StatementFormDialog({
  statement,
  onSubmit,
  triggerText = "+ Agregar resumen",
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen ?? internalOpen
  const onOpenChange = externalOnOpenChange ?? setInternalOpen

  const [creditCardId, setCreditCardId] = useState<number | null>(null)
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [totalAmount, setTotalAmount] = useState<number | undefined>()
  const [paidAmount, setPaidAmount] = useState<number | undefined>()
  const [status, setStatus] = useState<'open' | 'closed' | 'paid' | 'partial'>("open")
  const [isActive, setIsActive] = useState(true)

  // 🔹 Obtener tarjetas de crédito activas al abrir el modal
  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        const { data } = await api.get<CreditCard[]>("/cards")
        const activeCards = data.filter((c) => c.is_active)
        setCreditCards(activeCards)
      } catch (err) {
        console.error("Error al cargar las tarjetas:", err)
      }
    }

    if (open) fetchCreditCards()
  }, [open])

  // 🔹 Cargar datos si se está editando un statement
  useEffect(() => {
    if (statement) {
      setCreditCardId(statement.credit_card_id)
      setPeriodStart(
        statement.period_start ? new Date(statement.period_start).toISOString().split("T")[0] : ""
      )
      setPeriodEnd(
        statement.period_end ? new Date(statement.period_end).toISOString().split("T")[0] : ""
      )
      setDueDate(
        statement.due_date ? new Date(statement.due_date).toISOString().split("T")[0] : ""
      )
      setTotalAmount(statement.total_amount)
      setPaidAmount(statement.paid_amount)
      setStatus(statement.status || "open")
      setIsActive(statement.is_active !== undefined ? statement.is_active : true)
    } else {
      setCreditCardId(null)
      setPeriodStart("")
      setPeriodEnd("")
      setDueDate("")
      setTotalAmount(undefined)
      setPaidAmount(undefined)
      setStatus("open")
      setIsActive(true)
    }
  }, [statement])

  const handleSubmit = () => {
    if (!creditCardId || !periodStart || !periodEnd || !dueDate) return
    onSubmit({
      credit_card_id: creditCardId,
      period_start: new Date(periodStart),
      period_end: new Date(periodEnd),
      due_date: new Date(dueDate),
      total_amount: totalAmount,
      paid_amount: paidAmount,
      status,
      is_active: isActive,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!statement && (
        <DialogTrigger asChild>
          <Button>{triggerText}</Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{statement ? "Editar resumen" : "Agregar nuevo resumen"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Tarjeta de crédito */}
          <div className="space-y-1">
            <Label>Tarjeta de crédito</Label>
            <Select
              value={creditCardId ? String(creditCardId) : ""}
              onValueChange={(value) => setCreditCardId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tarjeta" />
              </SelectTrigger>
              <SelectContent>
                {creditCards.length === 0 ? (
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

          {/* Inicio de período */}
          <div className="space-y-1">
            <Label>Inicio de período</Label>
            <Input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
            />
          </div>

          {/* Fin de período */}
          <div className="space-y-1">
            <Label>Fin de período</Label>
            <Input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </div>

          {/* Fecha de vencimiento */}
          <div className="space-y-1">
            <Label>Fecha de vencimiento</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Monto total */}
          <div className="space-y-1">
            <Label>Monto total</Label>
            <Input
              type="number"
              placeholder="Ej: 150000"
              value={totalAmount ?? ""}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
            />
          </div>

          {/* Monto pagado */}
          <div className="space-y-1">
            <Label>Monto pagado</Label>
            <Input
              type="number"
              placeholder="Ej: 75000"
              value={paidAmount ?? ""}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
            />
          </div>

          {/* Estado */}
          <div className="space-y-1">
            <Label>Estado</Label>
            <Select
              value={status}
              onValueChange={(v: 'open' | 'closed' | 'paid' | 'partial') => setStatus(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Abierto</SelectItem>
                <SelectItem value="closed">Cerrado</SelectItem>
                <SelectItem value="paid">Pagado</SelectItem>
                <SelectItem value="partial">Parcial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activo */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Activo</Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* Botón */}
          <div className="pt-2 text-right">
            <Button
              onClick={handleSubmit}
              disabled={!creditCardId || !periodStart || !periodEnd || !dueDate}
            >
              {statement ? "Guardar cambios" : "Crear resumen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}