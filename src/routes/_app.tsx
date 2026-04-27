import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Navbar } from '@/components/navbar'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context as { isAuthenticated: boolean }
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
