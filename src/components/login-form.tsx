import { Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import type { LoginSchema } from "@/features/auth/schemas";
import { cn } from "@/lib/utils"
import { 
  Button, 
  Input,
  Label,
  FieldError,
  TextField,
} from "@heroui/react"
import { loginSchema } from "@/features/auth/schemas"
import { loginAction } from "@/core/auth-functions"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()

  const form = useForm({
    validators: {
      onChange: loginSchema,
    },
    defaultValues: {
      username: "",
      password: "",
    } as LoginSchema,
    onSubmit: async ({ value }) => {
      try {
        await loginAction({ data: value })
        navigate({ to: "/" })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Invalid username or password"
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
        <h1 className="text-xl font-bold">Login to your account</h1>
        <p className="text-small text-default-500">
          Enter your username below to login to your account
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
        <form.Subscribe
          selector={(state) => [state.errors]}
          children={([errors]) =>
            errors.length > 0 ? (
              <div className="text-sm font-medium text-danger">
                {errors.join(", ")}
              </div>
            ) : null
          }
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
                {field.state.meta.errors.join(", ")}
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
                {field.state.meta.errors.join(", ")}
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
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          )}
        />
        
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}
