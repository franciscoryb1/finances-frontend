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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category } from "@/types/category"


interface Props {
    category?: Category
    onSubmit: (data: { name: string; type: 'income' | 'expense'; color?: string; is_active: boolean }) => void
    triggerText?: string
    open?: boolean // Abrir externo
    onOpenChange?: (open: boolean) => void
}

export function CategoryFormDialog({
    category,
    onSubmit,
    triggerText = "+ Agregar categoria",
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
}: Props) {
    console.log('category: ', category);
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen ?? internalOpen
    const onOpenChange = externalOnOpenChange ?? setInternalOpen

    const [name, setName] = useState("")
    const [type, setType] = useState<"income" | "expense">("income")
    const [color, setColor] = useState("")
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        if (category) {
            setName(category.name)
            setType(category.type || "")
            setColor(category.color || "")
            setIsActive(category.is_active)
        } else {
            setName("")
            setType("income")
            setColor("")
            setIsActive(true)
        }
    }, [category])

    const handleSubmit = () => {
        if (!name.trim()) return
        onSubmit({ name, type, color, is_active: isActive })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!category && (
                <DialogTrigger asChild>
                    <Button>{triggerText}</Button>
                </DialogTrigger>
            )}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category ? "Editar categoria" : "Agregar nueva categoria"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1">
                        <Label>Nombre</Label>
                        <Input
                            placeholder="Categoria"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Tipo */}
                    <div className="space-y-1">
                        <Label>Tipo</Label>
                        <Select value={type} onValueChange={(value: "income" | "expense") => setType(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Ingreso</SelectItem>
                                <SelectItem value="expense">Egreso</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label>Color</Label>
                        <Input
                            placeholder="Color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
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
                            {category ? "Guardar cambios" : "Crear categoria"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
