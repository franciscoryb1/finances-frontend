"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Category } from "@/types/category"
import { Badge } from "@/components/ui/badge"

/**
 * Columnas base de la tabla de categorias.
 * Solo define la estructura y visualización.
 * Las acciones se inyectan dinámicamente desde CategoryTable.
 */
export const baseColumns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => {
            const type = row.getValue("type") as "income" | "expense"
            return (
                <Badge variant={type === "income" ? "default" : "secondary"}>
                    {type === "income" ? "Ingreso" : "Egreso"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => {
            const color = row.getValue("color") as string | null
            if (!color) return <span>-</span>

            return (
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-muted-foreground">{color}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => {
            const active = row.getValue("is_active") as boolean
            return (
                <Badge variant={active ? "default" : "destructive"}>
                    {active ? "Activo" : "Inactivo"}
                </Badge>
            )
        },
    },
]
