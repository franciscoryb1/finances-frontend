export interface Installment {
    id?: number
    transaction_id: number
    statement_id?: number
    installment_number: number
    amount: number
    due_date: Date
    paid?: boolean
    is_active?: boolean
    transaction_description?: string
}