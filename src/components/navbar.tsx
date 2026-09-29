import { Link, useNavigate } from "@tanstack/react-router"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, ToggleButtonGroup, ToggleButton } from "@heroui/react"
import { useTranslation } from "react-i18next"
import { logoutAction } from "@/core/auth-functions"

export function Navbar() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  
  const handleLogout = async () => {
    await logoutAction()
    navigate({ to: "/login" })
  }

  const currentLang = (i18n.language || 'en').startsWith('pt') ? 'pt' : 'en'

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
              {t('dashboard')}
            </Link>
            <Link 
              to="/transactions" 
              className="text-sm font-medium text-default-600 transition-colors hover:text-primary data-[active=true]:text-primary" 
              activeProps={{ "data-active": "true" }}
            >
              {t('transactions')}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ToggleButtonGroup 
            size="sm" 
            isDetached 
            selectedKeys={new Set([currentLang])}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string
              if (selected) i18n.changeLanguage(selected)
            }}
          >
            <ToggleButton id="en">EN</ToggleButton>
            <ToggleButton id="pt">PT</ToggleButton>
          </ToggleButtonGroup>

          <Dropdown>
            <DropdownTrigger>
              <Button
                className="transition-transform"
                size="sm"
                variant="ghost"
              >
                Profile
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions">
              <DropdownItem key="logout" className="text-danger" onPress={handleLogout}>
                {t('logout')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}
