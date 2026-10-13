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
import { type UpdateTransactionSchema } from "@/features/transactions/schemas"
import { updateTransactionSchema } from "@/features/transactions/schemas"
import { updateTransaction } from "@/features/transactions/functions"
import { TransactionType } from "@/features/transactions/types"

export function EditTransactionForm({ transaction, onClose, onSuccess }: { transaction: any, onClose: () => void, onSuccess: () => void }) {
  const form = useForm({
    validators: {
      onChange: updateTransactionSchema,
    },
    defaultValues: {
      id: transaction.id,
      type: transaction.type,
      value: transaction.value,
      description: transaction.description,
      transactionDate: transaction.transactionDate,
      paymentDate: transaction.paymentDate,
    } as UpdateTransactionSchema,
    onSubmit: async ({ value }) => {
      try {
        await updateTransaction({ data: value })
        onSuccess()
      } catch (err) {
        console.error(err)
      }
    },
  })

  return (
    <div className="bg-default-50 p-4 rounded-lg border border-primary mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Edit Transaction</h2>
        <Button variant="ghost" size="sm" onPress={onClose}>Cancel</Button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start"
      >
        <form.Field
          name="type"
          children={(field) => (
            <Select
              isInvalid={!!field.state.meta.errors.length}
              placeholder="Select type"
              value={field.state.value}
              onChange={(val) => field.handleChange(val as TransactionType)}
            >
              <Label className="text-sm font-medium">Type</Label>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id={TransactionType.EXPENSE} textValue="Expense">
                    Expense
                  </ListBox.Item>
                  <ListBox.Item id={TransactionType.INCOME} textValue="Income">
                    Income
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
          name="description"
          children={(field) => (
            <TextField isInvalid={!!field.state.meta.errors.length}>
              <Label className="text-sm font-medium">Description</Label>
              <Input
                placeholder="Rent, Groceries..."
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
          name="value"
          children={(field) => (
            <TextField isInvalid={!!field.state.meta.errors.length}>
              <Label className="text-sm font-medium">Value</Label>
              <Input
                placeholder="0.00"
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
          name="transactionDate"
          children={(field) => (
            <TextField isInvalid={!!field.state.meta.errors.length}>
              <Label className="text-sm font-medium">Transaction Date</Label>
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
            <TextField isInvalid={!!field.state.meta.errors.length}>
              <Label className="text-sm font-medium">Payment Date</Label>
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

        <div className="md:col-span-5 flex justify-end">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" variant="primary" isDisabled={!canSubmit}>
                {isSubmitting ? "Saving..." : "Update Transaction"}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  )
}
