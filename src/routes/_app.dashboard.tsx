import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/dashboard")({
  beforeLoad: () => {
    throw redirect({ to: "/" })
  },
})
