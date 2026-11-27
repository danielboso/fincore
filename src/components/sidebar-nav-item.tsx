import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import type { LucideIcon } from "lucide-react"

export interface SidebarNavItemProps {
  to: string
  labelKey: string
  icon: LucideIcon
}

export function SidebarNavItem({
  to,
  labelKey,
  icon: Icon,
}: SidebarNavItemProps) {
  const { t } = useTranslation()
  const isExact = to === "/"

  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-900/80 hover:text-white data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:font-medium data-[active=true]:shadow-md data-[active=true]:shadow-primary/25"
      activeProps={{ "data-active": "true" }}
      activeOptions={{ exact: isExact }}
    >
      <Icon className="h-4 w-4" />
      <span>{t(labelKey)}</span>
    </Link>
  )
}
