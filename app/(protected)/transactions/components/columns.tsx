"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Transaction } from "@/types/transaction"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const currency = (value: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value)

const formatDate = (value: string | Date) => {
    const date = new Date(value)
    return date.toLocaleDateString("es-AR", { year: "numeric", month: "2-digit", day: "2-digit" })
}

/**
 * Columnas base (solo visualización).
 * Las acciones y filtros se agregan en etapas siguientes.
 */
export const baseColumns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "date",
        header: "Fecha",
        cell: ({ row }) => {
            const value = row.getValue("date") as string | Date
            return <span className="whitespace-nowrap">{formatDate(value)}</span>
        },
    },
    {
        accessorKey: "description",
        header: "Descripción",
        cell: ({ row }) => {
            const desc = row.getValue("description") as string
            return <span className="line-clamp-1">{desc}</span>
        },
    },
    {
        accessorKey: "category_name",
        header: "Categoría",
        cell: ({ row }) => {
            const cat = (row.getValue("category_name") as string) || "-"
            return <span>{cat}</span>
        },
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => {
            const type = row.getValue("type") as Transaction["type"]
            const label = type === "income" ? "Ingreso" : type === "expense" ? "Egreso" : "Transferencia"
            const variant =
                type === "income" ? "default" : type === "expense" ? "destructive" : "secondary"
            return <Badge variant={variant as any}>{label}</Badge>
        },
    },
    {
        accessorKey: "amount",
        header: "Monto",
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number
            const isExpense = (row.getValue("type") as string) === "expense"
            return (
                <span className={isExpense ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                    {currency(amount)}
                </span>
            )
        },
    },
    {
        accessorKey: "account_name",
        header: "Cuenta / Tarjeta",
        cell: ({ row }) => {
            // Muestra preferentemente tarjeta si existe, sino cuenta, sino '-'
            const card = (row.getValue("credit_card_name") as string) || ""
            const account = (row.getValue("account_name") as string) || ""
            return <span>{card || account || "-"}</span>
        },
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => {
            const active = row.getValue("is_active") as boolean
            return <Badge variant={active ? "default" : "destructive"}>{active ? "Activa" : "Anulada"}</Badge>
        },
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const tx = row.original
            return (
                <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm" onClick={() => alert(`Editar ${tx.description}`)}>
                        Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => alert(`Eliminar ${tx.description}`)}>
                        Eliminar
                    </Button>
                </div>
            )
        },
    }
]
