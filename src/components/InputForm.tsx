import type { CarInputs } from '../types';

interface Field {
  key: keyof CarInputs;
  label: string;
  prefix?: string;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  placeholder: string;
}

const FIELDS: Field[] = [
  {
    key: 'carPrice',
    label: 'Стоимость автомобиля',
    prefix: '$',
    min: 0,
    max: 500000,
    step: 1000,
    placeholder: '30 000',
  },
  {
    key: 'dailyRate',
    label: 'Цена аренды в день',
    prefix: '$',
    min: 0,
    max: 1000,
    step: 5,
    placeholder: '80',
  },
  {
    key: 'rentalDaysPerMonth',
    label: 'Дней аренды в месяц',
    suffix: 'дн.',
    min: 0,
    max: 31,
    step: 1,
    placeholder: '20',
  },
  {
    key: 'commissionPercent',
    label: 'Комиссия компании',
    suffix: '%',
    min: 0,
    max: 100,
    step: 0.5,
    placeholder: '20',
  },
  {
    key: 'monthlyExpenses',
    label: 'Ежемесячные расходы',
    prefix: '$',
    min: 0,
    max: 50000,
    step: 50,
    placeholder: '500',
  },
];

interface Props {
  inputs: CarInputs;
  onUpdate: (field: keyof CarInputs, value: string) => void;
}

export default function InputForm({ inputs, onUpdate }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Параметры инвестиции</h2>

      {FIELDS.map(({ key, label, prefix, suffix, min, max, step, placeholder }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            {label}
          </label>
          <div className="relative flex items-center">
            {prefix && (
              <span className="absolute left-3.5 text-slate-400 font-medium text-sm select-none">
                {prefix}
              </span>
            )}
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={inputs[key] || ''}
              placeholder={placeholder}
              onChange={(e) => onUpdate(key, e.target.value)}
              className={`
                w-full rounded-xl border border-slate-200 bg-slate-50
                py-3 text-sm font-medium text-slate-800
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all placeholder:text-slate-400
                ${prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-12' : 'px-4'}
              `}
            />
            {suffix && (
              <span className="absolute right-3.5 text-slate-400 font-medium text-sm select-none">
                {suffix}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
