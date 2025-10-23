export interface Account {
  id?: number
  user_id: number
  bank_id?: number
  account_number?: string
  type?: string
  balance?: number
  currency?: string
  is_active?: boolean
}