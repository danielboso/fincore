import { createServerFn } from "@tanstack/react-start"
import { setResponseStatus } from "@tanstack/react-start/server"
import { and, eq, lt, sql } from "drizzle-orm"
import { db } from "@/core/server/db"
import { transactions } from "@/core/server/schema"
import { getSession } from "@/core/auth-functions"
import { TransactionType } from "@/features/transactions/types"

export interface DashboardTotals {
  initialBalanceCents: number
  totalIncomeCents: number
  totalExpenseCents: number
}

function getCurrentMonthBounds() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`
  const nextMonthDate = new Date(year, month, 1)
  const nextMonthStart = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, "0")}-01`

  return { monthStart, nextMonthStart }
}

export const getDashboardTotals = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardTotals> => {
    const session = await getSession()
    if (!session) {
      setResponseStatus(401)
      throw new Error("Unauthorized")
    }

    const { monthStart, nextMonthStart } = getCurrentMonthBounds()

    const [row] = await db
      .select({
        initialBalanceCents: sql<number>`coalesce(sum(case when ${transactions.transactionDate} < ${monthStart} and ${transactions.type} = ${TransactionType.INCOME} then ${transactions.valueInCents} when ${transactions.transactionDate} < ${monthStart} and ${transactions.type} = ${TransactionType.EXPENSE} then -${transactions.valueInCents} else 0 end), 0)`.mapWith(
          Number
        ),
        totalIncomeCents: sql<number>`coalesce(sum(case when ${transactions.transactionDate} >= ${monthStart} and ${transactions.type} = ${TransactionType.INCOME} then ${transactions.valueInCents} else 0 end), 0)`.mapWith(
          Number
        ),
        totalExpenseCents: sql<number>`coalesce(sum(case when ${transactions.transactionDate} >= ${monthStart} and ${transactions.type} = ${TransactionType.EXPENSE} then ${transactions.valueInCents} else 0 end), 0)`.mapWith(
          Number
        ),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.user.id),
          lt(transactions.transactionDate, nextMonthStart)
        )
      )

    return (
      row ?? {
        initialBalanceCents: 0,
        totalIncomeCents: 0,
        totalExpenseCents: 0,
      }
    )
  }
)
