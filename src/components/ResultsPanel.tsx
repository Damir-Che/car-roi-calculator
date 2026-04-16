import type { CalcResults, CarInputs } from '../types';
import { formatCurrency, formatPercent, formatMonths } from '../utils/format';

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  danger?: boolean;
}

function MetricCard({ label, value, sub, highlight, danger }: MetricCardProps) {
  return (
    <div
      className={`rounded-xl p-4 flex flex-col gap-1 ${
        highlight
          ? 'bg-blue-600 text-white'
          : danger
          ? 'bg-red-50 border border-red-200'
          : 'bg-slate-50 border border-slate-100'
      }`}
    >
      <span
        className={`text-xs font-medium uppercase tracking-wide ${
          highlight ? 'text-blue-200' : danger ? 'text-red-400' : 'text-slate-400'
        }`}
      >
        {label}
      </span>
      <span
        className={`text-2xl font-bold ${
          highlight ? 'text-white' : danger ? 'text-red-600' : 'text-slate-800'
        }`}
      >
        {value}
      </span>
      {sub && (
        <span className={`text-xs ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>
          {sub}
        </span>
      )}
    </div>
  );
}

interface BreakdownRowProps {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
  separator?: boolean;
}

function BreakdownRow({ label, value, color = 'text-slate-700', bold, separator }: BreakdownRowProps) {
  return (
    <>
      {separator && <div className="border-t border-slate-100 my-1" />}
      <div className="flex justify-between items-center py-1.5">
        <span className={`text-sm ${bold ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
          {label}
        </span>
        <span className={`text-sm font-semibold ${color}`}>{value}</span>
      </div>
    </>
  );
}

interface Props {
  results: CalcResults;
  inputs: CarInputs;
}

export default function ResultsPanel({ results, inputs }: Props) {
  const {
    monthlyRevenue,
    commission,
    revenueAfterCommission,
    netProfit,
    annualROI,
    paybackMonths,
    paybackYears,
    isViable,
  } = results;

  const noData = inputs.carPrice === 0 && inputs.dailyRate === 0;

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Чистая прибыль / мес"
          value={noData ? '—' : formatCurrency(netProfit)}
          highlight={isViable && !noData}
          danger={!isViable && !noData}
        />
        <MetricCard
          label="Годовой ROI"
          value={annualROI !== null && !noData ? formatPercent(annualROI) : '—'}
          highlight={isViable && !noData}
          danger={!isViable && !noData}
        />
        <MetricCard
          label="Срок окупаемости"
          value={paybackMonths !== null && !noData ? formatMonths(paybackMonths) : isViable ? '∞' : '—'}
          sub={
            paybackYears !== null && !noData
              ? `≈ ${paybackYears.toFixed(1)} лет`
              : undefined
          }
        />
        <MetricCard
          label="Оборот в месяц"
          value={noData ? '—' : formatCurrency(monthlyRevenue)}
        />
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Разбивка доходов</h3>

        <BreakdownRow
          label="Месячный оборот"
          value={formatCurrency(monthlyRevenue)}
          color="text-emerald-600"
        />
        <BreakdownRow
          label={`Комиссия (${inputs.commissionPercent}%)`}
          value={`− ${formatCurrency(commission)}`}
          color="text-amber-500"
        />
        <BreakdownRow
          label="Доход после комиссии"
          value={formatCurrency(revenueAfterCommission)}
          color="text-slate-700"
          separator
        />
        <BreakdownRow
          label="Операционные расходы"
          value={`− ${formatCurrency(inputs.monthlyExpenses)}`}
          color="text-red-500"
        />
        <BreakdownRow
          label="Чистая прибыль инвестору"
          value={formatCurrency(netProfit)}
          color={netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}
          bold
          separator
        />
      </div>

      {!isViable && !noData && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3 items-start">
          <span className="text-amber-500 text-lg mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">Инвестиция нерентабельна</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Расходы превышают доход. Пересмотрите параметры: увеличьте дни аренды,
              цену или снизьте расходы.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
