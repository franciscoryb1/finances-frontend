"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/axios"
import type { Transaction } from "@/types/transaction"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<Transaction[]>("/transactions")
      setTransactions(data)
    } catch (err: any) {
      console.error("❌ Error al cargar transacciones:", err)
      setError(err.response?.data?.message || "Error al cargar las transacciones")
    } finally {
      setLoading(false)
    }
  }

  const createTransaction = async (form: Omit<Transaction, "id" | "user_id">) => {
    try {
      const { data } = await api.post<Transaction>("/transactions", form)
      setTransactions((prev) => [data, ...prev])
    } catch (err: any) {
      console.error("Error al crear transacción:", err)
      setError(err.response?.data?.message || "Error al crear transacción")
    }
  }

  const updateTransaction = async (id: number, updates: Partial<Transaction>) => {
    try {
      const { data } = await api.put<Transaction>(`/transactions/${id}`, updates)
      setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)))
    } catch (err: any) {
      console.error("Error al actualizar transacción:", err)
      setError(err.response?.data?.message || "Error al actualizar transacción")
    }
  }

  const deleteTransaction = async (id: number) => {
    try {
      await api.delete(`/transactions/${id}`)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (err: any) {
      console.error("Error al eliminar transacción:", err)
      setError(err.response?.data?.message || "Error al eliminar transacción")
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
