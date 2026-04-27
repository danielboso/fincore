import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/")({
  component: App,
})

function App() {
  const { user } = Route.useRouteContext()

  return (
    <div className="flex min-h-[calc(100vh-64px)] p-6 items-center justify-center">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-center">
        <h1 className="font-bold text-4xl">Fincore</h1>
        <p className="text-default-500">Welcome back, {user?.name || user?.username}!</p>
      </div>
    </div>
  )
}
