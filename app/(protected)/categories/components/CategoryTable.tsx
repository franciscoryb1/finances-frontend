"use client"

import { DataTable } from "@/components/DataTable/DataTable"
import type { Category } from "@/types/category"
import { baseColumns } from "./columns"
import { Button } from "@/components/ui/button"

interface Props {
  data: Category[]
  onEdit: (category: Category) => void
  onToggleActive: (id: number, isActive: boolean) => void
}

export function CategoryTable({ data, onEdit, onToggleActive }: Props) {
  // A las columnas predefinicas, las extiendo y agrego columna de ACCIONES
  const columns = [
    ...baseColumns,
    {
      id: "actions",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }: any) => {
        const category = row.original as Category
        return (
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
              Editar
            </Button>
            <Button
              variant={category.is_active ? "destructive" : "default"}
              size="sm"
              onClick={() => onToggleActive(category.id!, category.is_active)}
            >
              {category.is_active ? "Desactivar" : "Restaurar"}
            </Button>
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={data} searchKey="name" />
}
