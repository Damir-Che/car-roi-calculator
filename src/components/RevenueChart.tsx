import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { CalcResults, CarInputs } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  results: CalcResults;
  inputs: CarInputs;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function RevenueChart({ results, inputs }: Props) {
  const { monthlyRevenue, commission, revenueAfterCommission, netProfit } = results;

  const barData = [
    { label: 'Оборот', value: monthlyRevenue, color: '#3b82f6' },
    { label: 'Комиссия', value: commission, color: '#f59e0b' },
    { label: 'После комиссии', value: revenueAfterCommission, color: '#6366f1' },
    { label: 'Расходы', value: inputs.monthlyExpenses, color: '#ef4444' },
    { label: 'Прибыль', value: netProfit, color: netProfit >= 0 ? '#10b981' : '#ef4444' },
  ];

  const cumulativeData = Array.from({ length: 24 }, (_, i) => ({
    month: `${i + 1}`,
    cumulative: netProfit * (i + 1),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Структура доходов ($/мес)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">
          Накопленная прибыль за 24 месяца
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Горизонтальная линия — стоимость автомобиля (точка окупаемости)
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cumulativeData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Месяц', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v) => formatCurrency(Number(v))}
              labelFormatter={(l) => `Месяц ${l}`}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
              }}
            />
            <ReferenceLine
              y={inputs.carPrice}
              stroke="#3b82f6"
              strokeDasharray="6 3"
              label={{ value: 'Окупаемость', position: 'insideTopRight', fontSize: 10, fill: '#3b82f6' }}
            />
            <Bar
              dataKey="cumulative"
              radius={[4, 4, 0, 0]}
              fill="#10b981"
            >
              {cumulativeData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.cumulative < 0 ? '#ef4444' : '#10b981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
