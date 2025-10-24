"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/axios"
import type { Statement } from "@/types/statement"

interface StatementFormData {
    credit_card_id: number
    period_start: Date
    period_end: Date
    due_date: Date
    total_amount?: number
    paid_amount?: number
    status?: 'open' | 'closed' | 'paid' | 'partial'
    is_active?: boolean
}

export function useStatement(cardId?: number) {
    const [statements, setStatements] = useState<Statement[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Cargar todos los statements de una tarjeta
    const fetchStatements = async (creditCardId: number) => {
        try {
            setLoading(true)
            const { data } = await api.get<Statement[]>(`/statements/${creditCardId}`)
            setStatements(data)
        } catch (err: any) {
            console.error("Error al cargar los statements", err)
            setError(err.response?.data?.message || "Error al cargar los statements")
        } finally {
            setLoading(false)
        }
    }

    // Crear statement
    const createStatement = async (form: StatementFormData) => {
        try {
            const { data } = await api.post<Statement>("/statements", form)
            setStatements((prev) => [...prev, data])
        } catch (err: any) {
            console.error("Error al crear el statement:", err)
            setError(err.response?.data?.message || "Error al crear el statement")
        }
    }

    // Actualizar statement
    const updateStatement = async (id: number, updates: Partial<StatementFormData>) => {
        try {
            const { data } = await api.put<Statement>(`/statements/${id}`, updates)
            setStatements((prev) => prev.map((s) => (s.id === id ? data : s)))
        } catch (err: any) {
            console.error("Error al actualizar el statement:", err)
            setError(err.response?.data?.message || "Error al actualizar el statement")
        }
    }

    // Eliminar statement
    const deleteStatement = async (id: number) => {
        try {
            await api.delete(`/statements/${id}`)
            setStatements((prev) => prev.filter((s) => s.id !== id))
        } catch (err: any) {
            console.error("Error al eliminar el statement:", err)
            setError(err.response?.data?.message || "Error al eliminar el statement")
        }
    }

    useEffect(() => {
        if (cardId) {
            fetchStatements(cardId)
        }
    }, [cardId])

    return {
        statements,
        loading,
        error,
        fetchStatements,
        createStatement,
        updateStatement,
        deleteStatement,
    }
}