import { describe, expect, it } from 'vitest'
import * as v from 'valibot'
import { insertTransactionSchema } from '../schemas'
import { TransactionType } from '../types'

describe('insertTransactionSchema', () => {
  it('should validate a correct transaction', () => {
    const data = {
      type: TransactionType.EXPENSE,
      valueInCents: 10050,
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
      valueInCents: 10050,
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
      valueInCents: 10050,
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

  it('should fail with a non-integer or non-positive amount', () => {
    const dataDecimal = {
      type: TransactionType.EXPENSE,
      valueInCents: 100.5,
      description: 'Groceries',
      transactionDate: '2023-10-01',
      paymentDate: '2023-10-02',
    }
    const resultDecimal = v.safeParse(insertTransactionSchema, dataDecimal)
    expect(resultDecimal.success).toBe(false)

    const dataNegative = {
      type: TransactionType.EXPENSE,
      valueInCents: 0,
      description: 'Groceries',
      transactionDate: '2023-10-01',
      paymentDate: '2023-10-02',
    }
    const resultNegative = v.safeParse(insertTransactionSchema, dataNegative)
    expect(resultNegative.success).toBe(false)
  })

  it('should fail with an invalid date format (YYYY-MM-DD)', () => {
    const data = {
      type: TransactionType.EXPENSE,
      valueInCents: 10050,
      description: 'Groceries',
      transactionDate: '01/10/2023',
      paymentDate: '2023-10-02',
    }
    const result = v.safeParse(insertTransactionSchema, data)
    expect(result.success).toBe(false)
  })
})
