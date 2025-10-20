"use client"

import { useState } from "react"
import { useCategory } from "./hooks/useCategory"
import { CategoryTable } from "./components/CategoryTable"
import { CategoryFormDialog } from "./components/CategoryFormDialog"
import type { Category } from "@/types/category"

export default function CategoriesPage() {
  const { categories, loading, error, createCategory, updateCategory, deactivateCategory, restoreCategory } = useCategory()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const handleSubmit = (data: { name: string; type: 'income' | 'expense'; color?: string; is_active: boolean }) => {
    if (selectedCategory) {
      updateCategory(selectedCategory.id!, data)
      setSelectedCategory(null)
      setEditOpen(false)
    } else {
      createCategory(data)
    }
  }

  const handleToggleActive = (id: number, isActive: boolean) => {
    if (isActive) deactivateCategory(id)
    else restoreCategory(id)
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categorías</h1>
        <CategoryFormDialog onSubmit={handleSubmit} />
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <CategoryTable
          data={categories}
          onEdit={(category) => {
            setSelectedCategory(category)
            setEditOpen(true)
          }}
          onToggleActive={handleToggleActive}
        />
      )}

      {selectedCategory && (
        <CategoryFormDialog
          category={selectedCategory}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}
