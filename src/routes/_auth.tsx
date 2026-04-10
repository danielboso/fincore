import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AuthLayout } from '@/layouts/auth-layout'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context as { isAuthenticated: boolean }
    if (isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthLayoutComponent,
})

function AuthLayoutComponent() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}
