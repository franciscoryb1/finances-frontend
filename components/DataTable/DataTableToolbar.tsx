"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  onAdd?: () => void
  children?: ReactNode
}

export function DataTableToolbar({ onAdd, children }: Props) {
  return (
    <div className="flex items-center justify-end gap-2">
      {children}
      {onAdd && (
        <Button onClick={onAdd}>
          + Agregar
        </Button>
      )}
    </div>
  )
}
