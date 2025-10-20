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
import type { Bank } from "@/types/bank"

interface Props {
  bank?: Bank
  onSubmit: (data: { name: string; country?: string; is_active: boolean }) => void
  triggerText?: string
  open?: boolean // ← Nuevo: control externo
  onOpenChange?: (open: boolean) => void // ← Nuevo
}

export function BankFormDialog({
  bank,
  onSubmit,
  triggerText = "+ Agregar banco",
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen ?? internalOpen
  const onOpenChange = externalOnOpenChange ?? setInternalOpen

  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (bank) {
      setName(bank.name)
      setCountry(bank.country || "")
      setIsActive(bank.is_active)
    } else {
      setName("")
      setCountry("")
      setIsActive(true)
    }
  }, [bank])

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit({ name, country, is_active: isActive })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!bank && (
        <DialogTrigger asChild>
          <Button>{triggerText}</Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bank ? "Editar banco" : "Agregar nuevo banco"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Nombre</Label>
            <Input
              placeholder="Nombre del banco"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>País</Label>
            <Input
              placeholder="País (opcional)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Activo</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="pt-2 text-right">
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              {bank ? "Guardar cambios" : "Crear banco"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
