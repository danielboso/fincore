import { createFileRoute } from '@tanstack/react-router'
import { Login } from '@/features/auth/login'

export const Route = createFileRoute('/_auth/login')({
  component: LoginComponent,
})

function LoginComponent() {
  return <Login />
}
