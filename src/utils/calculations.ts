import type { CarInputs, CalcResults } from '../types';

export function calculate(inputs: CarInputs): CalcResults {
  const { carPrice, dailyRate, rentalDaysPerMonth, commissionPercent, monthlyExpenses } = inputs;

  const monthlyRevenue = dailyRate * rentalDaysPerMonth;
  const commission = monthlyRevenue * (commissionPercent / 100);
  const revenueAfterCommission = monthlyRevenue - commission;
  const netProfit = revenueAfterCommission - monthlyExpenses;
  const isViable = netProfit > 0;

  const annualROI =
    carPrice > 0 ? (netProfit * 12) / carPrice * 100 : null;

  const paybackMonths =
    netProfit > 0 && carPrice > 0 ? carPrice / netProfit : null;

  const paybackYears = paybackMonths !== null ? paybackMonths / 12 : null;

  return {
    monthlyRevenue,
    commission,
    revenueAfterCommission,
    netProfit,
    annualROI,
    paybackMonths,
    paybackYears,
    isViable,
  };
}
