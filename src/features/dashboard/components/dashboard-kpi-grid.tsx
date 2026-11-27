import { useTranslation } from "react-i18next"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
} from "lucide-react"
import { formatCentsToCurrency } from "@/lib/formatters"

interface DashboardKpiGridProps {
  totalIncomeCents: number
  totalExpenseCents: number
  initialBalanceCents?: number
}

export function DashboardKpiGrid({
  totalIncomeCents,
  totalExpenseCents,
  initialBalanceCents = 0,
}: DashboardKpiGridProps) {
  const { t } = useTranslation()

  const netSavingsCents = totalIncomeCents - totalExpenseCents
  const savingsRate =
    totalIncomeCents > 0
      ? Math.max(0, Math.round((netSavingsCents / totalIncomeCents) * 100))
      : 0

  const projectedClosingCents = initialBalanceCents + netSavingsCents

  const expenseBudgetRatio =
    totalIncomeCents > 0
      ? Math.min(100, Math.round((totalExpenseCents / totalIncomeCents) * 100))
      : 0

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/95 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-white/[0.16]">
        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              {t("dashboardPage.kpis.initialBalance")}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-zinc-900/80 text-zinc-300">
              <Landmark className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
              {formatCentsToCurrency(initialBalanceCents)}
            </span>
          </div>
        </div>
        <div className="mt-4 flex min-h-11 items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] text-zinc-400">
              {t("dashboardPage.kpis.initialBalanceNote")}
            </span>
          </div>
        </div>
      </div>

      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/95 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-white/[0.16]">
        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl transition-all group-hover:bg-emerald-500/10" />
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              {t("dashboardPage.kpis.monthlyIncome")}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-emerald-400 lg:text-3xl">
              {formatCentsToCurrency(totalIncomeCents)}
            </span>
          </div>
        </div>
        <div className="mt-4 flex min-h-11 flex-col justify-center space-y-1.5 border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <span>
              {t("dashboardPage.kpis.projectedIncome")}:{" "}
              {formatCentsToCurrency(totalIncomeCents)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/95 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-white/[0.16]">
        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-rose-500/5 blur-2xl transition-all group-hover:bg-rose-500/10" />
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              {t("dashboardPage.kpis.consolidatedExpenses")}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-rose-400 lg:text-3xl">
              {formatCentsToCurrency(totalExpenseCents)}
            </span>
          </div>
        </div>
        <div className="mt-4 flex min-h-11 flex-col justify-center space-y-1.5 border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="font-medium text-emerald-400">
              {t("dashboardPage.kpis.margin")}:{" "}
              {formatCentsToCurrency(Math.max(0, netSavingsCents))}
            </span>
            <span className="font-semibold text-amber-400">
              {expenseBudgetRatio}% {t("dashboardPage.kpis.consumed")}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
              style={{ width: `${Math.min(100, Math.max(5, expenseBudgetRatio))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/95 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-white/[0.16]">
        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              {t("dashboardPage.kpis.netSavings")}
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
              {t("dashboardPage.kpis.savingsRate")} {savingsRate}%
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`font-mono text-2xl font-bold tracking-tight lg:text-3xl ${
                netSavingsCents >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {netSavingsCents >= 0 ? "+" : "-"}
              {formatCentsToCurrency(Math.abs(netSavingsCents))}
            </span>
          </div>
        </div>
        <div className="mt-4 flex min-h-11 items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[11px]">
          <span className="text-zinc-400">
            {t("dashboardPage.kpis.projectedClose")}:
          </span>
          <span className="rounded border border-white/10 bg-zinc-900 px-2 py-0.5 font-bold text-white">
            {formatCentsToCurrency(projectedClosingCents)}
          </span>
        </div>
      </div>
    </section>
  )
}
