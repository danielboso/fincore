import { Modal } from "@heroui/react"
import { useTranslation } from "react-i18next"
import { CreateTransactionForm } from "./create-transaction-form"
import { EditTransactionModalForm } from "./edit-transaction-modal-form"
import type { Transaction } from "@/features/transactions/types"

interface TransactionModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  transaction?: Transaction | null
  onSuccess: () => void
}

export function TransactionModal({
  isOpen,
  onOpenChange,
  transaction,
  onSuccess,
}: TransactionModalProps) {
  const { t } = useTranslation()
  const isEditing = Boolean(transaction)

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="lg">
          <Modal.Dialog className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-zinc-100 shadow-2xl">
            <Modal.CloseTrigger />
            <Modal.Header className="mb-4">
              <Modal.Heading className="text-lg font-bold text-white">
                {isEditing
                  ? t("transactionsPage.editTransaction")
                  : t("transactionsPage.newTransaction")}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {transaction ? (
                <EditTransactionModalForm
                  transaction={transaction}
                  onSuccess={() => {
                    onSuccess()
                    onOpenChange(false)
                  }}
                  onCancel={() => onOpenChange(false)}
                />
              ) : (
                <CreateTransactionForm
                  onSuccess={() => {
                    onSuccess()
                    onOpenChange(false)
                  }}
                  onCancel={() => onOpenChange(false)}
                />
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
