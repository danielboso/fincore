import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@heroui/react"
import { logoutAction } from "@/core/auth-functions"

export function Navbar() {
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    await logoutAction()
    navigate({ to: "/login" })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-divider bg-background/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight">
            FINCORE
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-default-600 transition-colors hover:text-primary data-[active=true]:text-primary" 
              activeProps={{ "data-active": "true" }}
              activeOptions={{ exact: true }}
            >
              Dashboard
            </Link>
            <Link 
              to="/transactions" 
              className="text-sm font-medium text-default-600 transition-colors hover:text-primary data-[active=true]:text-primary" 
              activeProps={{ "data-active": "true" }}
            >
              Transactions
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onPress={handleLogout} 
            variant="outline" 
            size="sm"
            className="border-danger text-danger hover:bg-danger hover:text-white"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
