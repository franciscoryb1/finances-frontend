"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Statement } from "@/types/statement"
import { Badge } from "@/components/ui/badge"

/**
 * Columnas base de la tabla de statements.
 * Solo define la estructura y visualización.
 * Las acciones se inyectan dinámicamente desde StatementTable.
 */
export const baseColumns: ColumnDef<Statement>[] = [
    {
        accessorKey: "period_start",
        header: "Inicio de período",
        cell: ({ row }) => {
            const value = row.getValue("period_start") as string | Date | null
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
        accessorKey: "period_end",
        header: "Fin de período",
        cell: ({ row }) => {
            const value = row.getValue("period_end") as string | Date | null
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
        accessorKey: "due_date",
        header: "Fecha de vencimiento",
        cell: ({ row }) => {
            const value = row.getValue("due_date") as string | Date | null
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
        accessorKey: "total_amount",
        header: "Monto total",
        cell: ({ row }) => {
            const amount = row.getValue("total_amount") as number | null
            if (amount === null || amount === undefined) return "-"
            return new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
            }).format(amount)
        },
    },
    {
        accessorKey: "paid_amount",
        header: "Monto pagado",
        cell: ({ row }) => {
            const amount = row.getValue("paid_amount") as number | null
            if (amount === null || amount === undefined) return "-"
            return new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
            }).format(amount)
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as 'open' | 'closed' | 'paid' | 'partial'
            const variants = {
                open: { variant: "default" as const, label: "Abierto" },
                closed: { variant: "secondary" as const, label: "Cerrado" },
                paid: { variant: "default" as const, label: "Pagado" },
                partial: { variant: "outline" as const, label: "Parcial" }
            }
            const config = variants[status] || variants.open
            return <Badge variant={config.variant}>{config.label}</Badge>
        },
    },
    {
        accessorKey: "is_active",
        header: "Activo",
        cell: ({ row }) => {
            const active = row.getValue("is_active") as boolean
            return (
                <Badge variant={active ? "default" : "destructive"}>
                    {active ? "Sí" : "No"}
                </Badge>
            )
        },
    },
]