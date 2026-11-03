import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ context }) => {
    const isAuthenticated =
      typeof context === "object" &&
      context !== null &&
      "isAuthenticated" in context &&
      Boolean(context.isAuthenticated)

    if (!isAuthenticated) {
      throw redirect({ to: "/login" })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-black text-zinc-100">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-72">
        <Navbar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
