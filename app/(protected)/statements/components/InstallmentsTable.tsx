"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/DataTable/DataTable"
import type { Installment } from "@/types/installment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { api } from "@/lib/axios"
import { Transaction } from "@/types/transaction"

interface Props {
  data: Installment[]
  onMarkAsPaid: (id: number) => void
}

const currency = (value: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value)

const formatDate = (value: string | Date) => {
  const date = new Date(value)
  return date.toLocaleDateString("es-AR", { year: "numeric", month: "2-digit", day: "2-digit" })
}

export function InstallmentsTable({ data, onMarkAsPaid }: Props) {
  const columns: ColumnDef<Installment>[] = [
    {
      accessorKey: "installment_number",
      header: "Cuota",
      cell: ({ row }) => {
        return <span className="font-semibold whitespace-nowrap">Cuota #{row.getValue("installment_number")}</span>
      },
    },
    {
      accessorKey: "transaction_description",
      header: "Descripción",
      cell: ({ row }) => {
        return <span className="text-muted-foreground">{row.getValue("transaction_description")}</span>
      },
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number
        return <span className="font-medium">{currency(amount)}</span>
      },
    },
    {
      accessorKey: "due_date",
      header: "Vencimiento",
      cell: ({ row }) => {
        const value = row.getValue("due_date") as string | Date
        return <span className="whitespace-nowrap">{formatDate(value)}</span>
      },
    },
    {
      accessorKey: "paid",
      header: "Estado",
      cell: ({ row }) => {
        const paid = row.getValue("paid") as boolean
        return (
          <Badge variant={paid ? "default" : "secondary"}>
            {paid ? "Pagada" : "Pendiente"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => {
        const installment = row.original
        if (installment.paid) {
          return (
            <span className="text-xs text-muted-foreground italic">Ya pagada</span>
          )
        }

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkAsPaid(installment.id!)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar como pagada
          </Button>
        )
      },
    },
  ]

  if (data.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No hay cuotas asociadas a este resumen</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <DataTable columns={columns} data={data} searchKey="installment_number" />
    </div>
  )
}