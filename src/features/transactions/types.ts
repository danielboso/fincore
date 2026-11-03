import type { transactions } from "@/core/server/schema"

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export type Transaction = typeof transactions.$inferSelect
