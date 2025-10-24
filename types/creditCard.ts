export interface CreditCard {
    id?: number
    user_id: number
    bank_id: number
    name: string
    brand: 'VISA' | 'MasterCard'
    limit_amount?: number
    balance?: number
    expiration_date: Date
    is_active: boolean
    color?: string
    last_four?: number
}