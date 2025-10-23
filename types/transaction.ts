// types/transaction.ts
export type TransactionType = "income" | "expense" | "transfer"

export interface Transaction {
  id: number
  user_id: number
  date: string | Date
  description: string
  amount: number
  total_amount: number
  reimbursed_amount: number
  installments: number
  type: TransactionType
  category_id?: number
  category_name?: string
  account_id?: number
  account_name?: string
  credit_card_id?: number
  credit_card_name?: string
  shared: boolean
  is_active: boolean
}
