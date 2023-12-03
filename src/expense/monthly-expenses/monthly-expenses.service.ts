import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  MonthlyExpense,
  MonthlyExpensesWithMetadata,
} from './monthly-expenses.interface';
import { monthlyIncomes } from './monthly-expenses';
import { NewMonthlyExpenseDto } from './dto/new-monthly-expense.dto';
import { UpdateMonthlyExpenseDto } from './dto/update-monthly-expense.dto';
import { monthlyBudgetCategories } from './monthly-budget';
import { Knex } from 'knex';

@Injectable()
export class MonthlyExpensesService {
  private logger = new Logger(MonthlyExpensesService.name);

  constructor(@Inject('DBConnection') private readonly knex: Knex) {}
  private async _findMonthlyExpense(
    monthlyExpenseId: number,
  ): Promise<MonthlyExpense> {
    const monthlyExpense = await this.knex<MonthlyExpense>('monthly_expenses')
      .where({ id: monthlyExpenseId })
      .first();

    if (!monthlyExpense) {
      throw new NotFoundException(
        `MonthlyExpense with id: ${monthlyExpenseId} not found`,
      );
    }
    return monthlyExpense;
  }

  public async createNew(
    monthlyExpenseDto: NewMonthlyExpenseDto,
  ): Promise<MonthlyExpense> {
    try {
      const [newOne] = await this.knex<MonthlyExpense>(
        'monthly_expenses',
      ).insert({
        ...monthlyExpenseDto,
      });

      const newMonthlyExpense = await this._findMonthlyExpense(newOne);

      this.logger.log(
        `Created monthlyExpense with id: ${newMonthlyExpense.id}`,
      );

      return newMonthlyExpense;
    } catch (error) {
      if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new BadRequestException(
          `MonthlyExpense named "${monthlyExpenseDto.name}" already exist`,
        );
      }

      throw error;
    }
  }

  public async getAll(name: string = ''): Promise<MonthlyExpensesWithMetadata> {
    const all = (await this.knex<MonthlyExpense>('monthly_expenses')).filter(
      (me) => me.name.toLowerCase().includes(name.toLowerCase()),
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

  public async getOneById(id: number): Promise<MonthlyExpense> {
    this.logger.verbose(`Read monthlyExpense id: ${id}`);
    this.logger.debug(`Read monthlyExpense id: ${id}`);
    this.logger.log(`Read monthlyExpense id: ${id}`);
    this.logger.warn(`Read monthlyExpense id: ${id}`);
    this.logger.error(`Read monthlyExpense id: ${id}`);
    this.logger.fatal(`Read monthlyExpense id: ${id}`);

    return this._findMonthlyExpense(id);
  }

  // TODO: rewrite update to work with database
  update(id: number, partialMonthlyExpense: UpdateMonthlyExpenseDto) {
    const monthlyExpenseToUpdate = this._findMonthlyExpense(id);
    Object.assign(monthlyExpenseToUpdate, partialMonthlyExpense);
    return monthlyExpenseToUpdate;
  }

  public async removeById(
    id: number,
  ): Promise<{ id: number; removed: number }> {
    this._findMonthlyExpense(id);

    const removed = await this.knex<MonthlyExpense>('monthly_expenses')
      .where({ id })
      .delete();

    return { id, removed };
  }
}
