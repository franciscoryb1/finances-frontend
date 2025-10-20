export interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
  color?: string
  is_active: boolean
}