import * as v from 'valibot'
import { TransactionType } from './types'

export const insertTransactionSchema = v.object({
  type: v.enum(TransactionType, 'Type must be INCOME or EXPENSE'),
  valueInCents: v.pipe(
    v.number('Value must be a number'),
    v.integer('Value must be an integer representing cents'),
    v.minValue(1, 'Value must be greater than zero')
  ),
  description: v.pipe(
    v.string(),
    v.minLength(1, 'Description is required')
  ),
  transactionDate: v.pipe(
    v.string(),
    v.isoDate()
  ),
  paymentDate: v.pipe(
    v.string(),
    v.isoDate()
  ),
})

export type InsertTransactionSchema = v.InferOutput<typeof insertTransactionSchema>

export const editTransactionSchema = v.object({
  id: v.string(),
  ...insertTransactionSchema.entries,
})

export type EditTransactionSchema = v.InferOutput<typeof editTransactionSchema>

export const updateTransactionSchema = v.intersect([
  v.object({
    id: v.string(),
  }),
  v.partial(insertTransactionSchema)
])

export type UpdateTransactionSchema = v.InferOutput<typeof updateTransactionSchema>
