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
import { useNavigate } from "@tanstack/react-router"
import { type ChangeEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { insertTransactionSchema } from "@/features/transactions/schemas"
import { createTransaction } from "@/features/transactions/functions"
import { TransactionType } from "@/features/transactions/types"
import { parseToCents } from "@/lib/formatters"

interface CreateTransactionFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreateTransactionForm({
  onSuccess,
  onCancel,
}: CreateTransactionFormProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [displayValue, setDisplayValue] = useState("")

  const form = useForm({
    validators: {
      onChange: insertTransactionSchema,
    },
    defaultValues: {
      type: TransactionType.EXPENSE,
      valueInCents: 0,
      description: "",
      transactionDate: new Date().toISOString().split("T")[0],
      paymentDate: new Date().toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      try {
        await createTransaction({ data: value })
        form.reset()
        setDisplayValue("")
        onSuccess()
        await navigate({ to: "/transactions", replace: true })
      } catch (err) {
        console.error("Failed to create transaction:", err)
      }
    },
  })

  const handleAmountChange = (
    e: ChangeEvent<HTMLInputElement>,
    onFieldChange: (cents: number) => void
  ) => {
    const raw = e.target.value
    setDisplayValue(raw)
    onFieldChange(parseToCents(raw))
  }

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
          name="valueInCents"
          children={(field) => (
            <TextField isInvalid={field.state.meta.errors.length > 0}>
              <Label className="text-sm font-medium">
                {t("transactionsPage.form.valueLabel")}
              </Label>
              <Input
                placeholder={t("transactionsPage.form.valuePlaceholder")}
                name={field.name}
                value={displayValue}
                onBlur={field.handleBlur}
                onChange={(e) => handleAmountChange(e, field.handleChange)}
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
                : t("transactionsPage.form.saveTransaction")}
            </Button>
          )}
        />
      </div>
    </form>
  )
}
