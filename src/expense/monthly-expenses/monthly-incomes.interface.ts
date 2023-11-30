export interface MonthlyIncomes {
  id: number;
  name: string;
  description?: string;
  amount: number;
  amount_chf: number;
  currency: string;
  splitted: boolean;
  my_part?: number;
}
