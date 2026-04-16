export interface CarInputs {
  carPrice: number;
  dailyRate: number;
  rentalDaysPerMonth: number;
  commissionPercent: number;
  monthlyExpenses: number;
}

export interface CalcResults {
  monthlyRevenue: number;
  commission: number;
  revenueAfterCommission: number;
  netProfit: number;
  annualROI: number | null;
  paybackMonths: number | null;
  paybackYears: number | null;
  isViable: boolean;
}
