"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/axios"
import type { CreditCard } from "@/types/creditCard"

interface CreditCardFormData {
    bank_id: number
    name: string
    brand: 'VISA' | 'MasterCard'
    limit_amount?: number
    balance?: number
    expiration_date: Date
    is_active: boolean
}

export function useCreditCard() {
    const [creditCards, setcreditCards] = useState<CreditCard[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Cargar todas las tarjetas de credito
    const fetchCreditCards = async () => {
        try {
            setLoading(true)
            const { data } = await api.get<CreditCard[]>("/cards")
            setcreditCards(data)
        } catch (err: any) {
            console.error("Error al cargar las tarjetas de credito", err)
            setError(err.response?.data?.message || "Error al cargar las tarjetas de credito")
        } finally {
            setLoading(false)
        }
    }

    // Crear tarjeta de credito
    const createCreditCard = async (form: CreditCardFormData) => {
        try {
            const { data } = await api.post<CreditCard>("/cards", form)
            setcreditCards((prev) => [...prev, data])
        } catch (err: any) {
            console.error("Error al crear la tarjeta de credito:", err)
            setError(err.response?.data?.message || "Error al crear la tarjeta de credito")
        }
    }

    // Actualizar tarjeta de credito
    const updateCreditCard = async (id: number, updates: CreditCardFormData) => {
        try {
            const { data } = await api.put<CreditCard>(`/cards/${id}`, updates)
            setcreditCards((prev) => prev.map((b) => (b.id === id ? data : b)))
        } catch (err: any) {
            console.error("Error al actualizar la tarjeta de credito:", err)
            setError(err.response?.data?.message || "Error al actualizar la tarjeta de credito")
        }
    }

    // Desactivar tarjeta de credito
    const deactivateCreditCard = async (id: number) => {
        try {
            await api.delete(`/cards/${id}`)
            setcreditCards((prev) =>
                prev.map((b) => (b.id === id ? { ...b, is_active: false } : b))
            )
        } catch (err: any) {
            console.error("Error al desactivar la tarjeta de credito:", err)
            setError(err.response?.data?.message || "Error al desactivar la tarjeta de credito")
        }
    }

    // Restaurar tarjeta de credito
    const restoreCreditCard = async (id: number) => {
        try {
            await api.patch(`/cards/${id}/restore`)
            setcreditCards((prev) =>
                prev.map((b) => (b.id === id ? { ...b, is_active: true } : b))
            )
        } catch (err: any) {
            console.error("Error al restaurar la tarjeta de credito:", err)
            setError(err.response?.data?.message || "Error al restaurar la tarjeta de credito")
        }
    }

    useEffect(() => {
        fetchCreditCards()
    }, [])

    return {
        creditCards,
        loading,
        error,
        createCreditCard,
        updateCreditCard,
        deactivateCreditCard,
        restoreCreditCard,
    }
}
