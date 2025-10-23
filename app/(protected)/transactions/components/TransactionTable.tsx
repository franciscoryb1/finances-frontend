"use client"

import { DataTable } from "@/components/DataTable/DataTable"
import { baseColumns } from "./columns"
import type { Transaction } from "@/types/transaction"

interface Props {
  data: Transaction[]
}

export function TransactionTable({ data }: Props) {
  return <DataTable columns={baseColumns} data={data} searchKey="description" />
}
