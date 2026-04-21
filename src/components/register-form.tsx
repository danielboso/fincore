import { useNavigate, Link } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
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

  const { register, handleSubmit, setError, formState: { isSubmitting, errors } } = useForm<RegisterSchema>({
    resolver: valibotResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerAction({ data })
      navigate({ to: "/" })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError("root", { message })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-xl font-bold">Create an account</h1>
        <p className="text-small text-default-500">
          Enter your details below to create an account
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {errors.root && (
          <div className="text-sm font-medium text-danger">
            {errors.root.message}
          </div>
        )}
        <TextField 
          name="name" 
          className="flex flex-col gap-1"
          isInvalid={!!errors.name}
        >
          <Label className="text-sm font-medium">Full Name</Label>
          <Input
            placeholder="John Doe"
            type="text"
            {...register("name")}
          />
          <FieldError className="text-xs text-danger">
            {errors.name?.message}
          </FieldError>
        </TextField>
        <TextField 
          name="username" 
          className="flex flex-col gap-1"
          isInvalid={!!errors.username}
        >
          <Label className="text-sm font-medium">Username</Label>
          <Input
            placeholder="Enter your username"
            type="text"
            {...register("username")}
          />
          <FieldError className="text-xs text-danger">
            {errors.username?.message}
          </FieldError>
        </TextField>
        <TextField 
          name="password" 
          className="flex flex-col gap-1"
          isInvalid={!!errors.password}
        >
          <Label className="text-sm font-medium">Password</Label>
          <Input
            placeholder="Enter your password"
            type="password"
            {...register("password")}
          />
          <FieldError className="text-xs text-danger">
            {errors.password?.message}
          </FieldError>
        </TextField>
        <Button
          type="submit"
          className="w-full mt-2"
          isDisabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
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
