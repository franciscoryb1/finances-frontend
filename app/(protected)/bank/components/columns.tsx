"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Bank } from "@/types/bank"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Bank>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "country",
    header: "País",
    cell: ({ row }) => row.getValue("country") || "-",
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
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const bank = row.original
      return (
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={() => alert(`Editar ${bank.name}`)}>
            Editar
          </Button>
          <Button
            variant={bank.is_active ? "destructive" : "default"}
            size="sm"
            onClick={() => alert(bank.is_active ? "Desactivar" : "Restaurar")}
          >
            {bank.is_active ? "Desactivar" : "Restaurar"}
          </Button>
        </div>
      )
    },
  },
]
