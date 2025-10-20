"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  onSubmit: (name: string, country?: string) => void
}

export function BankFormDialog({ onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit(name, country)
    setOpen(false)
    setName("")
    setCountry("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Agregar banco</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar nuevo banco</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input
            placeholder="Nombre del banco"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            placeholder="País (opcional)"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
