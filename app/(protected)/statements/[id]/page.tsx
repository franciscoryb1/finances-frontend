"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/axios"
import type { Statement } from "@/types/statement"
import type { Installment } from "@/types/installment"
import type { Transaction } from "@/types/transaction"
import type { CreditCard } from "@/types/creditCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, DollarSign, CheckCircle, XCircle, Calendar, CreditCard as CreditCardIcon } from "lucide-react"
import { InstallmentsTable } from "../components/InstallmentsTable"
import { TransactionTable } from "../../transactions/components/TransactionTable"
import { CreditCardDisplay } from "@/components/CreditCardDisplay"

export default function StatementDetailPage() {
    const params = useParams()
    const router = useRouter()
    const statementId = Number(params.id)

    const [statement, setStatement] = useState<Statement | null>(null)
    const [creditCard, setCreditCard] = useState<CreditCard | null>(null)
    const [installments, setInstallments] = useState<Installment[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchStatementDetail()
    }, [statementId])

    const fetchStatementDetail = async () => {
        try {
            setLoading(true)

            // Obtener el resumen
            const { data: statementData } = await api.get<Statement>(`/statements/detail/${statementId}`)
            setStatement(statementData)

            // Obtener la tarjeta de credito
            const { data: cardData } = await api.get<CreditCard>(`/cards/${statementData.credit_card_id}`)
            setCreditCard(cardData)

            // Obtener todas las transacciones del statement
            const { data: allTransactions } = await api.get<Transaction[]>(`/transactions/statement/${statementId}`)
            setTransactions(allTransactions)

            // Traer cuotas por statement_id
            const { data: allInstallments } = await api.get<Installment[]>(`/installments/statement/${statementId}`)

            // Traer las descripciones de las transacciones para cada cuota
            const installmentsWithTransactions = await Promise.all(
                allInstallments.map(async (installment) => {
                    try {
                        const { data: transaction } = await api.get<Transaction>(`/transactions/${installment.transaction_id}`)
                        return {
                            ...installment,
                            transaction_description: transaction?.description || "-"
                        }
                    } catch (error) {
                        // Si falla la petición, devolver la cuota sin descripción
                        return {
                            ...installment,
                            transaction_description: "-"
                        }
                    }
                })
            )

            setInstallments(installmentsWithTransactions)

        } catch (err: any) {
            console.error("Error al cargar el detalle del statement:", err)
            setError(err.response?.data?.message || "Error al cargar el detalle")
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsPaid = async () => {
        try {
            await api.put(`/statements/${statementId}`, { status: 'paid' })
            fetchStatementDetail()
        } catch (err: any) {
            console.error("Error al marcar como pagado:", err)
        }
    }

    const handleMarkInstallmentAsPaid = async (installmentId: number) => {
        try {
            await api.patch(`/installments/${installmentId}/paid`)
            fetchStatementDetail()
        } catch (err: any) {
            console.error("Error al marcar cuota como pagada:", err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Cargando detalle del resumen...</p>
            </div>
        )
    }

    if (error || !statement) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-destructive">{error || "Resumen no encontrado"}</p>
                <Button onClick={() => router.back()}>Volver</Button>
            </div>
        )
    }

    // total transaccion 1 pago
    const transactionsSinglePayment = transactions.filter(t => (t.installments ?? 1) === 1)
    const totalFromSingleTransactions = transactionsSinglePayment.reduce((sum, t) => sum + t.amount, 0)

    // total cuotas
    const totalFromInstallments = installments.reduce((sum, i) => sum + i.amount, 0)

    console.log('installments: ', installments);
    console.log('totalFromInstallments: ', totalFromInstallments);

    const totalAmount = (totalFromSingleTransactions + totalFromInstallments)
    const paidAmount = statement.paid_amount || 0
    const remainingAmount = totalAmount - paidAmount
    const installmentsPaid = installments.filter(i => i.paid).length
    const installmentsTotal = installments.length

    const statusConfig = {
        open: { variant: "default" as const, label: "Abierto" },
        closed: { variant: "secondary" as const, label: "Cerrado" },
        paid: { variant: "default" as const, label: "Pagado" },
        partial: { variant: "outline" as const, label: "Parcial" }
    }
    const currentStatus = statusConfig[statement.status || 'open']

    const currency = (value: number) =>
        new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 }).format(value)

    const formatDate = (value: string | Date) => {
        const date = new Date(value)
        return date.toLocaleDateString("es-AR", { year: "numeric", month: "2-digit", day: "2-digit" })
    }

    const daysUntilEnd = Math.ceil((new Date(statement.period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const daysUntilDue = Math.ceil((new Date(statement.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const availableCredit = (creditCard?.limit_amount || 0) - (creditCard?.balance || 0)
    const utilizationPercentage = creditCard?.limit_amount
        ? ((totalAmount / creditCard.limit_amount) * 100).toFixed(1)
        : "0"

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Detalle del Resumen</h1>
                        <p className="text-muted-foreground">
                            {formatDate(statement.period_start)} - {formatDate(statement.period_end)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={currentStatus.variant}>{currentStatus.label}</Badge>
                    {statement.status !== 'paid' && (
                        <Button onClick={handleMarkAsPaid}>Marcar como pagado</Button>
                    )}
                </div>
            </div>

            {/* Información de la Tarjeta */}
            {creditCard &&
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <CreditCardDisplay creditCard={creditCard} />

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                            <CardTitle className="text-sm font-medium">Fechas del Resumen</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-row space-x-3">
                                {/* Fecha de Cierre */}
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Fecha de Cierre</p>
                                    <div className="text-xl font-bold">
                                        {new Date(statement.period_end).toLocaleDateString("es-AR", {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(statement.period_end) < new Date() && statement.status !== 'paid'
                                            ? "Cerrado!"
                                            : `${daysUntilEnd} días restantes`}
                                    </p>
                                </div>

                                {/* Separador visual */}
                                <div className="border-t border-muted"></div>

                                {/* Fecha de Vencimiento */}
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Fecha de Vencimiento</p>
                                    <div className="text-xl font-bold">
                                        {new Date(statement.due_date).toLocaleDateString("es-AR", {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(statement.due_date) < new Date() && statement.status !== 'paid'
                                            ? "¡Vencido!"
                                            : `${daysUntilDue} días restantes`}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {/* Desglose */}
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Pago único:</span>
                                        <span className="font-medium">{currency(totalFromSingleTransactions)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Cuotas:</span>
                                        <span className="font-medium">{currency(totalFromInstallments)}</span>
                                    </div>
                                </div>

                                {/* Separador */}
                                <div className="border-t border-muted"></div>

                                {/* Total destacado */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Total:</span>
                                    <span className="text-2xl font-bold text-red-600">{currency(totalAmount)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            }

            {/* Tabs de movimientos */}
            <Tabs defaultValue="installments" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="installments">
                        Cuotas ({installments.length})
                    </TabsTrigger>
                    <TabsTrigger value="transactions">
                        Transacciones ({transactionsSinglePayment.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="installments" className="space-y-4">
                    <InstallmentsTable
                        data={installments}
                        onMarkAsPaid={handleMarkInstallmentAsPaid}
                    />
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                    <TransactionTable data={transactionsSinglePayment} />
                </TabsContent>
            </Tabs>
        </div>
    )
}