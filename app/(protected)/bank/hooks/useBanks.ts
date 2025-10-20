"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/axios"
import type { Bank } from "@/types/bank"

export function useBanks() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBanks = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<Bank[]>("/banks")
      setBanks(data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar los bancos")
    } finally {
      setLoading(false)
    }
  }

  const createBank = async (name: string, country?: string) => {
    const { data } = await api.post<Bank>("/banks", { name, country })
    setBanks(prev => [...prev, data])
  }

  const updateBank = async (id: number, updates: Partial<Bank>) => {
    const { data } = await api.put<Bank>(`/banks/${id}`, updates)
    setBanks(prev => prev.map(b => (b.id === id ? data : b)))
  }

  const deactivateBank = async (id: number) => {
    await api.delete(`/banks/${id}`)
    setBanks(prev =>
      prev.map(b => (b.id === id ? { ...b, is_active: false } : b))
    )
  }

  const restoreBank = async (id: number) => {
    await api.patch(`/banks/${id}/restore`)
    setBanks(prev =>
      prev.map(b => (b.id === id ? { ...b, is_active: true } : b))
    )
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
