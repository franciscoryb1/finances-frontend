"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/axios"
import type { Bank } from "@/types/bank"

interface BankFormData {
  name: string
  country?: string
  is_active: boolean
}

export function useBanks() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Cargar todos los bancos
  const fetchBanks = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<Bank[]>("/banks")
      setBanks(data)
    } catch (err: any) {
      console.error("❌ Error al cargar bancos:", err)
      setError(err.response?.data?.message || "Error al cargar los bancos")
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Crear banco
  const createBank = async (form: BankFormData) => {
    try {
      const { data } = await api.post<Bank>("/banks", form)
      setBanks((prev) => [...prev, data])
    } catch (err: any) {
      console.error("❌ Error al crear banco:", err)
      setError(err.response?.data?.message || "Error al crear el banco")
    }
  }

  // 🔹 Actualizar banco
  const updateBank = async (id: number, updates: BankFormData) => {
    try {
      const { data } = await api.put<Bank>(`/banks/${id}`, updates)
      setBanks((prev) => prev.map((b) => (b.id === id ? data : b)))
    } catch (err: any) {
      console.error("❌ Error al actualizar banco:", err)
      setError(err.response?.data?.message || "Error al actualizar el banco")
    }
  }

  // 🔹 Desactivar banco
  const deactivateBank = async (id: number) => {
    try {
      await api.delete(`/banks/${id}`)
      setBanks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_active: false } : b))
      )
    } catch (err: any) {
      console.error("❌ Error al desactivar banco:", err)
      setError(err.response?.data?.message || "Error al desactivar el banco")
    }
  }

  // 🔹 Restaurar banco
  const restoreBank = async (id: number) => {
    try {
      await api.patch(`/banks/${id}/restore`)
      setBanks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_active: true } : b))
      )
    } catch (err: any) {
      console.error("❌ Error al restaurar banco:", err)
      setError(err.response?.data?.message || "Error al restaurar el banco")
    }
  }

  useEffect(() => {
    fetchBanks()
  }, [])

  return {
    banks,
    loading,
    error,
    createBank,
    updateBank,
    deactivateBank,
    restoreBank,
  }
}
