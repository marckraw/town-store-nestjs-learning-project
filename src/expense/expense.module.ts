import { Module } from '@nestjs/common';
import { MonthlyExpensesController } from './monthly-expenses/monthly-expenses.controller';
import { MonthlyExpensesService } from './monthly-expenses/monthly-expenses.service';

@Module({
  controllers: [MonthlyExpensesController],
  providers: [MonthlyExpensesService],
})
export class ExpenseModule {}
