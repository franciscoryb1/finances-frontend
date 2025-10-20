"use client"

import { DataTable } from "@/components/DataTable/DataTable"
import { DataTableToolbar } from "@/components/DataTable/DataTableToolbar"
import { columns } from "./columns"
import { Bank } from "@/types/bank"

interface Props {
  data: Bank[]
  onAdd: () => void
}

export function BankTable({ data, onAdd }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      // toolbar={<DataTableToolbar onAdd={onAdd} />}
    />
  )
}
