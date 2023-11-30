import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  MonthlyExpense,
  MonthlyExpensesWithMetadata,
} from './monthly-expenses.interface';
import { monthlyExpenses, monthlyIncomes } from './monthly-expenses';
import { NewMonthlyExpenseDto } from './dto/new-monthly-expense.dto';
import { UpdateMonthlyExpenseDto } from './dto/update-monthly-expense.dto';
import { monthlyBudgetCategories } from './monthly-budget';

@Injectable()
export class MonthlyExpensesService {
  private monthlyExpenses: MonthlyExpense[] = monthlyExpenses;
  private logger = new Logger(MonthlyExpensesService.name);

  constructor() {}

  private generateNextId(): number {
    return Math.max(...this.monthlyExpenses.map((c) => c.id)) + 1;
  }

  findMonthlyExpense(monthlyExpenseId: number): MonthlyExpense {
    const monthlyExpense = this.monthlyExpenses.find(
      (monthlyExpense) => monthlyExpense.id === monthlyExpenseId,
    );
    if (!monthlyExpense) {
      throw new NotFoundException(
        `MonthlyExpense with id: ${monthlyExpenseId} not found`,
      );
    }
    return monthlyExpense;
  }

  createNew(monthlyExpense: NewMonthlyExpenseDto): MonthlyExpense {
    const newMonthlyExpense: MonthlyExpense = {
      id: this.generateNextId(),
      ...monthlyExpense,
    };

    this.logger.log('About to add');
    this.logger.log(newMonthlyExpense);

    this.logger.log(`Created monthlyExpense with id: ${newMonthlyExpense.id}`);

    this.monthlyExpenses.push(newMonthlyExpense);
    return newMonthlyExpense;
  }

  getAll(name: string = ''): MonthlyExpensesWithMetadata {
    const all = this.monthlyExpenses.filter((me) =>
      me.name.toLowerCase().includes(name.toLowerCase()),
    );

    const chf_monthly = all.reduce((acc, next) => {
      return acc + next.amount_chf;
    }, 0);

    const chf_splitted = all.reduce((acc, next) => {
      if (next.splitted) {
        return acc + next.my_part;
      } else {
        return acc + next.amount_chf;
      }
    }, 0);

    // this should go to monthly-incomes service when it is created
    const monthlyIncomesAmount = monthlyIncomes.reduce((acc, next) => {
      return acc + next.amount_chf;
    }, 0);

    const monthlyBudgetCategoriesAmount = monthlyBudgetCategories.reduce(
      (acc, next) => {
        return acc + next.amount_chf;
      },
      0,
    );

    const available_money_monthly_before_budget =
      monthlyIncomesAmount - chf_splitted;

    // and this should probably go to service which will calculate budget
    const available_money_monthly_after_budget =
      available_money_monthly_before_budget - monthlyBudgetCategoriesAmount;

    return {
      data: all,
      metadata: {
        chf_splitted: Number(chf_splitted.toFixed(2)),
        chf_monthly: Number(chf_monthly.toFixed(2)),
        available_money_monthly_before_budget: Number(
          available_money_monthly_before_budget.toFixed(2),
        ),
        available_money_monthly_after_budget: Number(
          available_money_monthly_after_budget.toFixed(2),
        ),
      },
    };
  }

  getOneById(id: number) {
    this.logger.verbose(`Read monthlyExpense id: ${id}`);
    this.logger.debug(`Read monthlyExpense id: ${id}`);
    this.logger.log(`Read monthlyExpense id: ${id}`);
    this.logger.warn(`Read monthlyExpense id: ${id}`);
    this.logger.error(`Read monthlyExpense id: ${id}`);
    this.logger.fatal(`Read monthlyExpense id: ${id}`);
    return this.findMonthlyExpense(id);
  }

  update(id: number, partialMonthlyExpense: UpdateMonthlyExpenseDto) {
    const monthlyExpenseToUpdate = this.findMonthlyExpense(id);
    Object.assign(monthlyExpenseToUpdate, partialMonthlyExpense);
    return monthlyExpenseToUpdate;
  }

  removeById(id: number): void {
    this.findMonthlyExpense(id);
    this.monthlyExpenses = this.monthlyExpenses.filter((p) => p.id !== id);
  }
}
