import { NewMonthlyExpenseDto } from './new-monthly-expense.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMonthlyExpenseDto extends PartialType(
  NewMonthlyExpenseDto,
) {}
