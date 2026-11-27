import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import {
  getDashboardTotals,
  type DashboardTotals,
} from "@/features/dashboard/functions"
import { DashboardKpiGrid } from "@/features/dashboard/components/dashboard-kpi-grid"

const EMPTY_TOTALS: DashboardTotals = {
  initialBalanceCents: 0,
  totalIncomeCents: 0,
  totalExpenseCents: 0,
}

export const Route = createFileRoute("/_app/")({
  loader: async () => {
    try {
      return await getDashboardTotals()
    } catch {
      return EMPTY_TOTALS
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const totals = Route.useLoaderData()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-white/[0.06] pb-5">
        <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          {t("dashboardPage.title")}
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          {t("dashboardPage.subtitle")}
        </p>
      </div>

      <DashboardKpiGrid
        totalIncomeCents={totals.totalIncomeCents}
        totalExpenseCents={totals.totalExpenseCents}
        initialBalanceCents={totals.initialBalanceCents}
      />
    </div>
  )
}
