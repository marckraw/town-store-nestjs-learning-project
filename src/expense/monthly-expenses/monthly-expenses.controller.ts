import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  MonthlyExpense,
  MonthlyExpensesWithMetadata,
} from './monthly-expenses.interface';
import { NewMonthlyExpenseDto } from './dto/new-monthly-expense.dto';
import { UpdateMonthlyExpenseDto } from './dto/update-monthly-expense.dto';
import { MonthlyExpensesService } from './monthly-expenses.service';

@Controller('monthly-expenses')
export class MonthlyExpensesController {
  constructor(private monthlyExpensesService: MonthlyExpensesService) {}
  @Get()
  getAll(@Query('name') searchByName: string): MonthlyExpensesWithMetadata {
    return this.monthlyExpensesService.getAll(searchByName);
  }

  @Get(':monthlyExpenseId')
  getOne(
    @Param('monthlyExpenseId', ParseIntPipe) monthlyExpenseId: number,
  ): MonthlyExpense {
    return this.monthlyExpensesService.getOneById(monthlyExpenseId);
  }

  @Post()
  addNewMonthlyExpense(@Body() payload: NewMonthlyExpenseDto): MonthlyExpense {
    return this.monthlyExpensesService.createNew(payload);
  }

  @Patch(':monthlyExpenseId')
  updateMonthlyExpense(
    @Param('monthlyExpenseId') monthlyExpenseId: number,
    @Body() monthlyExpense: UpdateMonthlyExpenseDto,
  ) {
    return this.monthlyExpensesService.update(monthlyExpenseId, monthlyExpense);
  }

  @Delete(':monthlyExpenseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('monthlyExpenseId') monthlyExpenseId: number): void {
    return this.monthlyExpensesService.removeById(monthlyExpenseId);
  }
}
