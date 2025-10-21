"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { CreditCard } from "@/types/creditCard"
import { Badge } from "@/components/ui/badge"

/**
 * Columnas base de la tabla de categorias.
 * Solo define la estructura y visualización.
 * Las acciones se inyectan dinámicamente desde CategoryTable.
 */
export const baseColumns: ColumnDef<CreditCard>[] = [
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
        accessorKey: "bank",
        header: "Banco",
        cell: ({ row }) => {
            const active = row.getValue("is_active") as boolean
            return (
                <Badge variant={"default"}>
                    {row.getValue('bank_id')}
                </Badge>
            )
        },
    },
    {
        accessorKey: "brand",
        header: "Marca",
        cell: ({ row }) => {
            const brand = row.getValue("brand") as 'VISA' | 'MasterCard';
            return (
                <Badge variant={brand === "VISA" ? "default" : "secondary"}>
                    {brand}
                </Badge>
            )
        },
    },
    {
        accessorKey: "expiration_date",
        header: "Fecha de vencimiento",
        cell: ({ row }) => {
            const value = row.getValue("expiration_date") as string | Date | null
            if (!value) return "-"

            const date = new Date(value)
            return date.toLocaleDateString("es-AR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
        },
    },
    {
        accessorKey: "limit_amount",
        header: "Limite"
    },
    {
        accessorKey: "balance",
        header: "Limite disponible"
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
