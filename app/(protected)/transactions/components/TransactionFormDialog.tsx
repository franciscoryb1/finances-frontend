"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/axios"
import type { Transaction } from "@/types/transaction"
import type { Category } from "@/types/category"
import type { CreditCard } from "@/types/creditCard"
import type { Account } from "@/types/account"

interface Props {
    transaction?: Transaction
    onSubmit: (data: Omit<Transaction, "id" | "user_id"> & { installments?: number }) => void
    triggerText?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function TransactionFormDialog({
    transaction,
    onSubmit,
    triggerText = "+ Nueva transacción",
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
}: Props) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen ?? internalOpen
    const onOpenChange = externalOnOpenChange ?? setInternalOpen

    // Campos principales
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0])
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState<number | undefined>()
    const [totalAmount, setTotalAmount] = useState<number | undefined>()
    const [reimbursedAmount, setReimbursedAmount] = useState<number>(0)
    const [shared, setShared] = useState(false)
    const [type, setType] = useState<Transaction["type"]>("expense")
    const [method, setMethod] = useState<"account" | "credit_card">("account")
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [accountId, setAccountId] = useState<number | null>(null)
    const [creditCardId, setCreditCardId] = useState<number | null>(null)
    const [installments, setInstallments] = useState<number>(1)
    const [isActive, setIsActive] = useState(true)

    // Datos externos
    const [categories, setCategories] = useState<Category[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])
    const [creditCards, setCreditCards] = useState<CreditCard[]>([])

    // Cargar selects
    useEffect(() => {
        if (open) {
            Promise.all([
                api.get("/categories"),
                api.get("/accounts"),
                api.get("/cards"),
            ])
                .then(([c, a, cc]) => {
                    setCategories(c.data)
                    setAccounts(a.data)
                    setCreditCards(cc.data)
                })
                .catch((err) => console.error("Error cargando selects:", err))
        }
    }, [open])

    // Cargar valores si es edición
    useEffect(() => {
        if (transaction) {
            setDate(new Date(transaction.date).toISOString().split("T")[0])
            setDescription(transaction.description || "")
            setAmount(transaction.amount)
            setTotalAmount(transaction.total_amount || transaction.amount)
            setReimbursedAmount(transaction.reimbursed_amount || 0)
            setShared(transaction.shared || false)
            setType(transaction.type)
            setCategoryId(transaction.category_id || null)
            if (transaction.credit_card_id) {
                setMethod("credit_card")
                setCreditCardId(transaction.credit_card_id)
            } else {
                setMethod("account")
                setAccountId(transaction.account_id || null)
            }
            setInstallments(transaction.installments || 1)
            setIsActive(transaction.is_active)
        } else {
            setDate(new Date().toISOString().split("T")[0])
            setDescription("")
            setAmount(undefined)
            setTotalAmount(undefined)
            setReimbursedAmount(0)
            setShared(false)
            setType("expense")
            setMethod("account")
            setCategoryId(null)
            setAccountId(null)
            setCreditCardId(null)
            setInstallments(1)
            setIsActive(true)
        }
    }, [transaction])

    const handleSubmit = () => {
        if (!amount || !date || !description) return

        const payment_method =
            method === "credit_card" ? "credit_card" : "cash"

        const baseData = {
            date: new Date(date),
            description,
            amount,
            total_amount: totalAmount ?? amount,
            reimbursed_amount: reimbursedAmount,
            shared,
            type,
            payment_method,
            category_id: categoryId ?? undefined,
            account_id: method === "account" ? accountId ?? undefined : undefined,
            credit_card_id: method === "credit_card" ? creditCardId ?? undefined : undefined,
            installments: method === "credit_card" ? installments : 1, // 👈 agregado siempre
            is_active: isActive,
            id: 0,
        }

        onSubmit(baseData)
        onOpenChange(false)
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!transaction && (
                <DialogTrigger asChild>
                    <Button>{triggerText}</Button>
                </DialogTrigger>
            )}
            <DialogContent className="max-w-3xl"> {/* 👈 modal más ancho */}
                <DialogHeader>
                    <DialogTitle>
                        {transaction ? "Editar transacción" : "Registrar transacción"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* COLUMNA IZQUIERDA */}
                    <div className="space-y-4">
                        {/* Fecha */}
                        <div className="space-y-1">
                            <Label>Fecha</Label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>

                        {/* Descripción */}
                        <div className="space-y-1">
                            <Label>Descripción</Label>
                            <Input
                                placeholder="Ej: Supermercado, sueldo..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Tipo */}
                        <div className="space-y-1">
                            <Label>Tipo</Label>
                            <Select value={type} onValueChange={(v: Transaction["type"]) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Ingreso</SelectItem>
                                    <SelectItem value="expense">Egreso</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Categoría */}
                        <div className="space-y-1">
                            <Label>Categoría</Label>
                            <Select
                                value={categoryId ? String(categoryId) : ""}
                                onValueChange={(v) => setCategoryId(Number(v))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="space-y-4">
                        {/* Monto */}
                        <div className="space-y-1">
                            <Label>Monto</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={amount ?? ""}
                                min={1}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>

                        {/* Total compra */}
                        <div className="space-y-1">
                            <Label>Total de la compra (si difiere del monto)</Label>
                            <Input
                                type="number"
                                placeholder="Ej: 120000"
                                value={totalAmount ?? ""}
                                onChange={(e) => setTotalAmount(Number(e.target.value))}
                            />
                        </div>

                        {/* Reintegro */}
                        <div className="space-y-1">
                            <Label>Reintegro o devolución</Label>
                            <Input
                                type="number"
                                placeholder="Ej: 5000"
                                value={reimbursedAmount ?? ""}
                                onChange={(e) => setReimbursedAmount(Number(e.target.value))}
                            />
                        </div>

                        {/* Método de pago */}
                        <div className="space-y-1">
                            <Label>Método de pago</Label>
                            <Select value={method} onValueChange={(v: "account" | "credit_card") => setMethod(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar método" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="account">Cuenta</SelectItem>
                                    <SelectItem value="credit_card">Tarjeta de crédito</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Cuenta o tarjeta */}
                        {method === "account" ? (
                            <div className="space-y-1">
                                <Label>Cuenta</Label>
                                <Select
                                    value={accountId ? String(accountId) : ""}
                                    onValueChange={(v) => setAccountId(Number(v))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar cuenta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((a) => (
                                            <SelectItem key={a.id} value={String(a.id)}>
                                                {a.type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <Label>Tarjeta de crédito</Label>
                                    <Select
                                        value={creditCardId ? String(creditCardId) : ""}
                                        onValueChange={(v) => setCreditCardId(Number(v))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar tarjeta" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {creditCards.map((cc) => (
                                                <SelectItem key={cc.id} value={String(cc.id)}>
                                                    {cc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label>Cuotas</Label>
                                    <Select
                                        value={String(installments)}
                                        onValueChange={(v) => setInstallments(Number(v))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="1" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <SelectItem key={i + 1} value={String(i + 1)}>
                                                    {i + 1} cuota{i + 1 > 1 ? "s" : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Fila completa para switches */}
                    <div className="col-span-2 flex items-center justify-between border-t pt-3 mt-3">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Switch id="shared" checked={shared} onCheckedChange={setShared} />
                                <Label htmlFor="shared">Gasto compartido</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                                <Label htmlFor="isActive">Activa</Label>
                            </div>
                        </div>

                        <Button onClick={handleSubmit}>
                            {transaction ? "Guardar cambios" : "Registrar"}
                        </Button>
                    </div>
                </div>
            </DialogContent>

        </Dialog>
    )
}
