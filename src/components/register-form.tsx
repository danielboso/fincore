import { useNavigate, Link } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import type { RegisterSchema } from "@/features/auth/schemas"
import { cn } from "@/lib/utils"
import {
  Button,
  Input,
  Label,
  FieldError,
  TextField,
} from "@heroui/react"
import { registerSchema } from "@/features/auth/schemas"
import { registerAction } from "@/core/auth-functions"
import { type ComponentProps } from "react"

export function RegisterForm({ className, ...props }: ComponentProps<"div">) {
  const navigate = useNavigate()

  const form = useForm({
    validators: {
      onChange: registerSchema,
    },
    defaultValues: {
      name: "",
      username: "",
      password: "",
    } as RegisterSchema,
    onSubmit: async ({ value }) => {
      try {
        await registerAction({ data: value })
        navigate({ to: "/" })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong"
        form.setErrorMap({
          onSubmit: {
            form: message,
            fields: {},
          },
        })
      }
    },
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-xl font-bold">Create an account</h1>
        <p className="text-small text-default-500">
          Enter your details below to create an account
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex flex-col gap-4"
      >
        <form.Field
          name="name"
          children={(field) => (
            <TextField
              className="flex flex-col gap-1"
              isInvalid={!!field.state.meta.errors.length}
            >
              <Label className="text-sm font-medium">Full Name</Label>
              <Input
                placeholder="John Doe"
                type="text"
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
          name="username"
          children={(field) => (
            <TextField
              className="flex flex-col gap-1"
              isInvalid={!!field.state.meta.errors.length}
            >
              <Label className="text-sm font-medium">Username</Label>
              <Input
                placeholder="Enter your username"
                type="text"
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
          name="password"
          children={(field) => (
            <TextField
              className="flex flex-col gap-1"
              isInvalid={!!field.state.meta.errors.length}
            >
              <Label className="text-sm font-medium">Password</Label>
              <Input
                placeholder="Enter your password"
                type="password"
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

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full mt-2"
              isDisabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          )}
        />

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}
