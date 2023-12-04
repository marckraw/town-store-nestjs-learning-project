import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class NewMonthlyExpenseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  amountChf: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsBoolean()
  @IsNotEmpty()
  splitted: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  myPart?: number;
}
