"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Bank } from "@/types/bank"
import { Badge } from "@/components/ui/badge"

/**
 * Columnas base de la tabla de bancos.
 * Solo define la estructura y visualización.
 * Las acciones se inyectan dinámicamente desde BankTable.
 */
export const baseColumns: ColumnDef<Bank>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "country",
    header: "País",
    cell: ({ row }) => {
      const country = row.getValue("country") as string | null
      return <span>{country || "-"}</span>
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
