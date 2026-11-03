import { useNavigate } from "@tanstack/react-router"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ToggleButtonGroup,
  ToggleButton,
} from "@heroui/react"
import { useTranslation } from "react-i18next"
import { User as UserIcon } from "lucide-react"
import { logoutAction } from "@/core/auth-functions"
import { useAuth } from "@/core/auth-context"

export function Navbar() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { user } = useAuth()

  const handleLogout = async () => {
    await logoutAction()
    navigate({ to: "/login" })
  }

  const currentLang = (i18n.language || "en").startsWith("pt") ? "pt" : "en"

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-end border-b border-white/[0.06] bg-zinc-950/80 px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <ToggleButtonGroup
          size="sm"
          isDetached
          selectedKeys={new Set([currentLang])}
          onSelectionChange={(keys) => {
            for (const key of keys) {
              if (typeof key === "string") {
                i18n.changeLanguage(key)
                break
              }
            }
          }}
        >
          <ToggleButton id="en">EN</ToggleButton>
          <ToggleButton id="pt">PT</ToggleButton>
        </ToggleButtonGroup>

        <Dropdown>
          <DropdownTrigger>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-200"
            >
              <UserIcon className="h-3.5 w-3.5 text-primary" />
              <span>{user?.name || user?.username || "Conta"}</span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions">
            <DropdownItem
              key="logout"
              className="text-danger"
              onPress={handleLogout}
            >
              {t("logout")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  )
}
