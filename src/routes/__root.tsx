import { HeadContent, Outlet, Scripts, createRootRoute, useRouter } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { useEffect } from "react"
import appCss from "../styles.css?url"
import { AuthProvider } from "@/core/auth-provider"
import { useAuth } from "@/core/auth-context"


interface MyRouterContext {
  isAuthenticated: boolean
}

export const Route = createRootRoute({
  context: () => ({
    isAuthenticated: false,
  } as MyRouterContext),
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Scripts />
        </AuthProvider>
      </body>
    </html>
  )
}

function RootComponent() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    router.update({
      context: {
        ...router.options.context,
        isAuthenticated,
      },
    })
  }, [isAuthenticated, router])

  return (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
