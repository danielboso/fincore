import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@heroui/react"
import { useTranslation } from "react-i18next"
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
} from "lucide-react"
import { TransactionModal } from "@/features/transactions/components/transaction-modal"

interface NavItemConfig {
  to: string
  labelKey: string
  defaultLabel: string
  icon: typeof LayoutDashboard
}

const navItems: readonly NavItemConfig[] = [
  {
    to: "/",
    labelKey: "dashboard",
    defaultLabel: "Dashboard Geral",
    icon: LayoutDashboard,
  },
  {
    to: "/transactions",
    labelKey: "transactions",
    defaultLabel: "Lançamentos & Transações",
    icon: Receipt,
  },
]

export function Sidebar() {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between border-r border-white/[0.08] bg-zinc-950/95 backdrop-blur-xl">
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Brand Header */}
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

          {/* Action Button HeroUI */}
          <div className="px-4 py-3">
            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 font-medium shadow-lg shadow-primary/25"
              onPress={() => setIsModalOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span>
                {t("transactionsPage.newTransaction", "Novo Lançamento")}
              </span>
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const label = t(item.labelKey, item.defaultLabel)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900/80 hover:text-white data-[active=true]:border data-[active=true]:border-primary/20 data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary"
                  activeProps={{ "data-active": "true" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      <TransactionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => {}}
      />
    </>
  )
}
