import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react"
import { useForm } from "@tanstack/react-form"
import { useTranslation } from "react-i18next"
import { editTransactionSchema } from "@/features/transactions/schemas"
import { updateTransaction } from "@/features/transactions/functions"
import { TransactionType, type Transaction } from "@/features/transactions/types"

interface EditTransactionModalFormProps {
  transaction: Transaction
  onSuccess: () => void
  onCancel: () => void
}

export function EditTransactionModalForm({
  transaction,
  onSuccess,
  onCancel,
}: EditTransactionModalFormProps) {
  const { t } = useTranslation()

  const form = useForm({
    validators: {
      onChange: editTransactionSchema,
    },
    defaultValues: {
      id: transaction.id,
      type: transaction.type,
      value: transaction.value,
      description: transaction.description,
      transactionDate: transaction.transactionDate,
      paymentDate: transaction.paymentDate,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateTransaction({ data: value })
        onSuccess()
      } catch (err) {
        console.error("Failed to update transaction:", err)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="type"
          children={(field) => (
            <Select
              isInvalid={field.state.meta.errors.length > 0}
              placeholder={t("transactionsPage.form.typePlaceholder")}
              value={field.state.value}
              onChange={(val) => {
                if (
                  val === TransactionType.EXPENSE ||
                  val === TransactionType.INCOME
                ) {
                  field.handleChange(val)
                }
              }}
            >
              <Label className="text-sm font-medium">
                {t("transactionsPage.form.typeLabel")}
              </Label>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item
                    id={TransactionType.EXPENSE}
                    textValue={t("transactionsPage.types.expense")}
                  >
                    {t("transactionsPage.types.expense")}
                  </ListBox.Item>
                  <ListBox.Item
                    id={TransactionType.INCOME}
                    textValue={t("transactionsPage.types.income")}
                  >
                    {t("transactionsPage.types.income")}
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
              <FieldError className="text-xs text-danger">
                {field.state.meta.errors[0]?.message}
              </FieldError>
            </Select>
          )}
        />

        <form.Field
          name="value"
          children={(field) => (
            <TextField isInvalid={field.state.meta.errors.length > 0}>
              <Label className="text-sm font-medium">
                {t("transactionsPage.form.valueLabel")}
              </Label>
              <Input
                placeholder={t("transactionsPage.form.valuePlaceholder")}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="font-mono"
              />
              <FieldError className="text-xs text-danger">
                {field.state.meta.errors[0]?.message}
              </FieldError>
            </TextField>
          )}
        />
      </div>

      <form.Field
        name="description"
        children={(field) => (
          <TextField isInvalid={field.state.meta.errors.length > 0}>
            <Label className="text-sm font-medium">
              {t("transactionsPage.form.descriptionLabel")}
            </Label>
            <Input
              placeholder={t("transactionsPage.form.descriptionPlaceholder")}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError className="text-xs text-danger">
              {field.state.meta.errors[0]?.message}
            </FieldError>
          </TextField>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="transactionDate"
          children={(field) => (
            <TextField isInvalid={field.state.meta.errors.length > 0}>
              <Label className="text-sm font-medium">
                {t("transactionsPage.form.transactionDateLabel")}
              </Label>
              <Input
                type="date"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError className="text-xs text-danger">
                {field.state.meta.errors[0]?.message}
              </FieldError>
            </TextField>
          )}
        />

        <form.Field
          name="paymentDate"
          children={(field) => (
            <TextField isInvalid={field.state.meta.errors.length > 0}>
              <Label className="text-sm font-medium">
                {t("transactionsPage.form.paymentDateLabel")}
              </Label>
              <Input
                type="date"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError className="text-xs text-danger">
                {field.state.meta.errors[0]?.message}
              </FieldError>
            </TextField>
          )}
        />
      </div>

      <div className="mt-2 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-3">
        <Button variant="ghost" size="sm" onPress={onCancel}>
          {t("common.cancel")}
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isDisabled={!canSubmit}
            >
              {isSubmitting
                ? t("common.saving")
                : t("transactionsPage.form.saveChanges")}
            </Button>
          )}
        />
      </div>
    </form>
  )
}
