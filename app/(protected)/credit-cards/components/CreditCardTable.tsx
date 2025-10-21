"use client"

import { DataTable } from "@/components/DataTable/DataTable"
import type { CreditCard } from "@/types/creditCard"
import { baseColumns } from "./columns"
import { Button } from "@/components/ui/button"

interface Props {
  data: CreditCard[]
  onEdit: (category: CreditCard) => void
  onToggleActive: (id: number, isActive: boolean) => void
}

export function CreditCardTable({ data, onEdit, onToggleActive }: Props) {
  // A las columnas predefinicas, las extiendo y agrego columna de ACCIONES
  const columns = [
    ...baseColumns,
    {
      id: "actions",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }: any) => {
        const creditCard = row.original as CreditCard
        return (
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => onEdit(creditCard)}>
              Editar
            </Button>
            <Button
              variant={creditCard.is_active ? "destructive" : "default"}
              size="sm"
              onClick={() => onToggleActive(creditCard.id!, creditCard.is_active)}
            >
              {creditCard.is_active ? "Desactivar" : "Restaurar"}
            </Button>
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={data} searchKey="name" />
}
