"use client"

import { DataTable } from "@/components/DataTable/DataTable"
import type { Bank } from "@/types/bank"
import { baseColumns } from "./columns"
import { Button } from "@/components/ui/button"

interface Props {
  data: Bank[]
  onEdit: (bank: Bank) => void
  onToggleActive: (id: number, isActive: boolean) => void
}

export function BankTable({ data, onEdit, onToggleActive }: Props) {
  // Extendemos las columnas con las acciones dinámicas
  const columns = [
    ...baseColumns,
    {
      id: "actions",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }: any) => {
        const bank = row.original as Bank
        return (
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => onEdit(bank)}>
              Editar
            </Button>
            <Button
              variant={bank.is_active ? "destructive" : "default"}
              size="sm"
              onClick={() => onToggleActive(bank.id!, bank.is_active)}
            >
              {bank.is_active ? "Desactivar" : "Restaurar"}
            </Button>
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={data} searchKey="name" />
}
