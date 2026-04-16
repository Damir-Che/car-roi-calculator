import { useState, useMemo } from 'react';
import type { CarInputs } from '../types';
import { calculate } from '../utils/calculations';

const DEFAULT_INPUTS: CarInputs = {
  carPrice: 30000,
  dailyRate: 80,
  rentalDaysPerMonth: 20,
  commissionPercent: 20,
  monthlyExpenses: 500,
};

export function useCalculator() {
  const [inputs, setInputs] = useState<CarInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => calculate(inputs), [inputs]);

  function updateField(field: keyof CarInputs, raw: string) {
    const value = raw === '' ? 0 : parseFloat(raw);
    if (isNaN(value)) return;
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  return { inputs, results, updateField };
}
