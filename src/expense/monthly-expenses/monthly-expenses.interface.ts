export interface MonthlyExpense {
  id: number;
  name: string;
  description?: string;
  amount: number;
  amount_chf: number;
  currency: string;
  splitted: boolean;
  my_part?: number;
}

export interface WithMetadata<T, U> {
  data: T[];
  metadata: U;
}

export type MonthlyExpensesWithMetadata = WithMetadata<
  MonthlyExpense,
  {
    chf_monthly: number;
    chf_splitted: number;
    available_money_monthly_before_budget: number;
    available_money_monthly_after_budget: number;
  }
>;
