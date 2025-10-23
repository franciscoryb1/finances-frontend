"use client"

import { useState } from "react"
import { useTransactions } from "./hooks/useTransactions"
import { TransactionTable } from "./components/TransactionTable"
import { TransactionFormDialog } from "./components/TransactionFormDialog"
import type { Transaction } from "@/types/transaction"

export default function TransactionsPage() {
  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions()

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (tx: Transaction) => {
    setSelectedTx(tx)
    setIsDialogOpen(true)
  }

  const handleSubmit = (formData: Omit<Transaction, "id" | "user_id">) => {
    if (selectedTx) updateTransaction(selectedTx.id!, formData)
    else createTransaction(formData)
    setSelectedTx(null)
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Transacciones</h1>
        <TransactionFormDialog onSubmit={createTransaction} />
      </div>

      {loading ? (
        <p>Cargando transacciones...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <TransactionTable data={transactions} />
      )}

      {selectedTx && (
        <TransactionFormDialog
          transaction={selectedTx}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}
