import { createServerFn } from "@tanstack/react-start"
import { setResponseStatus } from "@tanstack/react-start/server"
import { db } from "@/core/server/db"
import { transactions } from "@/core/server/schema"
import { eq, desc, and } from "drizzle-orm"
import { insertTransactionSchema, updateTransactionSchema } from "./schemas"
import { getSession } from "@/core/auth-functions"
import * as v from 'valibot'

export const getTransactions = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = await getSession()
    if (!session) {
      setResponseStatus(401)
      throw new Error("Unauthorized")
    }

    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, session.user.id))
      .orderBy(desc(transactions.paymentDate))
  })

export const createTransaction = createServerFn({ method: "POST" })
  .inputValidator(insertTransactionSchema)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) {
      setResponseStatus(401)
      throw new Error("Unauthorized")
    }

    const [result] = await db.insert(transactions).values({
      userId: session.user.id,
      type: data.type,
      value: data.value,
      description: data.description,
      transactionDate: data.transactionDate,
      paymentDate: data.paymentDate,
    }).returning()

    return result
  })

export const updateTransaction = createServerFn({ method: "POST" })
  .inputValidator(updateTransactionSchema)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) {
      setResponseStatus(401)
      throw new Error("Unauthorized")
    }

    const { id, ...updates } = data

    if (!id) {
      setResponseStatus(400)
      throw new Error("Transaction ID is required")
    }

    const [result] = await db.update(transactions)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(and(
        eq(transactions.id, id),
        eq(transactions.userId, session.user.id)
      ))
      .returning()

    if (!result) {
      setResponseStatus(404)
      throw new Error("Transaction not found or unauthorized")
    }

    return result
  })

export const deleteTransaction = createServerFn({ method: "POST" })
  .inputValidator(v.string())
  .handler(async ({ data: id }) => {
    const session = await getSession()
    if (!session) {
      setResponseStatus(401)
      throw new Error("Unauthorized")
    }

    const [result] = await db.delete(transactions)
      .where(and(
        eq(transactions.id, id),
        eq(transactions.userId, session.user.id)
      ))
      .returning()

    if (!result) {
      setResponseStatus(404)
      throw new Error("Transaction not found or unauthorized")
    }

    return { success: true }
  })
