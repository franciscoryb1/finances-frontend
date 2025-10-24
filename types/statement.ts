export interface Statement {
    id?: number
    credit_card_id: number
    period_start: Date
    period_end: Date
    due_date: Date
    total_amount?: number
    paid_amount?: number
    status?: 'open' | 'closed' | 'paid' | 'partial'
    is_active?: boolean
    created_at?: Date
}