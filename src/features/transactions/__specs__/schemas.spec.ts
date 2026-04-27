import { describe, it, expect } from 'vitest'
import * as v from 'valibot'
import { insertTransactionSchema } from '../schemas'
import { TransactionType } from '../types'

describe('insertTransactionSchema', () => {
  it('should validate a correct transaction', () => {
    const data = {
      type: TransactionType.EXPENSE,
      value: '100.50',
      description: 'Groceries',
      transactionDate: '2023-10-01',
      paymentDate: '2023-10-02',
    }
    const result = v.safeParse(insertTransactionSchema, data)
    expect(result.success).toBe(true)
  })

  it('should fail with an invalid type', () => {
    const data = {
      type: 'TRANSFER',
      value: '100.50',
      description: 'Groceries',
      transactionDate: '2023-10-01',
      paymentDate: '2023-10-02',
    }
    const result = v.safeParse(insertTransactionSchema, data)
    expect(result.success).toBe(false)
  })

  it('should fail with an empty description', () => {
    const data = {
      type: TransactionType.EXPENSE,
      value: '100.50',
      description: '',
      transactionDate: '2023-10-01',
      paymentDate: '2023-10-02',
    }
    const result = v.safeParse(insertTransactionSchema, data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues[0].message).toBe('Description is required')
    }
  })

  it('should fail with an invalid amount format', () => {
    const data = {
      type: TransactionType.EXPENSE,
      value: 'abc',
      description: 'Groceries',
      transactionDate: '2023-10-01',
      paymentDate: '2023-10-02',
    }
    const result = v.safeParse(insertTransactionSchema, data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues[0].message).toBe('Invalid amount format (e.g. 10.00)')
    }
  })

  it('should fail with an invalid date format (YYYY-MM-DD)', () => {
    const data = {
      type: TransactionType.EXPENSE,
      value: '100.50',
      description: 'Groceries',
      transactionDate: '01/10/2023',
      paymentDate: '2023-10-02',
    }
    const result = v.safeParse(insertTransactionSchema, data)
    expect(result.success).toBe(false)
  })
})
