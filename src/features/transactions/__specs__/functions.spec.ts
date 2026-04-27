import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../functions'
import { db } from '@/core/server/db'
import { getSession } from '@/core/auth-functions'
import { setResponseStatus } from '@tanstack/react-start/server'
import { TransactionType } from '../types'

// Mock Drizzle ORM
vi.mock('@/core/server/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockImplementation(() => [{ 
      id: '1', 
      userId: 'user-1',
      type: 'EXPENSE', 
      value: '100.00',
      description: 'Test',
      transactionDate: '2023-11-01',
      paymentDate: '2023-11-01',
      createdAt: new Date(),
      updatedAt: new Date()
    }]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockImplementation(() => [{ id: '2' }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  }
}))

// Mock Authentication
vi.mock('@/core/auth-functions', () => ({
  getSession: vi.fn()
}))

// Mock TanStack Start server functions
vi.mock('@tanstack/react-start', () => {
  return {
    createServerFn: vi.fn().mockImplementation(() => {
      const chain = {
        inputValidator: vi.fn().mockReturnThis(),
        validator: vi.fn().mockReturnThis(),
        middleware: vi.fn().mockReturnThis(),
        handler: vi.fn().mockImplementation((handler) => {
          return (args: { data: unknown }) => handler(args)
        }),
      }
      return chain
    }),
  }
})

// Mock TanStack server utilities
vi.mock('@tanstack/react-start/server', () => ({
  setResponseStatus: vi.fn()
}))

// Mock Drizzle operators
vi.mock('drizzle-orm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('drizzle-orm')>()
  return {
    ...actual,
    eq: vi.fn(),
    desc: vi.fn(),
    and: vi.fn(),
  }
})

describe('Transaction Server Functions', () => {
  const mockUser = {
    id: 'user-1',
    username: 'testuser',
    name: 'Test User'
  }

  const mockSession = {
    id: 'session-1',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60)
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTransactions', () => {
    it('should return transactions when authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue({ user: mockUser, session: mockSession })
      
      const result = await getTransactions({ data: undefined })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
      expect(db.select).toHaveBeenCalled()
    })

    it('should throw an error when not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)
      
      await expect(getTransactions({ data: undefined })).rejects.toThrow('Unauthorized')
      expect(setResponseStatus).toHaveBeenCalledWith(401)
    })
  })

  describe('createTransaction', () => {
    it('should create a transaction when authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue({ user: mockUser, session: mockSession })
      
      const result = await createTransaction({
        data: {
          type: TransactionType.INCOME,
          value: '200.00',
          description: 'Salary',
          transactionDate: '2023-11-01',
          paymentDate: '2023-11-01'
        }
      })
      
      expect(result).toEqual({ id: '2' })
      expect(db.insert).toHaveBeenCalled()
    })

    it('should throw an error when not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)
      
      await expect(createTransaction({
        data: {
          type: TransactionType.INCOME,
          value: '200.00',
          description: 'Salary',
          transactionDate: '2023-11-01',
          paymentDate: '2023-11-01'
        }
      })).rejects.toThrow('Unauthorized')
      expect(setResponseStatus).toHaveBeenCalledWith(401)
    })
  })

  describe('updateTransaction', () => {
    it('should update a transaction when authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue({ user: mockUser, session: mockSession })
      
      const result = await updateTransaction({
        data: {
          id: 'txn-1',
          description: 'Updated Description'
        }
      })
      
      expect(result).toEqual({ id: '2' })
      expect(db.update).toHaveBeenCalled()
    })

    it('should throw an error when transaction ID is missing', async () => {
      vi.mocked(getSession).mockResolvedValue({ user: mockUser, session: mockSession })
      
      await expect(updateTransaction({
        data: { id: '', description: 'Updated Description' }
      })).rejects.toThrow('Transaction ID is required')
      expect(setResponseStatus).toHaveBeenCalledWith(400)
    })

    it('should throw an error when not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)
      
      await expect(updateTransaction({
        data: {
          id: 'txn-1',
          description: 'Updated Description'
        }
      })).rejects.toThrow('Unauthorized')
    })
  })

  describe('deleteTransaction', () => {
    it('should delete a transaction when authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue({ user: mockUser, session: mockSession })
      
      const result = await deleteTransaction({ data: 'txn-1' })
      
      expect(result).toEqual({ success: true })
      expect(db.delete).toHaveBeenCalled()
    })

    it('should throw an error when not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)
      
      await expect(deleteTransaction({ data: 'txn-1' })).rejects.toThrow('Unauthorized')
    })
  })
})
