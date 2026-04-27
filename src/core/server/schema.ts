import { date, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { TransactionType } from "@/features/transactions/types"

export const transactionTypeEnum = pgEnum('transaction_type', [TransactionType.INCOME, TransactionType.EXPENSE])

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: transactionTypeEnum('type').notNull().default(TransactionType.EXPENSE),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  transactionDate: date("transaction_date").notNull(),
  paymentDate: date("payment_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
