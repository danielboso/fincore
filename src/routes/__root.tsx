import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import appCss from "../styles.css?url"
import { AuthProvider } from "@/core/auth-provider"
import { getSession } from "@/core/auth-functions"
import type { User } from "@/core/auth-context"

interface MyRouterContext {
  isAuthenticated: boolean
  user: User | null
}

const rootRouteContext = createRootRouteWithContext<MyRouterContext>()

export const Route = rootRouteContext({
  beforeLoad: async () => {
    const session = await getSession()
    return {
      isAuthenticated: !!session,
      user: session?.user ?? null,
    }
  },
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
        title: "Fincore",
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
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const { user, isAuthenticated } = Route.useRouteContext()

  return (
    <>
      <AuthProvider initialUser={user} initialIsAuthenticated={isAuthenticated}>
        <Outlet />
      </AuthProvider>
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
