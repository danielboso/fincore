import { LayoutDashboard, Receipt } from "lucide-react"
import {
  SidebarNavItem,
  type SidebarNavItemProps,
} from "@/components/sidebar-nav-item"

const navItems: readonly SidebarNavItemProps[] = [
  {
    to: "/",
    labelKey: "dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/transactions",
    labelKey: "transactions",
    icon: Receipt,
  },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between border-r border-white/[0.08] bg-zinc-950/95 backdrop-blur-xl">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-18 items-center border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Fincore Logo"
              className="h-9 w-9 object-contain"
            />
            <span className="text-lg font-extrabold tracking-tight text-white">
              FINCORE
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
          <div className="px-2.5 pb-1 text-[10px] font-mono font-semibold tracking-wider text-zinc-500 uppercase">
            Executivo &amp; Fluxo
          </div>
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              labelKey={item.labelKey}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>
    </aside>
  )
}
