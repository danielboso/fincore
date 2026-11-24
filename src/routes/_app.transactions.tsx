import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button, Table } from "@heroui/react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import {
  deleteTransaction,
  getTransactions,
} from "@/features/transactions/functions"
import { TransactionType, type Transaction } from "@/features/transactions/types"
import { TransactionModal } from "@/features/transactions/components/transaction-modal"
import { formatCentsToCurrency } from "@/lib/formatters"

export const Route = createFileRoute("/_app/transactions")({
  loader: async () => {
    return await getTransactions()
  },
  component: TransactionsPage,
})

function TransactionsPage() {
  const transactions = Route.useLoaderData()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)

  const columns = useMemo(
    () => [
      { id: "type", label: t("transactionsPage.columns.type") },
      { id: "description", label: t("transactionsPage.columns.description") },
      { id: "valueInCents", label: t("transactionsPage.columns.value") },
      {
        id: "transactionDate",
        label: t("transactionsPage.columns.transactionDate"),
      },
      { id: "paymentDate", label: t("transactionsPage.columns.paymentDate") },
      { id: "actions", label: t("transactionsPage.columns.actions") },
    ],
    [t]
  )

  const handleDelete = async (id: string) => {
    if (confirm(t("common.deleteConfirm"))) {
      await deleteTransaction({ data: id })
      await navigate({ to: "/transactions", replace: true })
    }
  }

  const handleOpenCreate = () => {
    setSelectedTransaction(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {t("transactionsPage.title")}
          </h1>
          <p className="text-xs text-zinc-400">
            {t("transactionsPage.subtitle")}
          </p>
        </div>
        <Button variant="primary" onPress={handleOpenCreate}>
          <PlusIcon size={18} />
          <span>{t("transactionsPage.newTransaction")}</span>
        </Button>
      </div>

      <Table
        variant="secondary"
        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
      >
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabela de transações" className="min-w-full">
            <Table.Header
              columns={columns}
              className="border-b border-white/[0.06] bg-zinc-900/50"
            >
              {(column) => (
                <Table.Column
                  id={column.id}
                  className="!rounded-none !bg-zinc-900/50 px-4 py-3 font-mono text-xs font-semibold tracking-wider text-zinc-400"
                >
                  {column.label}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body items={transactions}>
              {(item) => (
                <Table.Row
                  id={item.id}
                  className="border-b border-white/[0.04] transition-colors hover:!bg-zinc-900/40"
                >
                  <Table.Cell className="px-4 py-3.5">
                    <span
                      className={
                        item.type === TransactionType.INCOME
                          ? "font-medium text-emerald-400"
                          : "font-medium text-rose-400"
                      }
                    >
                      {item.type === TransactionType.INCOME
                        ? t("transactionsPage.types.income")
                        : t("transactionsPage.types.expense")}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3.5 font-medium text-zinc-200">
                    {item.description}
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3.5 font-mono font-semibold">
                    <span
                      className={
                        item.type === TransactionType.INCOME
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }
                    >
                      {item.type === TransactionType.INCOME ? "+" : "-"}
                      {formatCentsToCurrency(item.valueInCents)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3.5 font-mono text-zinc-400">
                    {item.transactionDate}
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3.5 font-mono text-zinc-400">
                    {item.paymentDate}
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="ghost"
                        size="sm"
                        onPress={() => handleOpenEdit(item)}
                      >
                        <PencilIcon size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="danger-soft"
                        size="sm"
                        onPress={() => handleDelete(item.id)}
                      >
                        <Trash2Icon size={16} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <TransactionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        transaction={selectedTransaction}
        onSuccess={async () => {
          await navigate({ to: "/transactions", replace: true })
        }}
      />
    </div>
  )
}
