import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { Button } from "@heroui/react"
import { logoutAction } from "@/core/auth-functions"

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context as { isAuthenticated: boolean }
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

function App() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()

  const handleLogout = async () => {
    await logoutAction()
    navigate({ to: "/login" })
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium text-xl">Fincore</h1>
          <p>Welcome back, {user?.name || user?.username}!</p>
          <Button className="mt-4" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  )
}
