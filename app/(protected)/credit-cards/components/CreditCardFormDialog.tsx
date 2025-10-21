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
import type { CreditCard } from "@/types/creditCard"
import type { Bank } from "@/types/bank"
import { api } from "@/lib/axios"

interface Props {
  card?: CreditCard
  onSubmit: (data: Omit<CreditCard, "id" | "user_id">) => void
  triggerText?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreditCardFormDialog({
  card,
  onSubmit,
  triggerText = "+ Agregar tarjeta",
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen ?? internalOpen
  const onOpenChange = externalOnOpenChange ?? setInternalOpen

  const [name, setName] = useState("")
  const [bankId, setBankId] = useState<number | null>(null)
  const [banks, setBanks] = useState<Bank[]>([])
  const [brand, setBrand] = useState<"VISA" | "MasterCard">("VISA")
  const [limitAmount, setLimitAmount] = useState<number | undefined>()
  const [balance, setBalance] = useState<number | undefined>()
  const [expirationDate, setExpirationDate] = useState("")
  const [isActive, setIsActive] = useState(true)

  // 🔹 Obtener bancos activos al abrir el modal
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data } = await api.get<Bank[]>("/banks")
        const activeBanks = data.filter((b) => b.is_active)
        setBanks(activeBanks)
      } catch (err) {
        console.error("Error al cargar los bancos:", err)
      }
    }

    if (open) fetchBanks()
  }, [open])

  // 🔹 Cargar datos si se está editando una tarjeta
  useEffect(() => {
    if (card) {
      setName(card.name)
      setBankId(card.bank_id)
      setBrand(card.brand)
      setLimitAmount(card.limit_amount)
      setBalance(card.balance)
      setExpirationDate(
        card.expiration_date ? new Date(card.expiration_date).toISOString().split("T")[0] : ""
      )
      setIsActive(card.is_active)
    } else {
      setName("")
      setBankId(null)
      setBrand("VISA")
      setLimitAmount(undefined)
      setBalance(undefined)
      setExpirationDate("")
      setIsActive(true)
    }
  }, [card])

  const handleSubmit = () => {
    if (!name.trim() || !bankId) return
    onSubmit({
      name,
      bank_id: bankId,
      brand,
      limit_amount: limitAmount,
      balance,
      expiration_date: new Date(expirationDate),
      is_active: isActive,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!card && (
        <DialogTrigger asChild>
          <Button>{triggerText}</Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{card ? "Editar tarjeta" : "Agregar nueva tarjeta"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Nombre */}
          <div className="space-y-1">
            <Label>Nombre</Label>
            <Input
              placeholder="Ej: VISA Santander"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Banco */}
          <div className="space-y-1">
            <Label>Banco</Label>
            <Select
              value={bankId ? String(bankId) : ""}
              onValueChange={(value) => setBankId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No hay bancos activos
                  </div>
                ) : (
                  banks.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Marca */}
          <div className="space-y-1">
            <Label>Marca</Label>
            <Select value={brand} onValueChange={(v: "VISA" | "MasterCard") => setBrand(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VISA">VISA</SelectItem>
                <SelectItem value="MasterCard">MasterCard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Límite */}
          <div className="space-y-1">
            <Label>Límite</Label>
            <Input
              type="number"
              placeholder="Ej: 250000"
              value={limitAmount ?? ""}
              onChange={(e) => setLimitAmount(Number(e.target.value))}
            />
          </div>

          {/* Saldo */}
          <div className="space-y-1">
            <Label>Saldo actual</Label>
            <Input
              type="number"
              placeholder="Ej: 120000"
              value={balance ?? ""}
              onChange={(e) => setBalance(Number(e.target.value))}
            />
          </div>

          {/* Fecha de vencimiento */}
          <div className="space-y-1">
            <Label>Fecha de vencimiento</Label>
            <Input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Activo</Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* Botón */}
          <div className="pt-2 text-right">
            <Button onClick={handleSubmit} disabled={!name.trim() || !bankId}>
              {card ? "Guardar cambios" : "Crear tarjeta"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
