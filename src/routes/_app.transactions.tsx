import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  Button,
  Table,
  Input,
  Label,
  FieldError,
  TextField,
  Select,
  ListBox,
} from "@heroui/react"
import { useForm } from "@tanstack/react-form"
import { insertTransactionSchema, type InsertTransactionSchema } from "@/features/transactions/schemas"
import { createTransaction, getTransactions, deleteTransaction } from "@/features/transactions/functions"
import { TransactionType } from "@/features/transactions/types"
import { useState } from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"

export const Route = createFileRoute("/_app/transactions")({
  loader: async () => {
    return await getTransactions()
  },
  component: TransactionsPage,
})

const columns = [
  { id: "type", label: "TYPE" },
  { id: "description", label: "DESCRIPTION" },
  { id: "value", label: "VALUE" },
  { id: "transactionDate", label: "TRANSACTION DATE" },
  { id: "paymentDate", label: "PAYMENT DATE" },
  { id: "actions", label: "ACTIONS" },
]

function TransactionsPage() {
  const transactions = Route.useLoaderData()
  const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState(false)

  const form = useForm({
    validators: {
      onChange: insertTransactionSchema,
    },
    defaultValues: {
      type: TransactionType.EXPENSE,
      value: "",
      description: "",
      transactionDate: new Date().toISOString().split('T')[0],
      paymentDate: new Date().toISOString().split('T')[0],
    } as InsertTransactionSchema,
    onSubmit: async ({ value }) => {
      try {
        await createTransaction({ data: value })
        form.reset()
        setIsAdding(false)
        navigate({ to: '/transactions', replace: true })
      } catch (err) {
        console.error(err)
      }
    },
  })

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction({ data: id })
      navigate({ to: '/transactions', replace: true })
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onPress={() => setIsAdding(!isAdding)}>
          <PlusIcon size={18} />
          {isAdding ? "Cancel" : "Add Transaction"}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-default-50 p-4 rounded-lg border border-divider">
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
                  <Button type="submit" isDisabled={!canSubmit}>
                    {isSubmitting ? "Saving..." : "Save Transaction"}
                  </Button>
                )}
              />
            </div>
          </form>
        </div>
      ) }

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Transactions table">
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column id={column.id}>
                  {column.label}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body items={transactions}>
              {(item) => (
                <Table.Row id={item.id}>
                  <Table.Cell>
                    <span className={item.type === TransactionType.INCOME ? 'text-success font-medium' : 'text-danger font-medium'}>
                      {item.type}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell className="font-mono">
                    <span className={item.type === TransactionType.INCOME ? 'text-success' : 'text-danger'}>
                      {item.type === TransactionType.INCOME ? '+' : '-'}{item.value}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{item.transactionDate}</Table.Cell>
                  <Table.Cell>{item.paymentDate}</Table.Cell>
                  <Table.Cell>
                    <Button
                      isIconOnly
                      onPress={() => handleDelete(item.id)}
                    >
                      <Trash2Icon size={18} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  )
}
