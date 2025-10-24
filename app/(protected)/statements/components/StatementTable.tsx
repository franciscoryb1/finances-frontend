"use client"

import { DataTable } from "@/components/DataTable/DataTable"
import type { Statement } from "@/types/statement"
import { baseColumns } from "./columns"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"

interface Props {
  data: Statement[]
  onEdit: (statement: Statement) => void
  onDelete: (id: number) => void
}

export function StatementTable({ data, onEdit, onDelete }: Props) {
  const router = useRouter()
  
  // A las columnas predefinidas, las extiendo y agrego columna de ACCIONES
  const columns = [
    ...baseColumns,
    {
      id: "actions",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }: any) => {
        const statement = row.original as Statement
        return (
          <div className="flex gap-2 justify-center">
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => router.push(`/statements/${statement.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver detalle
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(statement)}>
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(statement.id!)}
            >
              Eliminar
            </Button>
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={data} searchKey="status" />
}