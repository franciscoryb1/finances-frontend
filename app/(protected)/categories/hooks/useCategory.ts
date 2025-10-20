"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/axios"
import type { Category } from "@/types/category"

interface CategoryFormData {
  name: string
  type: 'income' | 'expense'
  color?: string
  is_active: boolean
}

export function useCategory() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar todas las categorias
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<Category[]>("/categories")
      setCategories(data)
    } catch (err: any) {
      console.error("Error al cargar las categorias:", err)
      setError(err.response?.data?.message || "Error al cargar las categorias")
    } finally {
      setLoading(false)
    }
  }

  // Crear categoria
  const createCategory = async (form: CategoryFormData) => {
    try {
      const { data } = await api.post<Category>("/categories", form)
      setCategories((prev) => [...prev, data])
    } catch (err: any) {
      console.error("Error al crear la categoria:", err)
      setError(err.response?.data?.message || "Error al crear la categoria")
    }
  }

  // Actualizar categoria
  const updateCategory = async (id: number, updates: CategoryFormData) => {
    try {
      const { data } = await api.put<Category>(`/categories/${id}`, updates)
      setCategories((prev) => prev.map((b) => (b.id === id ? data : b)))
    } catch (err: any) {
      console.error("Error al actualizar la categoria:", err)
      setError(err.response?.data?.message || "Error al actualizar la categoria")
    }
  }

  // Desactivar categoria
  const deactivateCategory = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`)
      setCategories((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_active: false } : b))
      )
    } catch (err: any) {
      console.error("Error al desactivar la categoria:", err)
      setError(err.response?.data?.message || "Error al desactivar la categoria")
    }
  }

  // Restaurar categoria
  const restoreCategory = async (id: number) => {
    try {
      await api.patch(`/categories/${id}/restore`)
      setCategories((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_active: true } : b))
      )
    } catch (err: any) {
      console.error("Error al restaurar la categoria:", err)
      setError(err.response?.data?.message || "Error al restaurar la categoria")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deactivateCategory,
    restoreCategory,
  }
}
